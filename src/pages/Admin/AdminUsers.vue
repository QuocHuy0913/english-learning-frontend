<template>
  <div class="card p-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="m-0">Quản lý người dùng</h4>
      <button class="btn btn-outline-primary fw-semibold rounded-pill px-4"
              @click="openCreateAdminModal">+ Tạo Admin</button>
    </div>
    <!-- Filters -->
    <div class="d-flex flex-wrap gap-2 mb-4">
      <select v-model="status"
              class="form-select w-auto rounded-pill border-primary"
              @change="fetchUsers">
        <option value="">Tất cả</option>
        <option value="active">Đang hoạt động</option>
        <option value="banned">Bị khóa</option>
      </select>
      <div class="d-flex border border-primary rounded-pill">
        <span class="input-group-text border-0 rounded-pill">
          <i class="bi bi-search fs-5 text-secondary ms-2"></i>
        </span>
        <input v-model="searchEmail"
               type="text"
               class="form-control w-auto rounded-pill border-0"
               placeholder="Tìm theo email..."
               @keyup.enter="searchUser" />
      </div>
      <button class="btn btn-primary fw-semibold rounded-pill px-4"
              @click="searchUser">Tìm</button>
    </div>
    <!-- Row: Table + Chart -->
    <div class="row g-4">
      <!-- User Table -->
      <div class="col-md-8">
        <div class="table-responsive shadow-sm rounded bg-white">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary">
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Ngày gia nhập</th>
                <th>Trạng thái</th>
                <th class="text-center">Hành động</th>
                <th class="text-center">...</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users"
                  :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
                <td>
                  <span v-if="user.status === 'active'"
                        class="text-primary fw-semibold">
                    <i class="bi bi-check-circle-fill me-1"></i> Hoạt động </span>
                  <span v-else
                        class="text-danger fw-semibold">
                    <i class="bi bi-x-circle-fill me-1"></i> Đã bị khóa </span>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3"
                          @click="openNotifyModal(user)">Thông báo</button>
                </td>
                <td class="text-center position-relative">
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary rounded-circle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                      <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-if="user.status === 'active'">
                        <a class="dropdown-item text-danger"
                           href="#"
                           @click.prevent="banUser(user)">
                          <i class="bi bi-slash-circle me-2"></i> Khóa người dùng </a>
                      </li>
                      <li v-else>
                        <a class="dropdown-item text-success"
                           href="#"
                           @click.prevent="activateUser(user)">
                          <i class="bi bi-check-circle me-2"></i> Kích hoạt lại </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button class="btn btn-outline-primary rounded-pill px-4"
                  :disabled="page === 1"
                  @click="page--, fetchUsers()">Trước</button>
          <span class="align-self-center fw-semibold">Trang {{ page }} / {{ totalPages }}</span>
          <button class="btn btn-outline-primary rounded-pill px-4"
                  :disabled="users.length < limit"
                  @click="page++, fetchUsers()">Tiếp</button>
        </div>
      </div>
      <!-- Chart -->
      <div class="col-md-4">
        <div class="card shadow-sm rounded-3">
          <div class="card-body">
            <h5 class="card-title text-center mb-3 fw-bold text-primary">Thống kê</h5>
            <Doughnut :data="chartData"
                      :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
    <!-- Modal: Tạo Admin -->
    <div v-if="showCreateAdmin"
         class="modal fade show d-block"
         tabindex="-1"
         style="background: rgba(0,0,0,.5);">
      <div class="modal-dialog">
        <div class="modal-content rounded-3 shadow">
          <div class="modal-header bg-success text-white rounded-top-3">
            <h5 class="modal-title">Tạo Admin mới</h5>
            <button type="button"
                    class="btn-close btn-close-white"
                    @click="showCreateAdmin = false"></button>
          </div>
          <div class="modal-body">
            <input v-model="newAdminName"
                   type="text"
                   placeholder="Nhập tên..."
                   class="form-control border-success rounded-pill mb-2" />
            <input v-model="newAdminEmail"
                   type="email"
                   placeholder="Nhập email..."
                   class="form-control border-success rounded-pill mb-2" />
            <input v-model="newAdminPassword"
                   type="password"
                   placeholder="Nhập mật khẩu..."
                   class="form-control border-success rounded-pill" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-success px-4 rounded-pill"
                    @click="createAdmin">Tạo</button>
            <button class="btn btn-secondary px-4 rounded-pill"
                    @click="showCreateAdmin = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal: Gửi thông báo -->
    <div v-if="showNotify"
         class="modal fade show d-block"
         tabindex="-1"
         style="background: rgba(0,0,0,.5);">
      <div class="modal-dialog">
        <div class="modal-content rounded-3 shadow">
          <div class="modal-header bg-success text-white rounded-top-3">
            <h5 class="modal-title">Gửi thông báo</h5>
            <button type="button"
                    class="btn-close btn-close-white"
                    @click="showNotify = false"></button>
          </div>
          <div class="modal-body">
            <textarea v-model="notifyContent"
                      rows="4"
                      placeholder="Nhập nội dung..."
                      class="form-control border-success rounded"></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success px-4 rounded-pill"
                    @click="sendNotification">Gửi</button>
            <button class="btn btn-secondary px-4 rounded-pill"
                    @click="showNotify = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAdminApi } from "@/api/adminApi";
import { ref, onMounted, computed } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut } from "vue-chartjs";
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const api = useAdminApi();

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned" | "admin";
  created_at: string;
  updated_at: string;
}

const users = ref<User[]>([]);
const page = ref(1);
const limit = ref(10);
const status = ref("");
const searchEmail = ref("");

const totalUsers = ref(0);
const totalPages = computed(() => Math.ceil(totalUsers.value / limit.value));

// modal
const showCreateAdmin = ref(false);
const newAdminName = ref("");
const newAdminEmail = ref("");
const newAdminPassword = ref("");
const showNotify = ref(false);
const notifyContent = ref("");
const targetUser = ref<User | null>(null);

// chart data
const chartData = computed(() => {
  const activeCount = users.value.filter((u) => u.status === "active").length;
  const bannedCount = users.value.filter((u) => u.status === "banned").length;
  return {
    labels: ["Hoạt động", "Đã bị khóa"],
    datasets: [
      {
        data: [activeCount, bannedCount],
        backgroundColor: ["#0d6efd", "#dc3545"],
        borderWidth: 2,
        hoverOffset: 10
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  cutout: "60%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
      },
    },
  },
};

const fetchUsers = async () => {
  const res = await api.listUsers(page.value, limit.value, status.value);
  users.value = res.items || res;
  totalUsers.value = res.total;
};

const searchUser = async () => {
  if (!searchEmail.value) {
    fetchUsers();
    return;
  }
  const res = await api.findUserByEmail(searchEmail.value);
  users.value = res ? [res] : [];
};

const banUser = async (user: User) => {
  if (user.status === "banned") return; // đã banned rồi thì thôi
  await api.updateUserStatus(user.id, "banned");
  fetchUsers();
};

const activateUser = async (user: User) => {
  if (user.status === "active") return; // đã active thì thôi
  await api.updateUserStatus(user.id, "active");
  fetchUsers();
};

const openCreateAdminModal = () => (showCreateAdmin.value = true);

const createAdmin = async () => {
  if (!newAdminEmail.value || !newAdminName.value || !newAdminPassword.value) return;

  await api.createAdmin({
    name: newAdminName.value,
    email: newAdminEmail.value,
    password: newAdminPassword.value,
  });

  showCreateAdmin.value = false;
  newAdminEmail.value = "";
  newAdminName.value = "";
  newAdminPassword.value = "";
  fetchUsers();
};


const openNotifyModal = (user: User) => {
  targetUser.value = user;
  showNotify.value = true;
};

const sendNotification = async () => {
  if (!notifyContent.value || !targetUser.value) return;
  await api.createNotification({
    userId: targetUser.value!.id, // dùng non-null assertion
    content: notifyContent.value,
  });
  showNotify.value = false;
  notifyContent.value = "";
};

onMounted(fetchUsers);
</script>
<style scoped>
input:focus {
  box-shadow: none;
  outline: none;
}

.table-responsive {
  overflow: visible !important;
}
</style>
