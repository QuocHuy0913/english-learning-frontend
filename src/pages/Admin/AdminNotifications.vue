<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { AdminNotification } from './types/admin'
import { useAdminApi } from '@/api/adminApi'
import NotificationCard from '@/components/NotificationCard.vue'
import type { User } from './AdminUsers.vue'

const api = useAdminApi()

const notifications = ref<AdminNotification[]>([])
const loading = ref(false)
const total = ref(0)
const search = ref('')
const filterType = ref<'all' | 'global' | 'user' | 'unread'>('all')

const userSearch = ref('')
const searchResults = ref<User[]>([])
const selectedUser = ref<User | null>(null)

const users = ref<User[]>([])
const showCreateModal = ref(false)
const newNotification = ref({
  title: '',
  content: '',
  isGlobal: false,
  userId: null as number | null,
})

const loadNotifications = async () => {
  loading.value = true
  try {
    const res = await api.listNotifications()
    notifications.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// Tạo mới
const createNotification = async () => {
  try {
    await api.createNotification(newNotification.value)
    showCreateModal.value = false
    // reset form
    newNotification.value = {
      title: '',
      content: '',
      isGlobal: false,
      userId: null,
    }
    loadNotifications()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadNotifications()
  loadUsers()
})

const loadUsers = async () => {
  try {
    const res = await api.listUsers(1, 100) // ví dụ lấy 100 user đầu
    users.value = res.items
  } catch (e) {
    console.error(e)
  }
}

const showEditModal = ref(false)
const editingNotification = ref<AdminNotification | null>(null)

const openEditModal = (n: AdminNotification) => {
  editingNotification.value = { ...n }
  showEditModal.value = true
}

const updateNotification = async () => {
  if (!editingNotification.value) return
  try {
    await api.updateNotification(editingNotification.value)
    showEditModal.value = false
    editingNotification.value = null
    loadNotifications()
  } catch (e) {
    console.error(e)
  }
}

const deleteNotification = async (id: number) => {
  if (confirm('Xóa thông báo này?')) {
    await api.deleteNotification(id)
    loadNotifications()
  }
}

const searchUsers = async () => {
  if (userSearch.value.length < 2) {
    searchResults.value = []
    return
  }
  const res = await api.listUsers(1, 10, undefined, userSearch.value)
  searchResults.value = res.items
}

const selectUser = (u: User) => {
  selectedUser.value = u
  newNotification.value.userId = u.id
  userSearch.value = `${u.name} (${u.email})`
  searchResults.value = []
}

const filtered = computed(() => {
  return notifications.value.filter(n => {
    const matchSearch =
      !search.value ||
      n.title.toLowerCase().includes(search.value.toLowerCase()) ||
      n.content.toLowerCase().includes(search.value.toLowerCase())
    const matchFilter =
      filterType.value === 'all' ||
      (filterType.value === 'global' && n.isGlobal) ||
      (filterType.value === 'user' && !n.isGlobal) ||
      (filterType.value === 'unread' && !n.read)
    return matchSearch && matchFilter
  })
})

const globalCount = computed(() => notifications.value.filter(n => n.isGlobal).length)
const userCount = computed(() => notifications.value.filter(n => !n.isGlobal).length)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
</script>
<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-semibold">Quản lý Thông báo</h3>
        <p class="text-muted mb-0">Quản lý và theo dõi tất cả thông báo hệ thống</p>
      </div>
      <button class="btn btn-dark"
              @click="showCreateModal = true">
        <i class="bi bi-plus-lg me-1"></i> Thông báo </button>
    </div>
    <!-- Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card shadow-sm border px-4 py-4">
          <div class="fw-semibold">Tổng số thông báo</div>
          <div class="fs-4 fw-bold">{{ total }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border px-4 py-4">
          <div class="fw-semibold">Toàn hệ thống</div>
          <div class="fs-4 fw-bold">{{ globalCount }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border px-4 py-4">
          <div class="fw-semibold">Theo người dùng</div>
          <div class="fs-4 fw-bold">{{ userCount }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card shadow-sm border px-4 py-4">
          <div class="fw-semibold">Chưa đọc</div>
          <div class="fs-4 fw-bold">{{ unreadCount }}</div>
        </div>
      </div>
    </div>
    <!-- Filters -->
    <div class="card border shadow-sm mb-4 py-4 px-3">
      <div class="fw-semibold mb-2"> Bộ lọc </div>
      <div class="d-flex gap-2">
        <input v-model="search"
               type="text"
               placeholder="Tìm kiếm thông báo..."
               class="form-control" />
        <select v-model="filterType"
                class="form-select"
                style="max-width:200px">
          <option value="all">Tất cả</option>
          <option value="global">Toàn hệ thống</option>
          <option value="user">Theo người dùng</option>
          <option value="unread">Chưa đọc</option>
        </select>
      </div>
    </div>
    <!-- Notifications List -->
    <div>
      <h5 class="fw-semibold mb-2">Danh sách thông báo ({{ filtered.length }})</h5>
      <p class="text-muted mb-3">Quản lý tất cả thông báo và trạng thái gửi</p>
      <div v-if="loading"
           class="text-center py-5">
        <div class="spinner-border"></div>
      </div>
      <div v-else>
        <div v-if="filtered.length === 0"
             class="alert alert-info">Không tìm thấy thông báo nào.</div>
        <div>
          <NotificationCard v-for="n in filtered"
                            :key="n.id"
                            :notification="n"
                            :on-edit="openEditModal"
                            :on-delete="deleteNotification" />
        </div>
      </div>
    </div>
    <!-- Create Modal -->
    <div v-if="showCreateModal"
         class="modal fade show d-block"
         tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
          <div class="d-flex justify-content-between align-items-center px-4 py-3">
            <h5 class="modal-title fw-bold">Tạo thông báo mới</h5>
            <button type="button"
                    class="btn-close"
                    @click="showCreateModal = false"></button>
          </div>
          <div class="px-4 px-3">
            <p class="text-muted">Tạo một thông báo mới cho người dùng hoặc toàn hệ thống.</p>
            <div class="mb-3">
              <label class="form-label fw-semibold">Tiêu đề</label>
              <input v-model="newNotification.title"
                     type="text"
                     class="form-control"
                     placeholder="Nhập tiêu đề thông báo" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Nội dung</label>
              <textarea v-model="newNotification.content"
                        class="form-control"
                        rows="3"
                        placeholder="Nhập nội dung thông báo"></textarea>
            </div>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input"
                     type="checkbox"
                     v-model="newNotification.isGlobal" />
              <label class="form-check-label">Thông báo toàn hệ thống (tất cả người dùng)</label>
            </div>
            <div v-if="!newNotification.isGlobal"
                 class="mb-3">
              <label class="form-label fw-semibold">Người nhận (nếu không toàn hệ thống)</label>
              <input v-model="userSearch"
                     type="text"
                     class="form-control"
                     placeholder="Tìm người dùng theo tên hoặc email"
                     @input="searchUsers" />
              <ul v-if="searchResults.length > 0"
                  class="list-group mt-2">
                <li v-for="u in searchResults"
                    :key="u.id"
                    class="list-group-item list-group-item-action"
                    @click="selectUser(u)"> {{ u.name }} ({{ u.email }}) </li>
              </ul>
              <div v-if="selectedUser"
                   class="mt-2">
                <span class="badge bg-dark">Đã chọn: {{ selectedUser.name }} ({{ selectedUser.email }})</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end px-4 py-3">
            <button class="btn btn-secondary me-2"
                    @click="showCreateModal = false">Hủy</button>
            <button class="btn btn-dark"
                    @click="createNotification">Tạo thông báo</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCreateModal"
         class="modal-backdrop fade show"></div>
  </div>
  <!-- Edit Modal -->
  <div v-if="showEditModal && editingNotification"
       class="modal fade show d-block"
       tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content border-0 shadow">
        <div class="d-flex justify-content-between align-items-center px-4 py-3">
          <h5 class="modal-title fw-bold">Chỉnh sửa thông báo</h5>
          <button type="button"
                  class="btn-close"
                  @click="showEditModal = false"></button>
        </div>
        <div class="px-4 px-3">
          <p class="text-muted">Cập nhật nội dung thông báo.</p>
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiêu đề</label>
            <input v-model="editingNotification.title"
                   type="text"
                   class="form-control"
                   placeholder="Nhập tiêu đề thông báo" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Nội dung</label>
            <textarea v-model="editingNotification.content"
                      class="form-control"
                      rows="3"
                      placeholder="Nhập nội dung thông báo"></textarea>
          </div>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input"
                   type="checkbox"
                   v-model="editingNotification.isGlobal" />
            <label class="form-check-label">Thông báo toàn hệ thống (tất cả người dùng)</label>
          </div>
          <div v-if="!editingNotification.isGlobal"
               class="mb-3">
            <label class="form-label fw-semibold">Người nhận (nếu không toàn hệ thống)</label>
            <input v-model="userSearch"
                   type="text"
                   class="form-control"
                   placeholder="Tìm người dùng theo tên hoặc email"
                   @input="searchUsers" />
            <ul v-if="searchResults.length > 0"
                class="list-group mt-2">
              <li v-for="u in searchResults"
                  :key="u.id"
                  class="list-group-item list-group-item-action"
                  @click="selectUser(u)"> {{ u.name }} ({{ u.email }}) </li>
            </ul>
            <div v-if="selectedUser"
                 class="mt-2">
              <span class="badge bg-dark">Đã chọn: {{ selectedUser.name }} ({{ selectedUser.email }})</span>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end px-4 py-3">
          <button class="btn btn-secondary me-2"
                  @click="showEditModal = false">Hủy</button>
          <button class="btn btn-dark"
                  @click="updateNotification">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditModal"
       class="modal-backdrop fade show"></div>
</template>
