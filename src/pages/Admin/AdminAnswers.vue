<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import {
  deleteAnswer,
  type Answer,
  type AnswerWithQuestion,
} from "@/api/answers"
import { useAdminApi } from "@/api/adminApi";

// Danh sách tất cả câu trả lời
const answers = ref<(Answer & { question: { id: number; title: string } | null })[]>([])

// Group theo question.id
const groupedAnswers = ref<Record<number, typeof answers.value[number][]>>({})

const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)

const totalAnswers = ref(0);
const totalPages = computed(() => Math.ceil(totalAnswers.value / limit.value));

async function loadAnswers() {
  loading.value = true
  try {
    const res = await useAdminApi().listAllAnswers(page.value, limit.value)
    answers.value = res.items
    total.value = res.total
    totalAnswers.value = res.total

    groupedAnswers.value = answers.value.reduce((acc, ans) => {
      const qid = ans.question?.id
      if (!qid) return acc
      if (!acc[qid]) acc[qid] = []
      acc[qid].push(ans)
      return acc
    }, {} as Record<number, AnswerWithQuestion[]>)
  } finally {
    loading.value = false
  }
}



async function handleDelete(id: number) {
  if (!confirm("Bạn có chắc muốn xóa câu trả lời này?")) return
  await deleteAnswer(id)
  await loadAnswers()
}

onMounted(() => {
  loadAnswers()
})
</script>
<template>
  <div class="card p-3">
    <h4 class="m-0">Quản lý câu trả lời</h4>
    <div v-if="loading"
         class="alert alert-info mt-3"> Đang tải... </div>
    <div v-for="(ansList, qid) in groupedAnswers"
         :key="qid"
         class="mt-4">
      <!-- Tiêu đề câu hỏi -->
      <div class="fw-bold text-purple mb-2">
        <i class="bi bi-question-circle me-2"></i> {{ ansList[0].question?.title }}
      </div>
      <!-- Bảng câu trả lời -->
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="thead-purple">
            <tr>
              <th style="width: 40%">Nội dung</th>
              <th style="width: 15%"
                  class="text-center">Tác giả</th>
              <th style="width: 10%"
                  class="text-center">Số like</th>
              <th style="width: 15%"
                  class="text-center">Ngày tạo</th>
              <th style="width: 10%"
                  class="text-center">Ngày cập nhật</th>
              <th style="width: 10%"
                  class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in ansList"
                :key="a.id">
              <td>{{ a.content }}</td>
              <td class="text-center">{{ a.user.name }}</td>
              <td class="text-center">
                <i class="bi bi-hand-thumbs-up me-1"></i>{{ a.like_count ?? 0 }}
              </td>
              <td class="text-center">{{ new Date(a.created_at).toLocaleDateString() }}</td>
              <td class="text-center">{{ new Date(a.updated_at).toLocaleDateString() }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger"
                        @click="handleDelete(a.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Pagination -->
    <nav>
      <div class="d-flex justify-content-center gap-2 mt-3">
        <button class="btn btn-outline-purple rounded-pill px-4"
                :disabled="page === 1"
                @click="page--; loadAnswers()">Trước</button>
        <span class="align-self-center fw-semibold">Trang {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-outline-purple rounded-pill px-4"
                :disabled="page * limit >= total"
                @click="page++; loadAnswers()">Tiếp</button>
      </div>
    </nav>
  </div>
</template>
<style scoped>
.text-purple {
  color: #8366bd;
}

.thead-purple th {
  background-color: #d4c1f9 !important;
}

.btn-outline-purple {
  color: #8366bd !important;
  border-color: #8366bd !important;
}

.btn-outline-purple:hover {
  color: white !important;
  background-color: #8366bd !important;
  border-color: #8366bd !important;
}
</style>
