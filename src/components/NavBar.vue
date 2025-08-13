<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const emit = defineEmits<{ (e: 'ask'): void }>();

function onAskClick() {
  if (authStore.user) {
    emit('ask');
  } else {
    router.push({ name: 'Login' });
  }
}

function logout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>
<template>
  <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
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
          <li class="nav-item">
            <button class="btn btn-success rounded-pill px-3 fw-semibold"
                    @click="onAskClick">
              <i class="bi bi-plus-lg me-1"></i> Ask Question </button>
          </li>
          <!-- Auth status -->
          <li class="nav-item ms-lg-3 mt-2 mt-lg-0"
              v-if="authStore.user">
            <div class="dropdown">
              <a class="d-flex align-items-center text-decoration-none dropdown-toggle"
                 href="#"
                 role="button"
                 data-bs-toggle="dropdown"
                 aria-expanded="false">
                <i class="bi bi-person-circle fs-4 text-success me-2"></i>
                <span class="fw-semibold">{{ authStore.user.name }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button class="dropdown-item"
                          @click="router.push({ name: 'UserQuestions' })">
                    <i class="bi bi-card-list me-2"></i> My Questions </button>
                </li>
                <li>
                  <button class="dropdown-item text-danger"
                          @click="logout">
                    <i class="bi bi-box-arrow-right me-2"></i> Logout </button>
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item ms-lg-3 mt-2 mt-lg-0"
              v-else>
            <button class="btn btn-outline-success rounded-pill px-3 fw-semibold"
                    @click="router.push({ name: 'Login' })"> Login </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
