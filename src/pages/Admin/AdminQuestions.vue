<script setup lang="ts">
import { useAdminApi } from "@/api/adminApi"
import { fetchAnswersByQuestion } from "@/api/answers"
import { fetchQuestions, type Question } from "@/api/questions"
import { ref, onMounted, computed } from "vue"

const questions = ref<Question[]>([])
const answersCountMap = ref<Record<number, number>>({})
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)

const totalQuestions = ref(0);
const totalPages = computed(() => Math.ceil(totalQuestions.value / limit.value));

const adminApi = useAdminApi()

async function loadQuestions() {
  loading.value = true
  try {
    const res = await fetchQuestions(page.value, limit.value)
    questions.value = res.data.items   // backend giả sử trả { items, total }
    total.value = res.data.total
    totalQuestions.value = res.data.total

    // sau khi có danh sách câu hỏi thì mới lấy answersCount
    for (const q of questions.value) {
      try {
        const resAns = await fetchAnswersByQuestion(q.id)
        answersCountMap.value[q.id] = resAns.data.length
      } catch {
        answersCountMap.value[q.id] = 0
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm("Bạn có chắc muốn xóa câu hỏi này?")) return
  await adminApi.deleteQuestion(id)
  await loadQuestions()
}

function truncate(text: string, length = 80) {
  return text.length > length ? text.substring(0, length) + "..." : text
}

onMounted(() => {
  loadQuestions()
})
</script>
<template>
  <div class="card p-3">
    <h4 class="m-0">Quản lý câu hỏi</h4>
    <div v-if="loading"
         class="alert alert-info">Đang tải...</div>
    <table class="table table-striped table-hover align-middle mt-4">
      <thead class="table-success">
        <tr>
          <th style="width: 15%"
              class="ps-3">Tiêu đề</th>
          <th style="width: 25%">Nội dung</th>
          <th style="width: 10%"
              class="text-center">Tác giả</th>
          <th style="width: 20%">Tags</th>
          <th style="width: 10%"
              class="text-center">Số câu trả lời</th>
          <th style="width: 10%"
              class="text-center">Ngày tạo</th>
          <th style="width: 10%"
              class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="q in questions"
            :key="q.id">
          <td class="fw-semibold ps-3">
            <div class="text-truncate-3"> {{ q.title }} </div>
          </td>
          <td>{{ truncate(q.content, 80) }}</td>
          <td class="text-center">{{ q.user?.name }}</td>
          <td>
            <div class="text-truncate-3">
              <span v-for="t in q.tags"
                    :key="t.id"
                    class="badge text-dark border border-secondary m-1">{{ t.name }}</span>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center justify-content-center">
              <i class="bi bi-chat-left-text me-2"></i>{{ answersCountMap[q.id] ?? 0 }}
            </div>
          </td>
          <td class="text-center align-items-center"> {{ new Date(q.created_at).toLocaleDateString() }} <div
                 class="d-flex justify-content-center align-items-center">
              <a :href="`/questions/${q.id}`"
                 class="btn p-0 bi bi-eye fs-5"></a>
            </div>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger"
                    @click="handleDelete(q.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <nav>
      <div class="d-flex justify-content-center gap-2 mt-3">
        <button class="btn btn-outline-success rounded-pill px-4"
                :disabled="page === 1"
                @click="page--, loadQuestions()">Trước</button>
        <span class="align-self-center fw-semibold">Trang {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-outline-success rounded-pill px-4"
                :disabled="questions.length < limit"
                @click="page++, loadQuestions()">Tiếp</button>
      </div>
    </nav>
  </div>
</template>
<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}
</style>
