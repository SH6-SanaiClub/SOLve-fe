import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CompositionEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, IconButton, Icons } from '../../components/common'
import Header from '../../components/layout/Header'
import MainLayout from '../../components/layout/MainLayout'
import { getS3AssetUrl } from '../../constants/assetUrls'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { clearChatHistory, getChatHistory, streamChatMessage } from '../../services/chatService'
import type { ChatAction, ChatHistoryMessage, ChatMessage } from '../../types/chat'

const BOT_PROFILE_IMAGE_URL = getS3AssetUrl('chatbot.png')

const INITIAL_QUICK_QUESTIONS = [
  '내 점수/등급 알려줘',
  '오늘 추천 활동',
  '적금 추천해줘',
  '이번 달 활동 현황',
  '등급 올리는 방법',
] as const

const FOLLOW_UP_QUESTION_MAP = {
  finance: ['다른 적금 상품도 비교해줘', '금리 조건 다시 정리해줘', '나한테 가장 유리한 적금은?', '대출도 알려줘'],
  financeDetail: ['이 적금 가입 조건이 뭐야?', '금리 얼마야?', '지금 가입하면 유리해?', '다른 상품도 보여줘'],
  score: ['왜 현재 점수가 이렇게 계산됐어?', '이번 달 활동 현황 알려줘', '등급 올리기 좋은 활동 추천해줘', '오늘 추천 활동 알려줘'],
  activity: ['오늘 바로 할 수 있는 활동은?', '퀴즈로 점수 올리는 법 알려줘', '기부 관련 활동 추천해줘', '이번 달 활동 현황 알려줘'],
  environment: ['친환경 인증은 어떻게 해?', 'E 활동 점수 얼마야?', '오늘 E 활동 할 수 있어?', '다른 활동도 추천해줘'],
  donation: ['지금 기부 캠페인 뭐 있어?', '기부하면 점수 얼마 올라?', '봉사도 추천해줘', '이번 달 S 활동 현황은?'],
  volunteer: ['봉사 신청은 어떻게 해?', '봉사하면 점수 얼마 올라?', '기부도 추천해줘', '이번 달 S 활동 현황은?'],
  quiz: ['퀴즈 매일 해야 해?', '퀴즈 점수는 얼마야?', '다른 G 활동도 있어?', '이번 달 G 활동 현황은?'],
  default: ['내 점수/등급 알려줘', '오늘 추천 활동', '적금 추천해줘', '이번 달 활동 현황'],
} as const

const CHAT_ERROR_MESSAGE = '일시적인 오류가 발생했어요. 다시 시도해주세요.'
const CHAT_CONTENT_TOP_GAP = 12
const CHAT_CONTENT_MIN_HEIGHT = `calc(100dvh - var(--header-h) - env(safe-area-inset-top) - ${CHAT_CONTENT_TOP_GAP}px)`
const CHAT_BOTTOM_GAP = 12
const CHAT_BOTTOM_OVERLAY_FALLBACK_HEIGHT = 136
const STREAMING_DOT_DELAY_CLASS_NAMES = [
  '',
  '[animation-delay:150ms]',
  '[animation-delay:300ms]',
] as const
const STREAM_INITIAL_DELAY_MS = 300
const STREAM_DRAIN_INTERVAL_MS = 68
const STREAM_FINAL_SETTLE_MS = 300
const MESSAGE_STAGGER_MS = 42
const CHIP_STAGGER_MS = 36

type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: Array<{ marker: string; text: string }> }

const createMessageId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const normalizeChatText = (content: string) =>
  content
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .replace(/#\s?/g, '')
    .replace(/>\s?/g, '')
    .replace(/(?<!\n)(\d+\.)\s*(?=[A-Za-z가-힣])/g, '\n$1 ')
    .replace(/(?<!\n)(-)\s*(?=[A-Za-z가-힣])/g, '\n$1 ')
    .replace(/(^|\n)(\d+)\.\s*([A-Za-z가-힣])/g, '$1$2. $3')
    .replace(/([가-힣])([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])([가-힣])/g, '$1 $2')
    .replace(/([가-힣])((?:\d+(?:\/\d+)?)(?:점|개월|회|만원|원|P|%))/g, '$1 $2')
    .replace(/([ESG])활동/g, '$1 활동')
    .replace(/([가-힣0-9]+)(으로|에서|에게|처럼|까지|부터|보다|마다)([가-힣]{2,})/g, '$1$2 $3')
    .replace(/([가-힣0-9]+)(은|는|이|가|을|를|와|과|의|도|로|에)([가-힣]{2,})/g, '$1$2 $3')
    .replace(/(다음과 같은)([가-힣])/g, '$1 $2')
    .replace(/(위 활동들을 통해)([가-힣])/g, '$1 $2')
    .replace(/(버튼에서)([가-힣])/g, '$1 $2')
    .replace(/^참고 액션:.*$/gm, '')
    .replace(/^추천 후속 질문:.*$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const buildEntranceStyle = (delayMs = 0, durationMs = 420) => ({
  animation: `chatFadeUp ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  animationDelay: `${delayMs}ms`,
})

const toChatMessage = (message: ChatHistoryMessage): ChatMessage => ({
  id: createMessageId(),
  role: message.role,
  content: message.role === 'assistant' ? normalizeChatText(message.content) : message.content,
  actions: message.actions ?? undefined,
  suggestions: message.suggestions ?? undefined,
})

const parseMessageBlocks = (content: string): MessageBlock[] => {
  const lines = content.replace(/\r/g, '').split('\n')
  const blocks: MessageBlock[] = []
  let currentParagraph: string[] = []
  let currentList: Array<{ marker: string; text: string }> = []

  const flushParagraph = () => {
    if (currentParagraph.length === 0) {
      return
    }

    blocks.push({
      type: 'paragraph',
      text: currentParagraph.join('\n'),
    })
    currentParagraph = []
  }

  const flushList = () => {
    if (currentList.length === 0) {
      return
    }

    blocks.push({
      type: 'list',
      items: [...currentList],
    })
    currentList = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    if (/^\d+\.\s/.test(line) || /^[-•]\s/.test(line)) {
      flushParagraph()
      const orderedMatch = line.match(/^(\d+\.)\s+(.*)$/)
      if (orderedMatch) {
        currentList.push({
          marker: orderedMatch[1],
          text: orderedMatch[2].trim(),
        })
        continue
      }

      const unorderedMatch = line.match(/^([-•])\s+(.*)$/)
      if (unorderedMatch) {
        currentList.push({
          marker: unorderedMatch[1],
          text: unorderedMatch[2].trim(),
        })
      }
      continue
    }

    flushList()
    currentParagraph.push(line)
  }

  flushParagraph()
  flushList()

  if (blocks.length > 0) {
    return blocks
  }

  const trimmedContent = content.trim()
  return trimmedContent ? [{ type: 'paragraph', text: trimmedContent }] : []
}

const normalizeQuestionSeed = (question: string) => question.replace(/\s+/g, '').trim()

const filterOut = (questions: readonly string[], latestQuestion: string): string[] => {
  const normalizedLatestQuestion = normalizeQuestionSeed(latestQuestion)

  return questions.filter((question) => {
    if (!normalizedLatestQuestion) {
      return true
    }

    const normalizedQuestion = normalizeQuestionSeed(question)
    return (
      !normalizedLatestQuestion.includes(normalizedQuestion) &&
      !normalizedQuestion.includes(normalizedLatestQuestion)
    )
  })
}

const withFallbackQuestions = (questions: readonly string[], latestQuestion: string) => {
  const primaryQuestions = filterOut(questions, latestQuestion)

  if (primaryQuestions.length >= 4) {
    return primaryQuestions.slice(0, 4)
  }

  const fallbackQuestions = filterOut(FOLLOW_UP_QUESTION_MAP.default, latestQuestion).filter(
    (question) => !primaryQuestions.includes(question),
  )

  return [...primaryQuestions, ...fallbackQuestions].slice(0, 4)
}

const getFollowUpQuestions = (messages: ChatMessage[]) => {
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')

  if (!latestAssistantMessage) {
    return [...INITIAL_QUICK_QUESTIONS]
  }

  if (latestAssistantMessage.suggestions?.length) {
    return withFallbackQuestions(latestAssistantMessage.suggestions, latestUserMessage?.content ?? '')
  }

  const content = latestAssistantMessage.content
  const latestQuestion = latestUserMessage?.content ?? ''
  const actionPaths = latestAssistantMessage.actions?.map((action) => action.path) ?? []
  const activityKeywords = ['활동', '환경', '기부', '봉사', '가치가게', '퀴즈', '점수 올리기', '쉬운 활동']
  const financeKeywords = ['적금', '대출', '금리', '금융 상품']
  const scoreKeywords = ['등급', '점수', '현황']
  const hasFinanceDetailAction = actionPaths.some(
    (path) => path.startsWith(`${ROUTE_PATHS.finance}/`) && path !== ROUTE_PATHS.finance,
  )

  if (
    actionPaths.some((path) => path === ROUTE_PATHS.my || path === ROUTE_PATHS.myGrade) ||
    scoreKeywords.some((keyword) => latestQuestion.includes(keyword) || content.includes(keyword))
  ) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.score, latestQuestion)
  }

  if (actionPaths.some((path) => path === ROUTE_PATHS.activityEnvironment)) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.environment, latestQuestion)
  }

  if (actionPaths.some((path) => path === ROUTE_PATHS.activitySocialDonation)) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.donation, latestQuestion)
  }

  if (actionPaths.some((path) => path === ROUTE_PATHS.activitySocialVolunteer)) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.volunteer, latestQuestion)
  }

  if (actionPaths.some((path) => path === ROUTE_PATHS.esgQuiz)) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.quiz, latestQuestion)
  }

  if (hasFinanceDetailAction) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.financeDetail, latestQuestion)
  }

  if (
    actionPaths.some(
      (path) =>
        path === ROUTE_PATHS.activitySocialStore ||
        path.startsWith(ROUTE_PATHS.activityEnvironment) ||
        path.startsWith(ROUTE_PATHS.esgSocial) ||
        path === ROUTE_PATHS.esgQuiz,
    ) ||
    activityKeywords.some((keyword) => latestQuestion.includes(keyword) || content.includes(keyword))
  ) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.activity, latestQuestion)
  }

  if (
    actionPaths.some((path) => path.startsWith(ROUTE_PATHS.finance)) ||
    financeKeywords.some((keyword) => latestQuestion.includes(keyword) || content.includes(keyword))
  ) {
    return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.finance, latestQuestion)
  }

  return withFallbackQuestions(FOLLOW_UP_QUESTION_MAP.default, latestQuestion)
}

interface ChatMessageBubbleProps {
  message: ChatMessage
  onActionClick: (path: string) => void
  sequence: number
}

const ChatMessageBubble = ({ message, onActionClick, sequence }: ChatMessageBubbleProps) => {
  const isUserMessage = message.role === 'user'
  const blocks = parseMessageBlocks(message.content)
  const messageDelay = Math.min(sequence * MESSAGE_STAGGER_MS, 220)

  if (isUserMessage) {
    return (
      <div className="flex justify-end" style={buildEntranceStyle(messageDelay, 360)}>
        <Card className="!w-auto !max-w-[82%] !gap-0 !rounded-control !border-0 !bg-primary-400 !px-4 !py-3 text-white shadow-sm transition-transform duration-300">
          <div className="space-y-3 break-words text-sm leading-7">
            {blocks.map((block, index) => (
              <p
                key={`${message.id}-paragraph-${index}`}
                className="whitespace-pre-wrap text-sm leading-7"
              >
                {block.type === 'paragraph' ? block.text : block.items.join('\n')}
              </p>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-start" style={buildEntranceStyle(messageDelay)}>
      <div className="flex max-w-[90%] items-start gap-3">
        <div
          className="mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-white/80"
          style={message.isStreaming ? { animation: 'chatAvatarPulse 2.2s ease-in-out infinite' } : undefined}
        >
          <img src={BOT_PROFILE_IMAGE_URL} alt="SOLve 챗봇" className="h-full w-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div>
            <p className="text-[11px] font-semibold text-font-main">SOLve 사용 도우미</p>
          </div>

          <Card className="!w-auto !max-w-full !gap-0 !rounded-control !border !border-gray-100 !bg-white !px-4 !py-3 text-font-main shadow-sm transition-[transform,box-shadow] duration-300">
            <div className="space-y-4 break-words text-sm leading-7">
              {message.isStreaming && !message.content.trim() ? (
                <div className="flex items-center py-1.5">
                  <span className="inline-flex gap-1.5">
                    {STREAMING_DOT_DELAY_CLASS_NAMES.map((delayClassName, index) => (
                      <span
                        key={`${message.id}-streaming-dot-empty-${index}`}
                        className={`h-[6px] w-[6px] rounded-full bg-primary-300 animate-bounce ${delayClassName}`}
                      />
                    ))}
                  </span>
                </div>
              ) : null}

              {blocks.map((block, blockIndex) =>
                block.type === 'list' ? (
                  <ol key={`${message.id}-list-${blockIndex}`} className="flex flex-col gap-1 pl-1">
                    {block.items.map((item, itemIndex) => (
                      <li
                        key={`${message.id}-list-item-${blockIndex}-${itemIndex}`}
                        className="flex gap-2 text-sm leading-6"
                      >
                        <span className="shrink-0 font-semibold text-primary-500">{item.marker}</span>
                        <span className="min-w-0 whitespace-pre-wrap">{item.text}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p
                    key={`${message.id}-paragraph-${blockIndex}`}
                    className="whitespace-pre-wrap text-sm leading-7"
                  >
                    {block.text}
                  </p>
                ),
              )}

              {message.isStreaming ? (
                message.content.trim() ? (
                  <div className="flex items-center pt-1">
                    <span className="inline-flex gap-[4px] align-middle">
                      {STREAMING_DOT_DELAY_CLASS_NAMES.map((delayClassName, index) => (
                        <span
                          key={`${message.id}-streaming-dot-${index}`}
                          className={`h-[5px] w-[5px] rounded-full bg-gray-300 animate-bounce ${delayClassName}`}
                        />
                      ))}
                    </span>
                  </div>
                ) : null
              ) : null}
            </div>
          </Card>

          {!message.isStreaming && message.actions?.length ? (
            <div className="flex flex-col gap-2">
              {message.actions.map((action, actionIndex) => (
                <Button
                  key={`${message.id}-${action.path}-${action.label}`}
                  type="button"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => onActionClick(action.path)}
                  className="!h-auto !justify-start !rounded-control !border-gray-200 !bg-white !px-4 !py-3 !text-left !text-sm !text-font-main shadow-sm"
                  style={buildEntranceStyle(messageDelay + 90 + actionIndex * 50, 340)}
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
      </div>
    </div>
  )
}

export const ChatbotPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isResettingHistory, setIsResettingHistory] = useState(false)
  const [bottomOverlayHeight, setBottomOverlayHeight] = useState(CHAT_BOTTOM_OVERLAY_FALLBACK_HEIGHT)
  const contentRef = useRef<HTMLElement | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomOverlayRef = useRef<HTMLDivElement | null>(null)
  const hasRequestedNotificationPermissionRef = useRef(false)
  const isComposingRef = useRef(false)
  const streamQueueRef = useRef('')
  const streamTimerRef = useRef<number | null>(null)
  const streamFinishTimerRef = useRef<number | null>(null)
  const pendingReplaceRef = useRef<string | null>(null)
  const streamDoneRef = useRef(false)
  const hasStartedStreamingRenderRef = useRef(false)
  const historyLoadRequestIdRef = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth', block: 'end' })
  }, [messages, isStreaming])

  useEffect(() => {
    return () => {
      if (streamTimerRef.current !== null) {
        window.clearTimeout(streamTimerRef.current)
      }
      if (streamFinishTimerRef.current !== null) {
        window.clearTimeout(streamFinishTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const element = bottomOverlayRef.current
    if (!element) {
      return
    }

    const updateHeight = () => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height)
      if (nextHeight > 0) {
        setBottomOverlayHeight(nextHeight)
      }
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserver.observe(element)
    window.addEventListener('resize', updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [messages.length, isStreaming])

  useEffect(() => {
    if (isLoadingHistory || messages.length > 0) {
      return
    }

    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [isLoadingHistory, messages.length])

  useEffect(() => {
    let mounted = true

    const loadHistory = async () => {
      const requestId = ++historyLoadRequestIdRef.current
      try {
        const history = await getChatHistory()
        if (!mounted || requestId !== historyLoadRequestIdRef.current) {
          return
        }
        setMessages(history.map(toChatMessage))
      } catch {
        if (!mounted) {
          return
        }
        setMessages([])
      } finally {
        if (mounted) {
          setIsLoadingHistory(false)
        }
      }
    }

    void loadHistory()

    return () => {
      mounted = false
    }
  }, [])

  const handleBack = () => {
    navigate(ROUTE_PATHS.home)
  }

  const handleSend = async (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText || isStreaming || isLoadingHistory || isResettingHistory) {
      return
    }

    if (
      'Notification' in window &&
      Notification.permission === 'default' &&
      !hasRequestedNotificationPermissionRef.current
    ) {
      hasRequestedNotificationPermissionRef.current = true
      void Notification.requestPermission()
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
    streamQueueRef.current = ''
    pendingReplaceRef.current = null
    streamDoneRef.current = false
    hasStartedStreamingRenderRef.current = false
    if (streamTimerRef.current !== null) {
      window.clearTimeout(streamTimerRef.current)
      streamTimerRef.current = null
    }
    if (streamFinishTimerRef.current !== null) {
      window.clearTimeout(streamFinishTimerRef.current)
      streamFinishTimerRef.current = null
    }
    setMessages((prev) => [...prev, userMessage, assistantMessage])

    const handleAssistantUpdate = (updater: (message: ChatMessage) => ChatMessage) => {
      setMessages((prev) =>
        prev.map((message) => (message.id === assistantMessageId ? updater(message) : message)),
      )
    }

    const drainStreamQueue = () => {
      if (!streamQueueRef.current) {
        scheduleStreamingFinish()
        return
      }

      const queueLength = streamQueueRef.current.length
      const drainSize = queueLength > 240 ? 7 : queueLength > 160 ? 6 : queueLength > 96 ? 5 : 3
      const nextText = streamQueueRef.current.slice(0, drainSize)
      streamQueueRef.current = streamQueueRef.current.slice(drainSize)
      hasStartedStreamingRenderRef.current = true

      handleAssistantUpdate((message) => ({
        ...message,
        content: `${message.content}${nextText}`,
      }))

      if (streamQueueRef.current) {
        scheduleStreamDrain()
        return
      }

      scheduleStreamingFinish()
    }

    const finalizeStreaming = () => {
      if (pendingReplaceRef.current) {
        const finalText = pendingReplaceRef.current
        pendingReplaceRef.current = null
        handleAssistantUpdate((message) => ({
          ...message,
          content: finalText,
        }))
      }

      handleAssistantUpdate((message) => ({
        ...message,
        isStreaming: false,
      }))
      setIsStreaming(false)

      if (
        document.hidden &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification('SOLve 챗봇', {
          body: '답변이 도착했어요.',
          icon: '/solve-icon.png',
        })
      }
    }

    const scheduleStreamingFinish = () => {
      if (!streamDoneRef.current) {
        return
      }

      if (streamQueueRef.current || streamTimerRef.current !== null) {
        return
      }

      if (streamFinishTimerRef.current !== null) {
        return
      }

      streamFinishTimerRef.current = window.setTimeout(() => {
        streamFinishTimerRef.current = null
        finalizeStreaming()
      }, STREAM_FINAL_SETTLE_MS)
    }

    const scheduleStreamDrain = () => {
      if (streamTimerRef.current !== null) {
        return
      }

      const delay = hasStartedStreamingRenderRef.current
        ? STREAM_DRAIN_INTERVAL_MS
        : STREAM_INITIAL_DELAY_MS

      streamTimerRef.current = window.setTimeout(() => {
        streamTimerRef.current = null
        drainStreamQueue()
      }, delay)
    }

    await streamChatMessage(
      trimmedText,
      (chunk) => {
        streamQueueRef.current += chunk
        scheduleStreamDrain()
      },
      (fullText) => {
        pendingReplaceRef.current = normalizeChatText(fullText)
        scheduleStreamingFinish()
      },
      (actions: ChatAction[]) => {
        handleAssistantUpdate((message) => ({
          ...message,
          actions,
        }))
      },
      (suggestions: string[]) => {
        handleAssistantUpdate((message) => ({
          ...message,
          suggestions,
        }))
      },
      () => {
        streamDoneRef.current = true
        scheduleStreamingFinish()
      },
      (errorMessage) => {
        if (streamTimerRef.current !== null) {
          window.clearTimeout(streamTimerRef.current)
          streamTimerRef.current = null
        }
        if (streamFinishTimerRef.current !== null) {
          window.clearTimeout(streamFinishTimerRef.current)
          streamFinishTimerRef.current = null
        }
        pendingReplaceRef.current = null
        streamQueueRef.current = ''
        streamDoneRef.current = false
        handleAssistantUpdate((message) => ({
          ...message,
          content: errorMessage || CHAT_ERROR_MESSAGE,
          isStreaming: false,
          actions: undefined,
        }))
        setIsStreaming(false)
      },
    )
  }

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (event: CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false
    setInput(event.currentTarget.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || isComposingRef.current) {
      return
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend(event.currentTarget.value)
    }
  }

  const handleQuestionClick = (question: string) => {
    if (isLoadingHistory || isResettingHistory) {
      return
    }
    void handleSend(question)
  }

  const handleActionClick = (path: string) => {
    navigate(path, {
      state: {
        returnTo: ROUTE_PATHS.chatbot,
      },
    })
  }

  const handleResetChat = async () => {
    if (isStreaming || isLoadingHistory || isResettingHistory) {
      return
    }

    setIsResettingHistory(true)
    historyLoadRequestIdRef.current += 1

    try {
      await clearChatHistory()
      setMessages([])
    } catch {
      // keep current history on failure
    } finally {
      setIsResettingHistory(false)
    }
  }

  const followUpQuestions = getFollowUpQuestions(messages)
  const isBusy = isStreaming || isLoadingHistory || isResettingHistory

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#F7FAFF_0%,#EDF3FF_100%)] font-pretendard">
      <style>{`
        @keyframes chatFadeUp {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes chatAvatarPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.14);
          }
          50% {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        @keyframes chatChipRise {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

      `}</style>
      <MainLayout
        contentRef={contentRef}
        header={
          <Header
            bgColor="bg-white"
            className="border-b border-[#E7EDF7] shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
            left={
              <IconButton
                label="뒤로가기"
                icon={<Icons.Back size={20} />}
                size="sm"
                onClick={handleBack}
              />
            }
            title="SOLve 도우미"
            right={
              messages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => void handleResetChat()}
                  className="inline-flex items-center text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  새로 채팅하기
                </button>
              ) : null
            }
          />
        }
        contentSpacing="spacious"
        className="bg-transparent"
      >
        <div
          className="-mx-4 flex flex-col px-(--side-padding)"
          style={{ minHeight: CHAT_CONTENT_MIN_HEIGHT }}
        >
          <div
            className="flex flex-1 flex-col pt-3"
            style={{ paddingBottom: `${bottomOverlayHeight + CHAT_BOTTOM_GAP}px` }}
          >
            {isLoadingHistory ? (
              <div className="flex flex-1 items-center justify-center text-sm text-font-sub">
                대화 내용을 불러오는 중입니다...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-4 pt-12 text-center">
                <div className="mb-5 h-20 w-20 overflow-hidden rounded-full bg-white shadow-sm">
                  <img src={BOT_PROFILE_IMAGE_URL} alt="SOLve 챗봇" className="h-full w-full object-cover" />
                </div>
                <p className="text-[24px] font-semibold tracking-tight text-font-main">SOLve 도우미</p>
                <p className="mt-2 text-sm leading-6 text-font-sub">
                  궁금한 점이 있으면 물어보세요.
                  <br />
                  점수, 활동, 금융 상품을 바로 안내해드릴게요.
                </p>

                <div className="mt-8 flex w-full flex-col gap-2">
                  {INITIAL_QUICK_QUESTIONS.map((question, index) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleQuestionClick(question)}
                      disabled={isBusy}
                      className="w-full rounded-control border border-gray-100 bg-white px-4 py-3 text-left text-sm text-font-main shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      style={buildEntranceStyle(index * 55, 420)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-5 pb-4">
                {messages.map((message, index) => (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    onActionClick={handleActionClick}
                    sequence={index}
                  />
                ))}

                <div
                  ref={bottomRef}
                  style={{ scrollMarginBottom: `${bottomOverlayHeight + CHAT_BOTTOM_GAP}px` }}
                />
              </div>
            )}
          </div>
        </div>
      </MainLayout>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div
          ref={bottomOverlayRef}
          className="pointer-events-auto mx-auto flex w-full max-w-[600px] flex-col gap-2 px-(--side-padding) pt-3"
          style={buildEntranceStyle(40, 520)}
        >
          {messages.length > 0 && !isStreaming ? (
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {followUpQuestions.map((question, index) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleQuestionClick(question)}
                  disabled={isBusy}
                  className="shrink-0 rounded-control border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-font-main shadow-sm transition-colors"
                  style={{
                    animation: `chatChipRise 360ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                    animationDelay: `${index * CHIP_STAGGER_MS}ms`,
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          <div className="-mx-(--side-padding) bg-[#EDF3FF] px-(--side-padding) pt-2 pb-[calc(env(safe-area-inset-bottom)+16px)]">
            <div className="flex items-end gap-2 rounded-control border border-gray-200 bg-white px-3 py-2 shadow-sm transition-colors focus-within:border-primary-400">
              <textarea
                value={input}
                onChange={handleInputChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  isLoadingHistory
                    ? '대화 내역을 불러오는 중...'
                    : isResettingHistory
                      ? '새 대화를 준비하는 중...'
                      : '메시지를 입력하세요...'
                }
                disabled={isLoadingHistory || isResettingHistory}
                className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-font-main placeholder:text-font-sub outline-none"
              />

              <Button
                type="button"
                size="sm"
                onClick={() => void handleSend(input)}
                disabled={!input.trim() || isBusy}
                className="!h-10 !w-10 !rounded-control !p-0 shadow-sm"
              >
                <Icons.ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
