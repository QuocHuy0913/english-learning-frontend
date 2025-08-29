<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../../api/auth';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const showPassword = ref(false);

async function submit() {
  error.value = '';
  try {
    const res = await register({
      name: name.value,
      email: email.value,
      password: password.value
    });
    authStore.setTokens(res.data.accessToken, res.data.refreshToken);
    authStore.setUser(res.data.user);
    router.push({ name: 'Home' });
  } catch {
    error.value = 'Đăng ký thất bại. Email có thể đã được sử dụng.';
  }
}

function goToLogin() {
  router.push({ name: 'Login' });
}
</script>
<template>
  <div class="bg-success bg-opacity-10 min-vh-100 d-flex align-items-center p-5">
    <div class="container"
         style="max-width: 600px;">
      <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus fs-1 text-success"></i>
          <h3 class="fw-bold text-success mt-2">Tạo tài khoản</h3>
          <p class="text-muted">Tham gia ngay để bắt đầu hành trình học tiếng Anh của bạn.</p>
        </div>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="name"
                   class="form-label fw-semibold">Họ và tên</label>
            <input type="text"
                   class="form-control form-control-lg"
                   id="name"
                   v-model="name"
                   placeholder="Nhập họ và tên"
                   required />
          </div>
          <div class="mb-3">
            <label for="email"
                   class="form-label fw-semibold">Email</label>
            <input type="email"
                   class="form-control form-control-lg"
                   id="email"
                   v-model="email"
                   placeholder="Nhập địa chỉ email"
                   required />
          </div>
          <div class="mb-3">
            <label for="password"
                   class="form-label fw-semibold">Mật khẩu</label>
            <div class="input-group">
              <input :type="showPassword ? 'text' : 'password'"
                     class="form-control form-control-lg"
                     id="password"
                     v-model="password"
                     placeholder="Nhập mật khẩu"
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
                  class="btn btn-success w-100 rounded-pill fw-semibold py-2">Đăng ký</button>
        </form>
        <div class="text-center mt-2">
          <small class="text-muted">Bạn đã có tài khoản?</small>
          <br />
          <button class="btn btn-outline-success rounded-pill px-4 fw-semibold mt-2"
                  @click="goToLogin">Đăng nhập</button>
        </div>
        <button class="btn btn-outline-success mt-4 fw-semibold"
                @click="router.back()">
          <i class="bi bi-arrow-left me-1"></i> Quay lại </button>
      </div>
    </div>
  </div>
</template>
