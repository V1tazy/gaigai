<template>
  <div class="shifts-container">
    <h3>Смены</h3>
    <ul>
      <li v-for="shift in shifts" :key="shift.id">{{ shift.date }}: {{ shift.description }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      shifts: [],
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/api/shifts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      this.shifts = response.data // Загружаем данные смен
    } catch (error) {
      console.error('Ошибка загрузки данных смен:', error)
    }
  },
}
</script>

<style scoped>
.personal-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f4;
}

h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  margin-bottom: 1rem;
  text-align: center;
}

.user-shift-data {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.shift-table {
  width: 100%;
  border-collapse: collapse;
}

.shift-table th,
.shift-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.shift-table th {
  background-color: #007bff;
  color: white;
}

.error-message {
  color: red;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
}
</style>
