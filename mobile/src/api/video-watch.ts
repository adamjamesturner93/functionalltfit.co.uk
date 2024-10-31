import { api } from './client'

export const recordVideoWatch = async (videoId: string) => {
  try {
    const response = await api.post('/api/video-watch', { videoId })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('Authentication error. User needs to log in.')
      // Here you might want to trigger a re-authentication flow
      // For example, redirecting to the login screen
    } else {
      console.error('Error recording video watch:', error)
    }
    throw error
  }
}