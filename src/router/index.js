import { createRouter, createWebHistory } from 'vue-router';

// Import your components
import SourceDestinationPicker from '../components/Pages/SourceDestinationPicker.vue';

const routes = [
  {
    path: '/',
    name: 'SourceDestinationPicker',
    component: SourceDestinationPicker,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
