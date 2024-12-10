import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import InsertPage from '../views/InsertPage.vue';
import EditPage from '../views/EditPage.vue';
import { useAuthStore } from '@/stores/auth'; // Import the auth store

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }, // Page requires authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: "/insert",
    name: "Insert",
    component: InsertPage,
  },
  {
    path: '/edit/:itemId',
    name: 'Edit',
    component: EditPage,
    props: true // Allows passing the route parameter `itemId` as a prop to the component
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Access the auth store
  const isLoggedIn = authStore.isLoggedIn; // Get the login status from the auth store

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login'); // Redirect to login page if the page requires authentication
  } else {
    next(); // Proceed to the route
  }
});

export default router;
