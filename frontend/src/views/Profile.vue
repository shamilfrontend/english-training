<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useAuthStore } from '@/store/auth';

const toast = useToast();
const authStore = useAuthStore();

const user = ref(null);
const loading = ref(true);

const loadProfile = async () => {
  loading.value = true;
  const result = await authStore.fetchProfile();

  if (result.success) {
    user.value = authStore.user;
  } else {
    toast.error(result.error);
  }

  loading.value = false;
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <h1 class="page-title">Профиль</h1>

        <div v-if="loading" class="loading">Загрузка...</div>

        <div v-else class="profile">
          <div class="card">
            <h2>Информация о пользователе</h2>
            <div class="profile__info">
              <div class="profile__field">
                <label class="label">Email</label>
                <p class="profile__value">{{ user?.email || 'Не указан' }}</p>
              </div>
              <div class="profile__field">
                <label class="label">Имя</label>
                <p class="profile__value">{{ user?.name || 'Не указано' }}</p>
              </div>
              <div class="profile__field">
                <label class="label">Дата регистрации</label>
                <p class="profile__value">
                  {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указана' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/components.scss';

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.25rem;
}

.profile {
  &__info {
    margin-top: 1rem;
  }

  &__field {
    margin-bottom: 1.5rem;
  }

  &__value {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-top: 0.5rem;
  }
}
</style>
