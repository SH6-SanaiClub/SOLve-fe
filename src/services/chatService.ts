import { apiClient } from './apiClient'
import type { ChatAction } from '../types/chat'

const CHAT_CONNECTION_ERROR_MESSAGE = '챗봇 연결에 실패했어요. 다시 시도해주세요.'
const CHAT_STREAM_ERROR_MESSAGE = '응답 처리 중 오류가 발생했어요.'

export const streamChatMessage = async (
  message: string,
  onChunk: (text: string) => void,
  onActions: (actions: ChatAction[]) => void,
  onDone: () => void,
  onError: (message: string) => void,
): Promise<void> => {
  const baseURL = (apiClient.defaults.baseURL ?? '/api').replace(/\/$/, '')
  const defaultHeaders = apiClient.defaults.headers.common as Record<string, unknown> | undefined
  const authHeader = defaultHeaders?.Authorization as string | undefined
  const accessToken = authHeader?.replace('Bearer ', '') ?? localStorage.getItem('accessToken')

  let response: Response

  try {
    response = await fetch(`${baseURL}/v1/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ message }),
    })
  } catch {
    onError(CHAT_CONNECTION_ERROR_MESSAGE)
    return
  }

  if (!response.ok || !response.body) {
    onError(CHAT_CONNECTION_ERROR_MESSAGE)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let currentEventType = ''
  let hasErrored = false
  let hasCompleted = false

  const getEventData = (line: string) => {
    if (!line.startsWith('data:')) {
      return ''
    }

    const rawData = line.slice(5)
    return rawData.startsWith(' ') ? rawData.slice(1) : rawData
  }

  const handleEventData = (eventType: string, data: string) => {
    if (eventType === 'chunk') {
      onChunk(data)
      return
    }

    if (eventType === 'actions') {
      try {
        const actions = JSON.parse(data) as ChatAction[]
        onActions(actions)
      } catch {
        // Ignore malformed action payloads without breaking the stream.
      }
      return
    }

    if (eventType === 'done') {
      hasCompleted = true
      onDone()
      return
    }

    if (eventType === 'error') {
      hasErrored = true
      onError(data || '오류가 발생했어요.')
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line) {
          continue
        }

        if (line.startsWith('event:')) {
          currentEventType = line.slice(6).trim()
          continue
        }

        if (line.startsWith('data:')) {
          const data = getEventData(line)
          handleEventData(currentEventType, data)
        }
      }
    }

    if (buffer.startsWith('data:')) {
      handleEventData(currentEventType, getEventData(buffer))
    }
  } catch {
    if (!hasErrored) {
      hasErrored = true
      onError(CHAT_STREAM_ERROR_MESSAGE)
    }
  } finally {
    reader.releaseLock()
  }

  if (!hasCompleted && !hasErrored) {
    onDone()
  }
}
