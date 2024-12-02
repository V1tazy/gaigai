<template>
  <div class="admin-panel-container">
    <h3>Админ-панель</h3>
    <p>Здесь можно управлять пользователями.</p>

    <!-- Кнопка для открытия формы добавления пользователя -->
    <button @click="showForm = !showForm">
      {{ showForm ? 'Отмена' : 'Создать пользователя' }}
    </button>

    <!-- Форма добавления пользователя -->
    <div v-if="showForm" class="user-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            v-model="newUser.username"
            :class="{ 'input-error': errors.username }"
            placeholder="Введите имя"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="newUser.email"
            :class="{ 'input-error': errors.email }"
            placeholder="Введите email"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="newUser.password"
            :class="{ 'input-error': errors.password }"
            placeholder="Введите пароль"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="role">Роль</label>
          <select v-model="newUser.role">
            <option value="admin">Администратор</option>
            <option value="worker">Работник</option>
          </select>
        </div>

        <button type="submit" :disabled="isFormInvalid">Создать пользователя</button>
      </form>
    </div>

    <!-- Список пользователей -->
    <div v-if="users.length > 0" class="user-list">
      <h4>Список пользователей</h4>
      <table>
        <thead>
          <tr>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="deleteUser(user.username)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Нет пользователей</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showForm: false,
      newUser: {
        username: '',
        email: '',
        password: '',
        role: 'worker',
      },
      errors: {},
      users: [],
    }
  },
  computed: {
    isFormInvalid() {
      return (
        !this.newUser.username ||
        !this.newUser.email ||
        !this.newUser.password ||
        !this.newUser.role ||
        Object.keys(this.errors).length > 0
      )
    },
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.users = response.data
      } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error)
      }
    },
    async submitForm() {
      this.errors = {}
      try {
        const response = await axios.post('http://localhost:3000/api/users', this.newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.users.push(response.data.user)
        this.newUser = { username: '', email: '', password: '', role: 'worker' }
        this.showForm = false
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
        }
      }
    },
    async deleteUser(username) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.users = this.users.filter((user) => user.username !== username)
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error)
      }
    },
  },
}
</script>

<style scoped>
/* Общие стили */
.admin-panel-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  overflow-y: auto;
}

h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

button:disabled {
  background-color: #ddd;
}

.user-form {
  width: 600px; /* Фиксированная ширина для формы */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Группы полей */
.form-group {
  display: flex; /* Flexbox для выравнивания */
  align-items: center;
  margin-bottom: 1rem;
  gap: 10px; /* Расстояние между элементами */
}

.form-group label {
  flex: 0 0 150px; /* Фиксированная ширина для меток */
  text-align: right;
  margin-right: 10px;
}

.form-group input,
.form-group select {
  flex: 1; /* Поле ввода растягивается, заполняя доступное пространство */
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Ошибки */
.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-left: 160px; /* Сместить сообщение об ошибке, чтобы оно выравнивалось с полем */
}

.user-list {
  width: 600px; /* Фиксированная ширина для списка */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f1f1f1;
}

table button {
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

table button:hover {
  background-color: #c0392b;
}

p {
  text-align: center;
  font-size: 1rem;
  color: #555;
}
</style>
