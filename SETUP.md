# Инструкция по запуску проекта

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установка зависимостей корневого проекта
yarn install

# Установка зависимостей frontend и backend
yarn install:all
```

### 2. Настройка MongoDB

Убедитесь, что MongoDB установлена и запущена локально.

**Для macOS:**
```bash
# Установка через Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Для Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Для Windows:**
Скачайте и установите MongoDB с официального сайта: https://www.mongodb.com/try/download/community

По умолчанию приложение подключается к `mongodb://localhost:27017/english-training`

### 3. Настройка backend

Создайте файл `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Или создайте файл `backend/.env` вручную со следующим содержимым:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/english-training
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Важно:** Измените `JWT_SECRET` на случайную строку для продакшена!

### 4. Импорт слов в базу данных

```bash
cd backend
yarn import-words
```

Этот скрипт загрузит слова из GitHub репозитория в MongoDB. Процесс может занять несколько минут.

### 5. Запуск приложения

В корневой директории проекта:

```bash
# Запуск frontend и backend одновременно
yarn dev
```

Или отдельно в разных терминалах:

```bash
# Терминал 1 - Backend
cd backend
yarn dev

# Терминал 2 - Frontend
cd frontend
yarn dev
```

### 6. Открыть приложение

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## Первый запуск

1. Откройте http://localhost:3000
2. Зарегистрируйте новый аккаунт
3. Начните тренировку!

## Возможные проблемы

### MongoDB не запускается

Убедитесь, что MongoDB установлена и запущена:

**macOS:**
```bash
brew services list
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl status mongodb
sudo systemctl start mongodb
```

**Windows:**
Проверьте службу MongoDB в диспетчере задач или через командную строку:
```bash
net start MongoDB
```

### Ошибка подключения к MongoDB

Проверьте, что MongoDB запущена и доступна:
```bash
# Проверка подключения
mongosh mongodb://localhost:27017
```

Если используете другую конфигурацию, обновите `MONGODB_URI` в `backend/.env`

### Ошибка импорта слов

Убедитесь, что:
1. MongoDB запущена и доступна
2. Переменные окружения в `backend/.env` настроены правильно
3. Есть доступ к интернету (для загрузки слов с GitHub)

### Порт уже занят

Измените порты в:
- `frontend/vite.config.js` (порт frontend)
- `backend/.env` (порт backend)

## Структура базы данных

После импорта слов в базе будут созданы коллекции:
- `users` - пользователи
- `words` - слова из словаря
- `userwords` - прогресс изучения слов пользователями
- `sessions` - сессии тренировок

## Остановка

```bash
# Остановка frontend и backend (Ctrl+C)

# Остановка MongoDB (если нужно)
# macOS:
brew services stop mongodb-community

# Linux:
sudo systemctl stop mongodb

# Windows:
net stop MongoDB
```

