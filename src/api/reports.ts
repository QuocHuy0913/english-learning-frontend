import api from "./axios"

export async function createReport(
  targetType: 'question' | 'answer' | 'comment',
  targetId: number,
  reason: string,
) {
  const response = await api.post('/reports/create', {
    targetType,
    targetId,
    reason,
  })
  return response.data
}
