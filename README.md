# English Training - Приложение для изучения английских слов

Веб-приложение для изучения английских слов с авторизацией, прогрессом пользователя и интерактивными тренировками. Аналог Duolingo.

## Технологический стек

### Frontend
- Vue 3 (Composition API)
- Vite
- Pinia (управление состоянием)
- Vue Router
- Axios
- SCSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT для аутентификации
- bcryptjs для хеширования паролей

## Структура проекта

```
english-training/
├── frontend/          # Vue 3 приложение
│   ├── src/
│   │   ├── components/   # Vue компоненты
│   │   ├── views/        # Страницы приложения
│   │   ├── stores/       # Pinia stores
│   │   ├── router/       # Vue Router конфигурация
│   │   ├── services/     # API сервисы
│   │   └── styles/       # SCSS стили
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/  # Контроллеры
│   │   ├── models/       # Mongoose модели
│   │   ├── routes/       # Express маршруты
│   │   ├── middleware/   # Middleware функции
│   │   └── utils/        # Утилиты
│   └── package.json
└── README.md
```

## Установка и запуск

### Предварительные требования
- Node.js 18+
- Yarn
- MongoDB (локально установленная или удаленная)

### Шаг 1: Установка зависимостей

```bash
# Установка зависимостей корневого проекта
yarn install

# Установка зависимостей frontend и backend
yarn install:all
```

### Шаг 2: Настройка MongoDB

Убедитесь, что MongoDB установлена и запущена локально. По умолчанию приложение подключается к `mongodb://localhost:27017/english-training`

Если используете удаленную MongoDB или другую конфигурацию, укажите строку подключения в `backend/.env`

### Шаг 3: Настройка backend

Создайте файл `backend/.env` на основе `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env` при необходимости.

### Шаг 4: Импорт слов в базу данных

```bash
cd backend
yarn import-words
```

Этот скрипт загрузит слова из GitHub репозитория в MongoDB.

### Шаг 5: Запуск приложения

В корневой директории проекта:

```bash
# Запуск frontend и backend одновременно
yarn dev
```

Или отдельно:

```bash
# Терминал 1 - Backend
cd backend
yarn dev

# Терминал 2 - Frontend
cd frontend
yarn dev
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Основные функции

### Авторизация
- Регистрация с email/паролем
- Вход в систему
- JWT аутентификация
- Автоматическое обновление серии дней (daily streak)

### Dashboard
- Обзор прогресса (изученные слова, серия дней)
- Статистика (точность, опыт)
- Быстрый доступ к тренировкам
- Прогресс-бар изучения

### Тренировки
1. **Выбор перевода** - выбор правильного перевода из 4 вариантов
2. **Написание** - написание слова по переводу
3. **Повторение** - повторение изученных слов (spaced repetition)

### Личный кабинет
- Детальная статистика
- Настройки (количество слов в день, уведомления, язык)
- История активности

### Система прогресса
- Spaced Repetition алгоритм для эффективного запоминания
- Уровни изучения слов (0-5)
- Автоматический расчет следующей даты повторения
- Система опыта (XP) за тренировки

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя

### Слова
- `GET /api/words` - Список слов (с пагинацией и фильтрацией)
- `GET /api/words/random` - Случайные слова для тренировки
- `GET /api/words/:id` - Получить слово по ID

### Прогресс пользователя
- `GET /api/user/progress` - Получить прогресс пользователя
- `POST /api/user/words/:wordId/learn` - Отметить слово изученным
- `POST /api/user/training` - Завершить тренировку
- `PUT /api/user/settings` - Обновить настройки

## База данных

### Модели

**User** - Пользователь
- email, passwordHash, name
- dailyStreak, totalXP
- settings (wordsPerDay, notifications, language)

**Word** - Слово
- word, translation, transcription
- example, category, difficulty

**UserWord** - Прогресс изучения слова пользователем
- userId, wordId
- level (0-5), nextReview
- correctAnswers, totalAnswers, isLearned

**Session** - Сессия тренировки
- userId, date
- wordsStudied, score
- trainingType, xpEarned

## Разработка

### Структура компонентов

Компоненты находятся в `frontend/src/components/`:
- `AppHeader.vue` - Шапка приложения с навигацией

Страницы находятся в `frontend/src/views/`:
- `Login.vue` - Страница входа
- `Register.vue` - Страница регистрации
- `Dashboard.vue` - Главная страница с прогрессом
- `Training.vue` - Страница тренировок
- `Profile.vue` - Личный кабинет

### Стили

Используется SCSS с переменными в `frontend/src/styles/main.scss`.
Mobile-first подход, адаптивная верстка для всех устройств.

## Лицензия

MIT
