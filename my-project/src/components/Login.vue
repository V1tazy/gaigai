<template>
  <div class="login-container">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Логин</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import apiClient from '../services/api' // Импорт клиента API

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    async handleLogin() {
      try {
        // Отправка запроса к API
        const response = await apiClient.post('/auth/login', {
          username: this.username,
          password: this.password,
        })

        // Получение токена и роли из ответа
        const { token, role } = response.data

        // Сохранение токена и роли в localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)

        // Перенаправление на страницу в зависимости от роли
        if (role === 'admin') {
          this.router.push('/dashboard/admin-panel')
        } else if (role === 'worker') {
          this.router.push('/dashboard/personal-data')
        }
      } catch (error) {
        // Обработка ошибок
        this.errorMessage =
          error.response?.data?.message || 'Ошибка авторизации. Попробуйте ещё раз.'
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
}
</style>
