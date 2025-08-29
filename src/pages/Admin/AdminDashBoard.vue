<template>
  <div class="container-fluid p-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Trang quản trị</h2>
        <small class="text-muted">Phân tích nền tảng học tiếng Anh</small>
      </div>
      <div>
        <button class="btn btn-outline-secondary btn-sm me-2"
                @click="exportData">Xuất dữ liệu</button>
        <button class="btn btn-dark btn-sm"
                @click="loadStats">Làm mới</button>
      </div>
    </div>
    <!-- Stats Cards -->
    <div class="row g-3 mb-4 align-items-stretch">
      <div class="col-6 col-xl-4 col-1"
           v-for="card in statsCards"
           :key="card.title">
        <div class="card shadow-sm card-hover h-100">
          <div :class="['card-body p-4 fw-bold text-dark', card.bgLightClass]">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>{{ card.title }}</div>
              <div class="icon-circle">
                <i :class="card.icon + ' fs-5'"></i>
              </div>
            </div>
            <h4 class="fw-bold">{{ card.value?.toLocaleString('vi-VN') ?? 0 }}</h4>
            <small :class="card.textClass">{{ card.change }}</small>
          </div>
        </div>
      </div>
    </div>
    <!-- Tabs -->
    <ul class="nav nav-pills mb-3 p-2 rounded shadow-sm justify-content-around"
        role="tablist"
        :style="{
          backgroundColor: tabs.find(t => t.id === activeTab)?.bgColor,
          transition: 'background-color 0.5s ease'
        }">
      <li class="nav-item flex-fill text-center col-6 col-lg-2"
          v-for="tab in tabs"
          :key="tab.id">
        <button class="nav-link fw-semibold w-100"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"> {{ tab.label }} </button>
      </li>
    </ul>
    <div class="tab-content p-4 border rounded bg-white shadow-sm">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminApi } from '@/api/adminApi'
import GrowthTrend from './GrowthTrend.vue'
import AdminUsers from './AdminUsers.vue'
import AdminQuestions from './AdminQuestions.vue'
import AdminAnswers from './AdminAnswers.vue'
import AdminReports from './AdminReports.vue'
import AdminNotifications from './AdminNotifications.vue'

/* ================== INTERFACES ================== */
interface StatsCard {
  title: string
  icon: string
  value: number
  change: string
  bgLightClass: string
  textClass: string
}

/* ================== STATE ================== */
const adminApi = useAdminApi()
const statsCards = ref<StatsCard[]>([])

const tabs = [
  { id: 'growth', label: 'Xu hướng tăng trưởng', component: GrowthTrend, bgColor: '#198754' }, // blue
  { id: 'users', label: 'Người dùng', component: AdminUsers, bgColor: '#0d6efd' },           // green
  { id: 'questions', label: 'Câu hỏi', component: AdminQuestions, bgColor: '#198754' },     // cyan
  { id: 'answers', label: 'Câu trả lời', component: AdminAnswers, bgColor: '#8366bd' },     // purple
  { id: 'reports', label: 'Báo cáo', component: AdminReports, bgColor: '#dc3545' },         // red
  { id: 'notifications', label: 'Thông báo', component: AdminNotifications, bgColor: '#ffc107' }, // yellow
]

const activeTab = ref('growth')
const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.component : null
})

/* ================== METHODS ================== */
const loadStats = async () => {
  try {
    const [userCount, questionCount, answerCount, totalLikes, reportsCount, notificationsCount] = await Promise.all([
      adminApi.countUsers(),
      adminApi.countQuestions(),
      adminApi.countAnswers(),
      adminApi.getTotalAnswerLikes(),
      adminApi.countReports(),
      adminApi.countNotifications(),
    ])

    statsCards.value = [
      { title: 'Người dùng', icon: "bi bi-person", value: userCount, change: 'Tăng 12% so với tháng trước', textClass: 'text-primary', bgLightClass: 'bg-primary-subtle' },
      { title: 'Câu hỏi', icon: "bi bi-chat-dots", value: questionCount, change: '+8% so với tháng trước', textClass: 'text-success', bgLightClass: 'bg-success-subtle' },
      { title: 'Câu trả lời', icon: "bi bi-chat-right-dots", value: answerCount, change: '+15% so với tháng trước', textClass: 'text-purple', bgLightClass: 'bg-purple-subtle' },
      { title: 'Báo cáo', icon: "bi bi-exclamation-triangle", value: reportsCount, change: '-10% so với tháng trước', textClass: 'text-danger', bgLightClass: 'bg-danger-subtle' },
      { title: 'Thông báo', icon: "bi bi-bell", value: notificationsCount, change: 'Không thay đổi', textClass: 'text-warning', bgLightClass: 'bg-warning-subtle' },
      { title: 'Tổng lượt thích', icon: "bi bi-hand-thumbs-up", value: totalLikes, change: '+22% so với tháng trước', textClass: 'text-pink', bgLightClass: 'bg-pink-subtle' },
    ]
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu:', err)
  }
}

const exportData = () => {
  console.log('Xuất dữ liệu dashboard...', statsCards.value)
}

onMounted(async () => {
  await loadStats()
})
</script>
<style scoped>
.icon-circle {
  width: 35px;
  height: 35px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-circle i {
  -webkit-text-stroke: 0.25px currentColor;
}

.bg-purple-subtle {
  background-color: #d4c1f9;
}

.bg-pink-subtle {
  background-color: #fecce3;
}

.nav-pills .nav-link {
  border: none;
  color: white;
  transition: all 0.3s ease;
  position: relative;
}

.nav-pills .nav-link.active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.nav-pills .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  border-radius: 2px;
  background-color: currentColor;
}
</style>
