// src/types/admin.ts

export interface Reporter {
  id: number
  name: string
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
}

export type ReportStatus = 'pending' | 'reviewed'
export type ReportTargetType = 'question' | 'answer' | 'comment'

export interface ReportDto {
  id: number
  targetType: ReportTargetType
  targetId: number
  reporter: Reporter
  reason: string
  status: ReportStatus
  created_at: string
  updated_at: string
}

export interface ReportResponse {
  items: ReportDto[]
  total: number
}

export interface ReportQuery {
  page?: number
  limit?: number
  status?: ReportStatus
  targetType?: ReportTargetType
  search?: string // thêm search
}

export interface AdminNotification {
  id: number
  title: string
  content: string
  isGlobal: boolean
  read: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  userId?: number | null
}
