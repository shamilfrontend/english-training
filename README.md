# WordFlow - Приложение для изучения английских слов

Веб-приложение для изучения английских слов с интервальным повторением (Spaced Repetition System).

## Технологии

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT аутентификация

### Frontend
- Vue 3 (Composition API)
- Vite
- Pinia
- Vue Router
- SCSS (БЭМ)
- Axios
- Vue Toastification

## Установка и запуск

### Требования
- Node.js 18+
- MongoDB (локально или MongoDB Atlas)
- Yarn или npm

### Backend
```bash
cd backend
npm install

# Создайте файл .env со следующим содержимым:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/wordflow
# JWT_SECRET=your-secret-key-change-in-production
# NODE_ENV=development

npm run seed  # Наполнение базы данных словами
npm run dev   # Запуск сервера на http://localhost:3000
```

### Frontend
```bash
cd frontend
yarn install
yarn dev  # Запуск на http://localhost:5173
```

## Структура проекта

```
wordflow-app/
├── frontend/
│   ├── src/
│   │   ├── components/    # Vue компоненты
│   │   ├── views/         # Страницы приложения
│   │   ├── store/         # Pinia stores
│   │   ├── router/        # Vue Router конфигурация
│   │   ├── styles/        # SCSS стили
│   │   └── utils/         # Утилиты
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/        # Mongoose модели
│   │   ├── controllers/   # Контроллеры
│   │   ├── routes/        # Express роуты
│   │   ├── middleware/    # Middleware
│   │   └── utils/         # Утилиты (SRS алгоритм)
│   ├── seeds/             # Seed скрипты
│   └── package.json
└── README.md
```

## Функциональность

- ✅ Регистрация и авторизация пользователей
- ✅ 27 категорий слов (более 500 слов)
- ✅ Система интервального повторения (SM-2 алгоритм)
- ✅ Тренировка по категориям
- ✅ Повторение изученных слов
- ✅ Отслеживание прогресса
- ✅ Статистика обучения
- ✅ Mobile-first дизайн

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Профиль пользователя

### Слова
- `GET /api/words` - Получить слова (с фильтром по категории)
- `GET /api/words/random` - Случайное слово
- `GET /api/words/categories` - Список категорий

### Прогресс
- `GET /api/progress` - Прогресс пользователя
- `PUT /api/progress/:wordId` - Обновить прогресс слова
- `GET /api/progress/categories/:category` - Прогресс по категории

### Тренировка
- `GET /api/training/daily` - Ежедневная тренировка
- `GET /api/training/review` - Слова для повторения
- `POST /api/training/complete` - Завершить тренировку

## Категории слов

1. Общие слова
2. Местоимения
3. Тело
4. Внешность
5. Характер и эмоции
6. Семья и окружение
7. Одежда и обувь
8. Жизнь
9. Еда и напитки
10. Профессии и работа
11. Дом
12. Спорт и хобби
13. Путешествия и отдых
14. Качества предметов
15. Цвета
16. Свойства
17. Время
18. Количественные числительные
19. Порядковые числительные
20. Погода
21. Пейзаж
22. Животные
23. Растения
24. Праздники
25. Места
26. Союзы
27. Предлоги
