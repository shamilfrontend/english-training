<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref({});

const handleRegister = async () => {
  errors.value = {};

  if (password.value.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов';
    return;
  }

  loading.value = true;

  const result = await authStore.register(email.value, password.value, name.value);

  if (result.success) {
    toast.success('Регистрация успешна!');
    router.push('/dashboard');
  } else {
    toast.error(result.error);
    errors.value.general = result.error;
  }

  loading.value = false;
};
</script>

<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-page__content">
        <h1 class="auth-page__title">Регистрация</h1>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="auth-form__field">
            <label class="label">Имя</label>
            <input
              v-model="name"
              type="text"
              class="input"
              placeholder="Ваше имя"
            />
          </div>
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
              minlength="6"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          <button type="submit" class="btn btn--primary btn--full" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
          <p class="auth-form__footer">
            Уже есть аккаунт?
            <router-link to="/login">Войти</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/components.scss';
</style>
