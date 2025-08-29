import api from './axios'

export interface Tag {
  id: number
  name: string
  usageCount?: number
  createdAt?: string
}

// Lấy tất cả tags
export async function fetchTags() {
  return await api.get('/tags')
}

// Lấy popular tags (theo số lượng câu hỏi nhiều nhất, nếu bằng nhau thì mới nhất)
export async function fetchPopularTags(limit = 6) {
  return await api.get('/tags/popular', {
    params: { limit },
  })
}

// Xóa tag
export async function deleteTag(id: number) {
  return await api.delete(`/tags/${id}`)
}
