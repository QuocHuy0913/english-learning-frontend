import AdminDashBoard from '@/pages/Admin/AdminDashBoard.vue'
import ErrorView from '@/pages/Error/ErrorView.vue'
import HomeView from '@/pages/Client/HomeView.vue'
import LoginView from '@/pages/Client/LoginView.vue'
import QuestionCreate from '@/pages/Client/QuestionCreate.vue'
import QuestionDetail from '@/pages/Client/QuestionDetail.vue'
import QuestionEdit from '@/pages/Client/QuestionEdit.vue'
import RegisterView from '@/pages/Client/RegisterView.vue'
import UserQuestion from '@/pages/Client/UserQuestion.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import NotificationView from '@/pages/Client/NotificationView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  {
    path: '/questions/create',
    name: 'QuestionCreate',
    component: QuestionCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/questions/edit/:id',
    name: 'QuestionEdit',
    component: QuestionEdit,
    meta: { requiresAuth: true },
  },
  { path: '/questions/:id', name: 'QuestionDetail', component: QuestionDetail },
  {
    path: '/my-questions',
    name: 'UserQuestions',
    component: UserQuestion,
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationView,
    meta: { requiresAuth: true },
  },
]

const adminRoutes = [
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashBoard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const errorRoutes = {
  path: '/error',
  name: 'ErrorPage',
  component: ErrorView,
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, ...adminRoutes, errorRoutes],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  // check requiresAuth
  if (!authStore.user && localStorage.getItem('user')) {
    await authStore.loadFromStorage()
  }

  // check requiresAuth
  if (to.meta.requiresAuth && !authStore.accessToken) {
    return next({ name: 'Login' })
  }

  // check requiresAdmin
  if (to.meta.requiresAdmin) {
    if (!authStore.user || authStore.user.role !== 'admin') {
      return next({ name: 'ErrorPage' }) // chặn user thường
    }
  }
  next()
})

export default router
