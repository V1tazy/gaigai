const express = require('express')
const { authenticate, authorize } = require('../middleware/auth')
const router = express.Router()

// Фиктивная база данных смен
const shifts = [
  { id: 1, date: '2024-12-01', description: 'Дневная смена' },
  { id: 2, date: '2024-12-02', description: 'Ночная смена' },
]

// Получение списка смен (доступно только работникам)
router.get('/', authenticate, authorize('worker'), (req, res) => {
  res.json(shifts)
})

module.exports = router
