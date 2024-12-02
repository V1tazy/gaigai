import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Адрес вашего бэкенда
  timeout: 10000,
})

// Интерцептор для добавления токена в заголовок
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
