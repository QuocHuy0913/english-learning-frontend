import api from "./axios"


export interface User {
  id: number
  name: string
  email: string
}

export interface UserCountResponse {
  totalUsers: number
}

// Lấy tổng số người dùng
export async function fetchUserCount() {
  return await api.get<UserCountResponse>('/users/count')
}
