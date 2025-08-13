import api from './axios';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export async function register(payload: RegisterPayload) {
  return await api.post<TokensResponse>('/auth/register', payload);
}

export async function login(payload: LoginPayload) {
  return await api.post<TokensResponse>('/auth/login', payload);
}

export async function refreshToken(refreshToken: string) {
  return await api.post<TokensResponse>('/auth/refresh', { refreshToken });
}

export async function fetchProfile() {
  return await api.get('/auth/profile');
}
