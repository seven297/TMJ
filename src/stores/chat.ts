import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Role = 'bot' | 'user'
export type MessageStatus = 'success' | 'sending' | 'failed' | 'timeout'
export type Feedback = 'like' | 'dislike' | null

export interface ChatMessage {
  id: string
  role: Role
  content: string
  createdAt: number
  status: MessageStatus
  feedback?: Feedback
  is_finished?: boolean
}

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref<string>('tmj-aibot-001')
  const messages = ref<ChatMessage[]>([])

  function setSession(id: string) {
    sessionId.value = id
  }

  function setMessages(list: ChatMessage[]) {
    messages.value = list
  }

  function clear() {
    messages.value = []
  }

  function reset() {
    sessionId.value = `tmj-aibot-${Date.now()}`
    messages.value = []
  }

  return {
    sessionId,
    messages,
    setSession,
    setMessages,
    clear,
    reset,
  }
})

