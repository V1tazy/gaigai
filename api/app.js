const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, Op } = require('sequelize'); // Для использования Op
const { authenticate, authorize } = require('./middleware/auth');
const { User } = require('./models/user'); // Импорт модели пользователя

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api/auth', require('./routes/auth'));

// Создание базового администратора, если его нет
const createAdminIfNotExists = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });

    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 8);
      await User.create({
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Базовый администратор создан');
    }
  } catch (error) {
    console.log('Ошибка при создании администратора:', error);
  }
};

// Вызов функции для создания администратора при старте приложения
createAdminIfNotExists();

// Эндпоинты для работы с пользователями

// Получение списка пользователей
app.get('/api/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка пользователей', error });
  }
});

// Добавление нового пользователя
app.post('/api/users', authenticate, authorize('admin'), async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  try {
    // Проверка на существующего пользователя с таким же username или email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Создание нового пользователя
    const newUser = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'Пользователь успешно добавлен', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении пользователя', error });
  }
});

// Логин (проверка пароля и создание JWT)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Проверка существования пользователя
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  // Сравнение пароля с хешированным значением
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  // Генерация JWT
  const token = jwt.sign({ id: user.id, role: user.role }, 'my_secret_key', { expiresIn: '1h' });

  res.json({ token, role: user.role });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
