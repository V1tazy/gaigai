const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const router = express.Router();

const SECRET = 'my_secret_key';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, role: user.role });
});

module.exports = router;
