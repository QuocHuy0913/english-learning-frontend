<template>
  <div class="card p-3 shadow-sm">
    <h4>Biểu đồ tăng trưởng của website EnglishHub</h4>
    <small class="text-muted">Dữ liệu tăng trưởng theo tháng</small>
    <div style="height: 400px;">
      <Line :data="chartData"
            :options="chartOptions" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  type ChartOptions,
  type ChartData
} from 'chart.js'
import { useAdminApi } from '@/api/adminApi'

/* ================== CHART.JS REGISTER ================== */
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler)

/* ================== STATE ================== */
interface GrowthStat {
  month: string
  users: number
  questions: number
  answers: number
  reports: number
  notifications: number
  likes: number
}

const adminApi = useAdminApi()

const chartData = ref<ChartData<'line'>>({
  labels: [],
  datasets: [],
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
}

/* ================== METHODS ================== */
const loadGrowthData = async () => {
  const data: GrowthStat[] = await adminApi.growthStats()

  chartData.value = {
    labels: data.map((d) => d.month),
    datasets: [
      { label: 'Người dùng', data: data.map((d) => d.users), borderColor: '#0d6efd', tension: 0.4 },
      { label: 'Câu hỏi', data: data.map((d) => d.questions), borderColor: '#198754', tension: 0.4 },
      { label: 'Câu trả lời', data: data.map((d) => d.answers), borderColor: '#6f42c1', tension: 0.4 },
      { label: 'Lượt thích', data: data.map((d) => d.likes), borderColor: '#d63384', tension: 0.4 },
      { label: 'Báo cáo', data: data.map((d) => d.reports), borderColor: '#dc3545', tension: 0.4 },
      { label: 'Thông báo', data: data.map((d) => d.notifications), borderColor: '#ffc107', tension: 0.4 },
    ],
  }
}

/* ================== LIFECYCLE ================== */
onMounted(async () => {
  await loadGrowthData()
})
</script>
