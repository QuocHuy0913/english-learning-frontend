import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/LoginView.vue'
import QuestionCreate from '@/pages/QuestionCreate.vue'
import QuestionDetail from '@/pages/QuestionDetail.vue'
import QuestionEdit from '@/pages/QuestionEdit.vue'
import RegisterView from '@/pages/RegisterView.vue'
import UserQuestion from '@/pages/UserQuestion.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.accessToken) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
