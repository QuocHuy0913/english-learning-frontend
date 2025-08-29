<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchQuestions, type Question } from '@/api/questions'
import { fetchUserCount } from '@/api/users'
import { fetchTotalLikes } from '@/api/answers'
import { fetchNotifications, markNotificationRead, type Notification } from '@/api/notifications'
import { fetchPopularTags, type Tag } from '@/api/tags'
import { useAuthStore } from '@/stores/auth'
import QuestionCard from '@/components/QuestionCard.vue'

// ----------------- Router & Store -----------------
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ----------------- State -----------------
const questions = ref<Question[]>([])
const search = ref('')
const keyword = ref('')
const tagSearch = ref('')

const loading = ref(false)
const page = ref(1)
const total = ref(0)
const limit = 10

const totalUsers = ref(0)
const totalQuestions = ref(0)
const totalLikes = ref(0)
const popularTags = ref<Tag[]>([])

const notifications = ref<Notification[]>([])
const latestNotification = ref<Notification | null>(null)
const showPopup = ref(false)

// ----------------- Functions -----------------
function onAskClick() {
  router.push({ name: authStore.user ? 'QuestionCreate' : 'Login' })
}

async function loadQuestions() {
  loading.value = true
  try {
    const { data } = await fetchQuestions(page.value, limit, keyword.value, tagSearch.value)
    questions.value = data.items
    total.value = totalQuestions.value = data.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const [userRes, likeRes, tagRes] = await Promise.all([
      fetchUserCount(),
      fetchTotalLikes(),
      fetchPopularTags(6)
    ])
    totalUsers.value = userRes.data.totalUsers
    totalLikes.value = likeRes.data.totalLikes
    popularTags.value = tagRes.data.items
  } catch (e) {
    console.error(e)
  }
}

async function loadNotifications() {
  try {
    const res = await fetchNotifications()
    notifications.value = res.items

    const latestGlobal = res.items
      .filter(n => n.isGlobal)
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0]

    if (latestGlobal && !latestGlobal.read) {
      latestNotification.value = latestGlobal
      showPopup.value = true
    }
  } catch (e) {
    console.error('Error loading notifications:', e)
  }
}

function onSearch() {
  const words = search.value.trim().split(/\s+/)
  keyword.value = words.filter(w => !w.startsWith('#')).join(' ')
  tagSearch.value = words.filter(w => w.startsWith('#')).map(w => w.slice(1)).join(',')

  page.value = 1
  loadQuestions()
}

function onSelectQuestion(id: number) {
  router.push({ name: 'QuestionDetail', params: { id } })
}

function changePage(delta: number) {
  const totalPages = Math.ceil(total.value / limit)
  if (page.value + delta >= 1 && page.value + delta <= totalPages) {
    page.value += delta
    loadQuestions()
  }
}

function closePopup() {
  showPopup.value = false
}

async function markAsRead(id: number) {
  try {
    await markNotificationRead(id)
    if (latestNotification.value) latestNotification.value.read = true
  } catch (e) {
    console.error(e)
  } finally {
    showPopup.value = false
  }
}

// ----------------- Watchers -----------------
watch(
  () => route.query.tag,
  (newTag) => {
    if (typeof newTag === 'string' && newTag.trim()) {
      search.value = newTag.trim()
      onSearch()
    }
  },
  { immediate: true }
)

// ----------------- Lifecycle -----------------
onMounted(() => {
  loadQuestions()
  loadStats()
  loadNotifications()
})
</script>
<template>
  <div class="home-bg py-4">
    <div class="container">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 mb-4">
          <!-- Đặt câu hỏi -->
          <div class="sidebar-sticky">
            <div class="card shadow-sm border mb-4 p-3 menu">
              <h6 class="fw-bold mb-3">Có thắc mắc gì không?</h6>
              <p class="small text-muted">Hãy hỏi và nhận trợ giúp từ cộng đồng học tiếng Anh thân thiện</p>
              <button class="btn btn-success w-100 rounded-3"
                      @click="onAskClick">
                <i class="bi bi-plus-lg me-1"></i> Đặt câu hỏi </button>
            </div>
            <!-- Thống kê cộng đồng -->
            <div class="card shadow-sm border mb-4 p-3 menu">
              <h6 class="fw-bold mb-3">Cộng đồng</h6>
              <p class="mb-3"><i class="bi bi-people me-3 menu"></i>{{ totalUsers.toLocaleString() }} Thành viên</p>
              <p class="mb-3"><i class="bi bi-chat-left-text me-3"></i>{{ totalQuestions.toLocaleString() }} Câu hỏi</p>
              <p><i class="bi bi-activity text-success me-3"></i>{{ totalLikes.toLocaleString() }} Lượt thích</p>
            </div>
            <!-- Chủ đề phổ biến -->
            <div class="card shadow-sm border p-3 menu">
              <h6 class="fw-bold mb-3">Chủ đề phổ biến</h6>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="tag in popularTags"
                      :key="tag.id"
                      class="topic-badge"> {{ tag.name }} </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Nội dung chính -->
        <div class="col-lg-9">
          <!-- Header -->
          <div class="text-center mb-4">
            <h2 class="fw-bold">Chào mừng đến với cộng đồng EnglishHub</h2>
            <p class="text-muted">Nơi mọi người học và sử dụng tiếng Anh có thể đặt câu hỏi, chia sẻ kiến thức và giúp
              đỡ lẫn nhau.</p>
          </div>
          <!-- Tìm kiếm -->
          <div class="input-group search-bar mx-auto mb-4 rounded-pill overflow-hidden border border-2 border-success"
               style="max-width: 500px;">
            <span class="input-group-text bg-white border-0">
              <i class="bi bi-search fs-5 text-secondary ms-2"></i>
            </span>
            <input type="text"
                   class="form-control border-0"
                   placeholder="Nhập từ khóa hoặc #chủ_đề"
                   v-model="search"
                   @keyup.enter="onSearch">
          </div>
          <!-- Danh sách câu hỏi -->
          <div v-if="loading"
               class="text-center my-5">Đang tải...</div>
          <div v-else-if="questions.length === 0"
               class="text-center my-5 text-muted">Không tìm thấy câu hỏi nào</div>
          <div v-else>
            <div v-for="q in questions"
                 :key="q.id"
                 class="mb-3">
              <QuestionCard :question="q"
                            @click="onSelectQuestion(q.id)" />
            </div>
          </div>
          <!-- Phân trang -->
          <div class="d-flex justify-content-center align-items-center gap-3 my-4">
            <button class="btn btn-outline-success"
                    @click="changePage(-1)"
                    :disabled="page === 1"> Trang trước </button>
            <span>Trang {{ page }} / {{ Math.ceil(total / limit) }}</span>
            <button class="btn btn-outline-success"
                    @click="changePage(1)"
                    :disabled="page >= Math.ceil(total / limit)"> Trang sau </button>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="footer mt-5 py-4 bg-light border-top">
        <div class="container">
          <div class="row text-center text-md-start">
            <!-- Logo + giới thiệu -->
            <div class="col-12 col-sm-6 col-lg-3 mb-4">
              <h5 class="fw-bold d-flex align-items-center justify-content-center justify-content-md-start">
                <i class="bi bi-chat-dots text-success me-2"></i> EnglishHub
              </h5>
              <p class="small text-muted mb-0">Xây dựng một cộng đồng hỗ trợ học tiếng Anh toàn cầu.</p>
            </div>
            <!-- Cộng đồng -->
            <div class="col-6 col-sm-6 col-lg-3 mb-4">
              <h6 class="fw-bold mb-3">Cộng đồng</h6>
              <ul class="list-unstyled small">
                <li><a href="#"
                     class="text-decoration-none text-dark">Hướng dẫn</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Trung tâm trợ giúp</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Liên hệ</a></li>
              </ul>
            </div>
            <!-- Học tập -->
            <div class="col-6 col-sm-6 col-lg-3 mb-4">
              <h6 class="fw-bold mb-3">Học tập</h6>
              <ul class="list-unstyled small">
                <li><a href="#"
                     class="text-decoration-none text-dark">Ngữ pháp</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Từ vựng</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Bài kiểm tra</a></li>
              </ul>
            </div>
            <!-- Kết nối -->
            <div class="col-6 col-sm-6 col-lg-3 mb-4">
              <h6 class="fw-bold mb-3">Kết nối</h6>
              <ul class="list-unstyled small">
                <li><a href="#"
                     class="text-decoration-none text-dark">Discord</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Twitter</a></li>
                <li><a href="#"
                     class="text-decoration-none text-dark">Facebook</a></li>
              </ul>
            </div>
          </div>
          <!-- Dòng cuối -->
          <div class="text-center border-top pt-3 small text-muted"> © 2024 EnglishHub. Xây dựng với <span
                  class="text-danger">❤</span> cho cộng đồng học tiếng Anh. </div>
        </div>
      </footer>
    </div>
  </div>
  <!-- Popup thông báo mới -->
  <div class="modal fade show d-block model-glass"
       tabindex="-1"
       v-if="showPopup"
       style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-bell-fill text-success me-2"></i>Thông báo mới</h5>
          <button type="button"
                  class="btn-close"
                  @click="closePopup"></button>
        </div>
        <div class="modal-body">
          <h6 class="fw-bold">{{ latestNotification?.title }}</h6>
          <p>{{ latestNotification?.content }}</p>
          <small>{{ latestNotification ? new Date(latestNotification.created_at).toLocaleString() : '' }}</small>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary"
                  @click="closePopup">Đóng</button>
          <button class="btn btn-success"
                  @click="markAsRead(latestNotification!.id)">Đánh dấu đã đọc</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.home-bg {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.sidebar-sticky {
  position: sticky;
  top: 1rem;
}

.menu {
  background-color: #f0fdf4;
}

/* Badge vàng */
.topic-badge {
  background-color: #facc15;
  color: #000;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* QuestionCard xanh nhạt */
.question-card {
  background-color: #f0fdf4;
  border: 1px solid #d1fae5;
  cursor: pointer;
  transition: 0.2s;
}

.question-card:hover {
  background-color: #dcfce7;
}

/* Tabs */
.nav-pills .nav-link.active {
  background-color: #16a34a !important;
}

.nav-pills .nav-link {
  color: #16a34a;
  font-weight: 500;
}

.input-group .form-control:focus {
  box-shadow: none;
  outline: none;
}

.input-group:focus-within {
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
  border-radius: 50px;
}

.search-bar {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-bar:focus-within {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(0, 128, 0, 0.2);
}

.model-glass {
  background: rgba(255, 255, 255, 0.8);
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
