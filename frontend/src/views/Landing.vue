<script setup>
</script>

<template>
  <div class="landing">
    <div class="container">
      <div class="landing__content">
        <h1 class="landing__title">WordFlow</h1>
        <p class="landing__subtitle">
          Изучайте английские слова эффективно с системой интервального повторения
        </p>
        <div class="landing__actions">
          <router-link to="/register" class="btn btn--primary btn--large">
            Начать обучение
          </router-link>
          <router-link to="/login" class="btn btn--outline btn--large">
            Войти
          </router-link>
        </div>
        <div class="landing__features">
          <div class="feature">
            <h3>27 категорий</h3>
            <p>Более 500 слов в различных тематиках</p>
          </div>
          <div class="feature">
            <h3>Интервальное повторение</h3>
            <p>Эффективная система запоминания</p>
          </div>
          <div class="feature">
            <h3>Мобильный дизайн</h3>
            <p>Удобное обучение на любом устройстве</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: white;

  &__content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 4rem;
    }
  }

  &__subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 3rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.feature {
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    opacity: 0.8;
  }
}
</style>
