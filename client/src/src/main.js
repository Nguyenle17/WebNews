import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia';
import '../src/assets/css/style.css'
import 'leaflet/dist/leaflet.css';
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia)
app.mount('#app');
