<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notificationStore';

const router = useRouter();
const authStore = useAuthStore();
const { user, isAuthChecking } = storeToRefs(authStore);

const notificationStore = useNotificationStore();


function logout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-glass sticky-top">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand d-flex align-items-center fw-bold fs-4 text-success"
         href="#"
         @click.prevent="router.push('/')">
        <i class="bi bi-book me-2"></i> EnglishHub </a>
      <!-- Toggle mobile -->
      <button class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Menu -->
      <div class="collapse navbar-collapse"
           id="mainNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">
          <!-- Khi đang check token -->
          <li v-if="isAuthChecking"
              class="nav-item ms-lg-3">
            <span class="text-muted small">Đang kiểm tra...</span>
          </li>
          <!-- Auth status -->
          <li class="nav-item ms-lg-3 mt-2 mt-lg-0"
              v-else-if="user">
            <div class="dropdown">
              <a class="d-flex align-items-center text-decoration-none dropdown-toggle"
                 href="#"
                 role="button"
                 data-bs-toggle="dropdown"
                 aria-expanded="false">
                <!-- Avatar bọc với icon chuông -->
                <div class="position-relative me-2">
                  <i class="bi bi-person-circle fs-4 text-success"></i>
                  <span v-if="notificationStore.unreadPersonalCount > 0"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style="font-size: 0.65rem; min-width: 1.2rem;"> {{ notificationStore.unreadPersonalCount }}
                  </span>
                </div>
                <span class="fw-semibold">{{ user.name }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                <li v-if="authStore.user?.role === 'admin'">
                  <button class="dropdown-item"
                          @click="router.push({ name: 'AdminDashboard' })">
                    <i class="bi bi-speedometer2 me-2"></i> Admin Dashboard </button>
                </li>
                <li>
                  <button class="dropdown-item"
                          @click="router.push({ name: 'UserQuestions' })">
                    <i class="bi bi-card-list me-2"></i> Câu hỏi của tôi </button>
                </li>
                <li>
                  <button class="dropdown-item"
                          @click="router.push({ name: 'Notifications' })">
                    <i class="bi bi-bell me-2"></i> Thông báo của tôi </button>
                </li>
                <li>
                  <button class="dropdown-item text-danger"
                          @click="logout">
                    <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất </button>
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item ms-lg-3 mt-2 mt-lg-0"
              v-else>
            <button class="btn btn-outline-success rounded-pill px-3 fw-semibold"
                    @click="router.push({ name: 'Login' })"> Đăng nhập </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar-glass {
  background: rgba(255, 255, 255, 0.2);
  /* trắng mờ */
  backdrop-filter: blur(10px);
  /* hiệu ứng làm mờ phía sau */
  -webkit-backdrop-filter: blur(10px);
  /* hỗ trợ Safari */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* đổ bóng nhẹ */
  transition: background 0.3s ease;
}
</style>
