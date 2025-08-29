/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReportDto, ReportQuery, ReportResponse } from '@/pages/Admin/types/admin'
import api from './axios'

export interface GrowthData {
  month: string // tên tháng (Jan, Feb, ...)
  users: number // số user mới
  questions: number // số câu hỏi mới
  answers: number // số câu trả lời mới
  reports: number // số báo cáo
  notifications: number
  tags: number
}

export const useAdminApi = () => ({
  growthStats: () => api.get('/admin/growth').then((res) => res.data),
  // ================= User =================
  countUsers: () => api.get<number>('/admin/users/count').then((res) => res.data),

  listUsers: (page = 1, limit = 10, status?: string, search?: string) =>
    api.get(`/admin/users`, { params: { page, limit, status, search } }).then((res) => res.data),

  findUserByEmail: (email: string) =>
    api.post('/admin/users/email', { email }).then((res) => res.data),

  updateUserStatus: (id: number, status: string) =>
    api.patch(`/admin/users/${id}`, { status }).then((res) => res.data),

  createAdmin: (data: any) => api.post('/admin/create', data).then((res) => res.data),

  // ================= Question =================
  countQuestions: () => api.get<number>('/admin/questions/count').then((res) => res.data),
  listQuestions: (page = 1, limit = 10, search?: string) =>
    api.get('/admin/questions', { params: { page, limit, search } }).then((res) => res.data),

  getQuestionById: (id: number) => api.get(`/admin/questions/${id}`).then((res) => res.data),

  deleteQuestion: (id: number) => api.delete(`/admin/questions/${id}`).then((res) => res.data),

  // ================= Answer =================
  listAllAnswers: (page = 1, limit = 10) =>
    api.get('/admin/answers/all', { params: { page, limit } }).then((res) => res.data),

  countAnswers: () => api.get<number>('/admin/answers/count').then((res) => res.data),

  listAnswersByQuestion: (questionId: number, userId?: number) =>
    api.get(`/admin/answers/${questionId}`, { params: { userId } }).then((res) => res.data),

  deleteAnswer: (id: number) => api.delete(`/admin/answers/${id}`).then((res) => res.data),

  getTotalAnswerLikes: () => api.get('/admin/answers/likes/total').then((res) => res.data),

  // ================= Tag =================
  listTags: () => api.get('/admin/tags').then((res) => res.data),

  deleteTag: (id: number) => api.delete(`/admin/tags/${id}`).then((res) => res.data),

  // ================= Report =================
  countReports: () => api.get<number>('/admin/reports/count').then((res) => res.data),

  listReports: (params: ReportQuery) =>
    api.get<ReportResponse>('/admin/reports', { params }).then((res) => res.data),

  reviewReport: (id: number) =>
    api.patch<ReportDto>(`/admin/reports/${id}`).then((res) => res.data),

  updateStatusReport: (id: number, status: string) =>
    api.patch(`/admin/reports/${id}`, { status }).then((res) => res.data),

  // ================= Notification =================
  countNotifications: () => api.get<number>('/admin/notifications/count').then((res) => res.data),

  listNotifications: (params?: any) =>
    api.get('/admin/notifications', { params }).then((res) => res.data),

  createNotification: (data: any) => api.post('/admin/notifications', data).then((res) => res.data),

  updateNotification: (data: any) =>
    api.patch(`/admin/notifications/${data.id}`, data).then((res) => res.data),

  deleteNotification: (id: number) =>
    api.delete(`/admin/notifications/${id}`).then((res) => res.data),
})
