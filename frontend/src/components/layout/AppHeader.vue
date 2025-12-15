<template>
  <header class="layout__header">
    <div class="container">
      <nav class="nav">
        <router-link to="/dashboard" class="nav__logo">WordFlow</router-link>
        
        <!-- Мобильное меню (гамбургер) -->
        <button
          v-if="isAuthenticated"
          @click="toggleMobileMenu"
          class="nav__toggle"
          :class="{ 'nav__toggle--active': isMobileMenuOpen }"
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Десктопное меню -->
        <ul class="nav__links nav__links--desktop" v-if="isAuthenticated">
          <li>
            <router-link to="/dashboard" class="nav__link" @click="closeMobileMenu">
              Главная
            </router-link>
          </li>
          <li>
            <router-link to="/categories" class="nav__link" @click="closeMobileMenu">
              Категории
            </router-link>
          </li>
          <li>
            <router-link to="/review" class="nav__link" @click="closeMobileMenu">
              Повторение
            </router-link>
          </li>
          <li>
            <router-link to="/statistics" class="nav__link" @click="closeMobileMenu">
              Статистика
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav__link" @click="closeMobileMenu">
              Профиль
            </router-link>
          </li>
          <li>
            <button @click="handleLogout" class="btn btn--outline btn--small">
              Выход
            </button>
          </li>
        </ul>

        <!-- Мобильное меню -->
        <div
          v-if="isAuthenticated"
          class="nav__mobile-menu"
          :class="{ 'nav__mobile-menu--open': isMobileMenuOpen }"
        >
          <ul class="nav__links nav__links--mobile">
            <li>
              <router-link to="/dashboard" class="nav__link" @click="closeMobileMenu">
                Главная
              </router-link>
            </li>
            <li>
              <router-link to="/categories" class="nav__link" @click="closeMobileMenu">
                Категории
              </router-link>
            </li>
            <li>
              <router-link to="/review" class="nav__link" @click="closeMobileMenu">
                Повторение
              </router-link>
            </li>
            <li>
              <router-link to="/statistics" class="nav__link" @click="closeMobileMenu">
                Статистика
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="nav__link" @click="closeMobileMenu">
                Профиль
              </router-link>
            </li>
            <li>
              <button @click="handleLogout" class="btn btn--outline btn--full">
                Выход
              </button>
            </li>
          </ul>
        </div>

        <!-- Кнопка входа для неавторизованных -->
        <div v-if="!isAuthenticated" class="nav__auth">
          <router-link to="/login" class="btn btn--outline">Вход</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeMobileMenu();
  router.push('/');
};

// Закрываем меню при смене маршрута
router.afterEach(() => {
  closeMobileMenu();
});
</script>

<style lang="scss" scoped>
.nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  min-height: 60px;

  &__logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-decoration: none;
    z-index: 101;
    flex-shrink: 0;
  }

  &__toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 101;

    span {
      width: 2rem;
      height: 3px;
      background: var(--text-primary);
      border-radius: 10px;
      transition: all 0.3s linear;
      position: relative;
      transform-origin: 1px;
    }

    &--active {
      span {
        &:first-child {
          transform: rotate(45deg);
        }
        &:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }
        &:nth-child(3) {
          transform: rotate(-45deg);
        }
      }
    }

    @media (max-width: 767px) {
      display: flex;
    }
  }

  &__links {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;

    &--desktop {
      @media (max-width: 767px) {
        display: none;
      }
    }

    &--mobile {
      flex-direction: column;
      gap: 0;
      width: 100%;
      padding: 1rem 0;

      li {
        width: 100%;
        border-bottom: 1px solid var(--border-color);

        &:last-child {
          border-bottom: none;
          padding-top: 1rem;
        }
      }
    }
  }

  &__link {
    display: block;
    color: var(--text-primary);
    text-decoration: none;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    transition: background 0.2s;
    font-weight: 500;

    &:hover {
      background: var(--bg-light);
    }

    &.router-link-active {
      background: var(--primary-color);
      color: white;
    }

    @media (max-width: 767px) {
      padding: 1rem 1.5rem;
      width: 100%;
      text-align: left;
    }
  }

  &__mobile-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-white);
    box-shadow: var(--shadow-lg);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    margin-top: 0.5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    z-index: 100;

    &--open {
      max-height: 500px;
    }

    @media (max-width: 767px) {
      display: block;
    }
  }

  &__auth {
    @media (max-width: 767px) {
      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }
  }
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: auto;
}
</style>

