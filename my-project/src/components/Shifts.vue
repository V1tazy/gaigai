<template>
  <div class="shifts-container">
    <h3>Смены</h3>
    <ul>
      <li v-for="shift in shifts" :key="shift.id">{{ shift.date }}: {{ shift.description }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shifts: [
        { id: 1, date: '2024-12-01', description: 'Дневная смена' },
        { id: 2, date: '2024-12-02', description: 'Ночная смена' },
      ],
    }
  },
}
</script>
