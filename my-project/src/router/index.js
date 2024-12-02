import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import PersonalData from '../components/PersonalData.vue'
import Shifts from '../components/Shifts.vue'
import AdminPanel from '../components/AdminPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Требует авторизации
    children: [
      {
        path: 'personal-data',
        name: 'PersonalData',
        component: PersonalData,
        meta: { requiresAuth: true },
      },
      {
        path: 'shifts',
        name: 'Shifts',
        component: Shifts,
        meta: { role: 'worker', requiresAuth: true }, // Только для работников
      },
      {
        path: 'admin-panel',
        name: 'AdminPanel',
        component: AdminPanel,
        meta: { role: 'admin', requiresAuth: true }, // Только для админов
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Глобальная проверка доступа по ролям
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('role') || 'guest' // Имитация авторизации
  if (to.meta.requiresAuth && userRole === 'guest') {
    return next('/')
  }
  if (to.meta.role && to.meta.role !== userRole) {
    return next('/dashboard/personal-data') // Перенаправление на вкладку с личными данными
  }
  next()
})

export default router
