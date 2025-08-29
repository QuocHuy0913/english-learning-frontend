import api from './axios'

interface Tag {
  id: number
  name: string
}

export interface Question {
  id: number
  title: string
  content: string
  tags: Tag[]
  user: { id: number; name: string }
  created_at: string
  updated_at: string
}

export interface QuestionCreatePayload {
  title: string
  content: string
  tags?: string // csv string
}

export async function fetchQuestions(page = 1, limit = 10, keyword = '', tag = '') {
  return await api.get('/questions', {
    params: { page, limit, keyword, tag },
  })
}

export async function fetchQuestion(id: number) {
  return await api.get(`/questions/${id}`)
}

export async function fetchMyQuestions(page = 1, limit = 10) {
  return await api.get('/questions/me', {
    params: { page, limit },
  })
}

export async function createQuestion(payload: QuestionCreatePayload) {
  return await api.post('/questions', payload)
}

export async function updateQuestion(id: number, payload: Partial<QuestionCreatePayload>) {
  return await api.patch<Question>(`/questions/${id}`, payload)
}

export async function deleteQuestion(id: number) {
  return await api.delete(`/questions/${id}`)
}
