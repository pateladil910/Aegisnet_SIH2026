// api/client.js — Axios instance with JWT interceptor + mock data fallback

import axios from 'axios'
import { useAuthStore } from '../store/useStore'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh token on 401
client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken })
        useAuthStore.getState().setToken(data.token)
        original.headers.Authorization = `Bearer ${data.token}`
        return client(original)
      } catch {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(err)
  }
)

export default client
