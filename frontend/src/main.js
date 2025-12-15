import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import 'vue-toastification/dist/index.css';
import './styles/main.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
});

app.mount('#app');
