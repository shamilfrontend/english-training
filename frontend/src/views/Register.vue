<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card card">
        <h1 class="title">English Training</h1>
        <p class="subtitle">Создайте новый аккаунт</p>

        <form @submit.prevent="handleRegister" class="form">
          <div class="form-group">
            <label>Имя</label>
            <input
              v-model="name"
              type="text"
              class="input"
              :class="{ 'input-error': errors.name }"
              placeholder="Ваше имя"
              required
            />
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              class="input"
              :class="{ 'input-error': errors.email }"
              placeholder="your@email.com"
              required
            />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label>Пароль</label>
            <input
              v-model="password"
              type="password"
              class="input"
              :class="{ 'input-error': errors.password }"
              placeholder="••••••••"
              required
              minlength="6"
            />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <p class="login-link">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const errors = ref({});
const loading = ref(false);

const handleRegister = async () => {
  errors.value = {};
  
  if (password.value.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов';
    return;
  }

  loading.value = true;

  const result = await authStore.register(email.value, password.value, name.value);

  if (result.success) {
    router.push('/dashboard');
  } else {
    errors.value.general = result.error;
  }

  loading.value = false;
};
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 32px;
}

.form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text);
  }
}

.error-text {
  display: block;
  color: var(--error);
  font-size: 14px;
  margin-top: 4px;
}

.login-link {
  margin-top: 24px;
  color: var(--text-light);

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

