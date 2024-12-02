<template>
  <div class="dashboard-container">
    <header class="navbar">
      <div class="navbar-logo">
        <h2>Главный кабинет</h2>
      </div>
      <nav class="navbar-nav">
        <button @click="$router.push('/dashboard/personal-data')" class="nav-button">
          Личные данные
        </button>
        <button v-if="isWorker" @click="$router.push('/dashboard/shifts')" class="nav-button">
          Смены
        </button>
        <button v-if="isAdmin" @click="$router.push('/dashboard/admin-panel')" class="nav-button">
          Админ-панель
        </button>
        <button @click="logout" class="nav-button logout-button">Выйти</button>
      </nav>
    </header>

    <div class="content-container">
      <router-view />
      <!-- Отображение выбранной вкладки -->
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },
    isWorker() {
      return localStorage.getItem('role') === 'worker'
    },
  },
  methods: {
    logout() {
      // Удаление токена и роли из localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('role')

      // Перенаправление на страницу входа
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
/* Общее для всего контента */
*,
*::before,
*::after {
  box-sizing: border-box; /* Чтобы padding и border не выходили за пределы */
}

.dashboard-container {
  font-family: Arial, sans-serif;
  margin-top: 50px;
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-logo h2 {
  margin: 0;
  color: white;
  font-size: 20px;
}

.navbar-nav {
  display: flex;
  gap: 15px;
}

.navbar-nav button {
  padding: 8px 15px;
  font-size: 14px;
  color: white;
  background-color: #0056b3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

.navbar-nav button:hover {
  background-color: #004085;
  transform: scale(1.05);
}

.navbar-nav button:focus {
  outline: none;
}

.logout-button {
  background-color: #dc3545;
}

.logout-button:hover {
  background-color: #c82333;
}

.content-container {
  margin-top: 70px;
  padding: 15px;
  background-color: #f8f9fa;
  margin-left: 0;
  width: 100%;
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 15px;
  }

  .navbar-logo h2 {
    font-size: 18px;
  }

  .navbar-nav button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
