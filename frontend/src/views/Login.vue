<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-page__content">
        <h1 class="auth-page__title">Вход</h1>
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="auth-form__field">
            <label class="label">Email</label>
            <input
              v-model="email"
              type="email"
              class="input"
              :class="{ 'input--error': errors.email }"
              placeholder="your@email.com"
              required
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          <div class="auth-form__field">
            <label class="label">Пароль</label>
            <input
              v-model="password"
              type="password"
              class="input"
              :class="{ 'input--error': errors.password }"
              placeholder="••••••••"
              required
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          <button type="submit" class="btn btn--primary btn--full" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
          <p class="auth-form__footer">
            Нет аккаунта?
            <router-link to="/register">Зарегистрироваться</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({});

const handleLogin = async () => {
  errors.value = {};
  loading.value = true;

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    toast.success('Добро пожаловать!');
    router.push('/dashboard');
  } else {
    toast.error(result.error);
    errors.value.general = result.error;
  }

  loading.value = false;
};
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  &__content {
    max-width: 400px;
    width: 100%;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: white;
  }
}

.auth-form {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);

  &__field {
    margin-bottom: 1.5rem;
  }

  &__footer {
    text-align: center;
    margin-top: 1rem;
    color: var(--text-secondary);

    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.error-message {
  display: block;
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>

