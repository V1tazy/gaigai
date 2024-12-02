const express = require('express')
const { authenticate, authorize } = require('../middleware/auth')
const router = express.Router()

// Фиктивная база данных пользователей
let users = [
  { id: 1, username: 'worker', name: 'Иван Иванов', role: 'worker' },
  { id: 2, username: 'admin', name: 'Админ Админов', role: 'admin' },
]

// Получение личных данных
router.get('/me', authenticate, (req, res) => {
  const user = users.find((u) => u.username === req.user.username)
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
  res.json(user)
})

// Добавление нового пользователя (доступно только админам)
router.post('/', authenticate, authorize('admin'), (req, res) => {
  const { username, name, role } = req.body
  const newUser = { id: users.length + 1, username, name, role }
  users.push(newUser)
  res.status(201).json(newUser)
})

module.exports = router
