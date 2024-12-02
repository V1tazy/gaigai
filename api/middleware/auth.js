const jwt = require('jsonwebtoken');
const SECRET = 'my_secret_key';

// Middleware для проверки токена
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Неверный токен' });
    req.user = decoded;
    next();
  });
};

// Middleware для проверки ролей
const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Нет доступа' });
  }
  next();
};

module.exports = { authenticate, authorize };
