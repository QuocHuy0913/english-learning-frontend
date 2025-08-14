import api from './axios'

export interface AiSuggestionPayload {
  prompt: string
}

export async function getAiSuggestion(prompt: string) {
  return await api.post<{ title: string, content: string, tags: string }>('/ai/suggest', { prompt })
}
