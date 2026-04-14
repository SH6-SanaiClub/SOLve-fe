export interface ChatAction {
  label: string
  path: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: ChatAction[]
  isStreaming?: boolean
}
