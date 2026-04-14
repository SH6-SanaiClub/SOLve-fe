import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, IconButton, Icons } from '../../components/common'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { streamChatMessage } from '../../services/chatService'
import type { ChatAction, ChatMessage } from '../../types/chat'

const QUICK_QUESTIONS = [
  '내 점수/등급 알려줘',
  '오늘 추천 활동',
  '적금 추천해줘',
  '이번 달 활동 현황',
  '등급 올리는 방법',
] as const

const CHAT_ERROR_MESSAGE = '일시적인 오류가 발생했어요. 다시 시도해주세요.'

const createMessageId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Date.now().toString()

export const ChatbotPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(ROUTE_PATHS.home)
  }

  const handleSend = async (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText || isStreaming) {
      return
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: trimmedText,
    }

    const assistantMessageId = createMessageId()
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }

    setInput('')
    setIsStreaming(true)
    setMessages((prev) => [...prev, userMessage, assistantMessage])

    const handleAssistantUpdate = (updater: (message: ChatMessage) => ChatMessage) => {
      setMessages((prev) =>
        prev.map((message) => (message.id === assistantMessageId ? updater(message) : message)),
      )
    }

    await streamChatMessage(
      trimmedText,
      (chunk) => {
        handleAssistantUpdate((message) => ({
          ...message,
          content: `${message.content}${chunk}`,
        }))
      },
      (actions: ChatAction[]) => {
        handleAssistantUpdate((message) => ({
          ...message,
          actions,
        }))
      },
      () => {
        handleAssistantUpdate((message) => ({
          ...message,
          isStreaming: false,
        }))
        setIsStreaming(false)
      },
      (errorMessage) => {
        handleAssistantUpdate((message) => ({
          ...message,
          content: errorMessage || CHAT_ERROR_MESSAGE,
          isStreaming: false,
        }))
        setIsStreaming(false)
      },
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend(input)
    }
  }

  const handleQuickQuestionClick = (question: string) => {
    void handleSend(question)
  }

  const handleActionClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="relative min-h-screen bg-bg-light font-pretendard">
      <MainLayout
        header={
          <Header
            bgColor="bg-bg-light"
            left={
              <IconButton
                label="뒤로가기"
                icon={<Icons.Back size={20} />}
                size="sm"
                onClick={handleBack}
              />
            }
            title="AI 상담"
          />
        }
        className="bg-bg-light"
      >
        <div className="-mx-4 flex min-h-[calc(100vh-var(--header-h)-48px)] flex-col bg-bg-light px-(--side-padding)">
          <div className="flex-1 pb-[112px] pt-2">
            {messages.length === 0 ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-10">
                <div className="text-center">
                  <p className="text-lg font-semibold text-font-main">무엇이든 물어보세요</p>
                  <p className="mt-2 text-sm text-font-sub">
                    점수, 활동, 금융 상품에 대해 알려드릴게요
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleQuickQuestionClick(question)}
                      disabled={isStreaming}
                      className="w-full rounded-control border border-gray-200 bg-white px-4 py-3 text-left text-sm text-font-main transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 py-4">
                {messages.map((message) => {
                  const isUserMessage = message.role === 'user'

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-2 ${
                        isUserMessage ? 'items-end' : 'items-start'
                      }`}
                    >
                      <Card
                        className={`!w-auto !max-w-[82%] !gap-0 !border-0 !px-4 !py-3 shadow-sm ${
                          isUserMessage
                            ? '!rounded-[20px] !rounded-tr-[6px] !bg-primary-500 text-white'
                            : '!rounded-[20px] !rounded-tl-[6px] !bg-white text-font-main'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm leading-6">
                          {message.content}
                          {message.isStreaming ? (
                            <span className="ml-1 inline-block animate-pulse align-middle text-sm">
                              |
                            </span>
                          ) : null}
                        </div>
                      </Card>

                      {!isUserMessage && message.actions?.length ? (
                        <div className="flex w-full max-w-[82%] flex-col gap-2">
                          {message.actions.map((action) => (
                            <Button
                              key={`${message.id}-${action.path}-${action.label}`}
                              type="button"
                              variant="outline"
                              size="sm"
                              fullWidth
                              onClick={() => handleActionClick(action.path)}
                              className="!h-auto !justify-start !rounded-control !px-4 !py-3 !text-left !text-sm"
                            >
                              <span className="flex w-full items-center justify-between gap-3">
                                <span>{action.label}</span>
                                <Icons.ArrowRight size={16} />
                              </span>
                            </Button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>
      </MainLayout>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="pointer-events-auto mx-auto w-full max-w-[600px] bg-transparent px-(--side-padding) pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <div className="flex items-end gap-2 rounded-[20px] border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="메시지를 입력하세요..."
              className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-font-main placeholder:text-font-sub outline-none"
            />

            <Button
              type="button"
              size="sm"
              onClick={() => void handleSend(input)}
              disabled={!input.trim() || isStreaming}
              className="!h-9 !w-9 !rounded-full !p-0"
            >
              <Icons.ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
