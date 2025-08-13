<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const showPassword = ref(false);

async function submit() {
  error.value = '';
  try {
    const res = await login({ email: email.value, password: password.value });
    authStore.setTokens(res.data.accessToken, res.data.refreshToken);
    authStore.setUser(res.data.user);
    router.push({ name: 'Home' });
  } catch {
    error.value = 'Invalid email or password';
  }
}

function goToRegister() {
  router.push({ name: 'Register' });
}
</script>
<template>
  <div class="bg-success bg-opacity-10 min-vh-100 d-flex align-items-center">
    <div class="container"
         style="max-width: 600px;">
      <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div class="text-center mb-4">
          <i class="bi bi-book fs-1 text-success"></i>
          <h3 class="fw-bold text-success mt-2">Welcome Back!</h3>
          <p class="text-muted">Log in to continue your English learning journey.</p>
        </div>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="email"
                   class="form-label fw-semibold">Email address</label>
            <input type="email"
                   class="form-control form-control-lg"
                   id="email"
                   v-model="email"
                   required />
          </div>
          <div class="mb-3">
            <label for="password"
                   class="form-label fw-semibold">Password</label>
            <div class="input-group">
              <input :type="showPassword ? 'text' : 'password'"
                     class="form-control form-control-lg"
                     id="password"
                     v-model="password"
                     required />
              <span class="input-group-text bg-transparent border-1"
                    @click="showPassword = !showPassword"
                    style="cursor: pointer;">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
          </div>
          <div class="text-danger mb-3"
               v-if="error">{{ error }}</div>
          <button type="submit"
                  class="btn btn-success w-100 rounded-pill fw-semibold p-2 mt-3"> Login </button>
        </form>
        <div class="text-center m-2">
          <small class="text-muted m-0">Don't have an account?</small>
          <br />
          <button class="btn btn-outline-success rounded-pill px-4 fw-semibold m-2"
                  @click="goToRegister"> Register </button>
        </div>
        <button class="btn btn-outline-success mt-2 fw-semibold"
                @click="router.back()">
          <i class="bi bi-arrow-left me-1"></i> Back </button>
      </div>
    </div>
  </div>
</template>
