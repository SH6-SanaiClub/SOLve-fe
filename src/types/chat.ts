export interface ChatAction {
  label: string
  path: string
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  content: string
  actions?: ChatAction[] | null
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: ChatAction[]
  isStreaming?: boolean
}
