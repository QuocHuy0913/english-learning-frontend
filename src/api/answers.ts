import api from './axios'

export interface Answer {
  id: number
  content: string
  user: { id: number; name: string }
  created_at: string
  updated_at: string
  like_count?: number
  liked_by_current_user?: boolean
}

export interface ReplyCreatePayload {
  content: string
}

export interface AnswerCreatePayload {
  content: string
}

export interface TotalLikesResponse {
  totalLikes: number
}

export async function fetchAnswersByQuestion(questionId: number) {
  return await api.get<Answer[]>(`/answers/questions/${questionId}`)
}

export async function createAnswer(questionId: number, payload: AnswerCreatePayload) {
  return await api.post(`/answers/questions/${questionId}`, payload)
}

export async function updateAnswer(id: number, content: string) {
  return await api.patch(`/answers/${id}`, { content })
}

export async function deleteAnswer(id: number) {
  return await api.delete(`/answers/${id}`)
}

// Like câu trả lời
export async function likeAnswer(answerId: number) {
  return await api.patch(`/answers/${answerId}/like`)
}

export async function unlikeAnswer(answerId: number) {
  return await api.patch(`/answers/${answerId}/unlike`)
}

export async function createReply(parentAnswerId: number, payload: ReplyCreatePayload) {
  return await api.post(`/answers/${parentAnswerId}/replies`, payload)
}

export async function fetchTotalLikes() {
  return await api.get<TotalLikesResponse>('/answers/likes/total')
}

