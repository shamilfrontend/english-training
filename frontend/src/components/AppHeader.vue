<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <router-link to="/dashboard" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">English Training</span>
        </router-link>

        <nav class="nav">
          <router-link to="/dashboard" class="nav-link">Главная</router-link>
          <router-link to="/training" class="nav-link">Тренировки</router-link>
          <router-link to="/profile" class="nav-link">Профиль</router-link>
        </nav>

        <div class="user-info">
          <span class="user-name">{{ user?.name }}</span>
          <button @click="handleLogout" class="btn-logout">Выйти</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.app-header {
  background: white;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 20px;

  &:hover {
    opacity: 0.8;
  }
}

.logo-icon {
  font-size: 24px;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover,
  &.router-link-active {
    color: var(--primary);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 600;
  color: var(--text);

  @media (max-width: 768px) {
    display: none;
  }
}

.btn-logout {
  padding: 8px 16px;
  background: var(--error);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
}
</style>

