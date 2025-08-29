<script lang="ts" setup>
import { ref, computed } from 'vue';
import { createReply, likeAnswer, unlikeAnswer, updateAnswer, type Answer } from '@/api/answers';
import { createReport } from '@/api/reports';

interface User { id: number; name: string }

const props = defineProps<{
  answer: Answer & { liked_by_current_user?: boolean; replies?: Answer[] };
  currentUser: User | null;
}>();

const emit = defineEmits<{
  (e: 'edit', answerId: number): void;
  (e: 'delete', answerId: number): void;
}>();

// ===== State =====
const liked = ref(props.answer.liked_by_current_user || false);
const likeCount = ref(props.answer.like_count || 0);
const liking = ref(false);
const replies = ref<Answer[]>(props.answer.replies ?? []);
const isEditing = ref(false);
const editedContent = ref(props.answer.content);
const saving = ref(false);
const replying = ref(false);
const replyContent = ref('');
const submittingReply = ref(false);

const canEdit = computed(() => props.currentUser?.id === props.answer.user.id);

const showReportModal = ref(false)
const reportReason = ref('')
const reportError = ref('')
const reportSuccess = ref('')

// ===== Functions =====

const startEdit = () => {
  isEditing.value = true;
};

const toggleLike = async () => {
  if (!props.currentUser || liking.value) return;
  liking.value = true;
  try {
    const res = liked.value
      ? await unlikeAnswer(props.answer.id)
      : await likeAnswer(props.answer.id);
    liked.value = res.data.liked_by_current_user;
    likeCount.value = res.data.like_count;
  } finally { liking.value = false; }
};

const saveEdit = async () => {
  if (!editedContent.value.trim()) return;
  saving.value = true;
  try {
    const res = await updateAnswer(props.answer.id, editedContent.value);
    editedContent.value = res.data.content;
    isEditing.value = false;
  } finally { saving.value = false; }
};

const cancelEdit = () => { editedContent.value = props.answer.content; isEditing.value = false; };
const deleteAnswer = () => { if (confirm('Bạn có chắc chắn muốn xóa?')) emit('delete', props.answer.id); };

const submitReply = async () => {
  if (!replyContent.value.trim() || !props.currentUser) return;
  submittingReply.value = true;
  try {
    const res = await createReply(props.answer.id, { content: replyContent.value });
    replies.value.push(res.data);
    replyContent.value = '';
    replying.value = false;
  } finally { submittingReply.value = false; }
};

const removeChildReply = (id: number) => replies.value = replies.value.filter(r => r.id !== id);

const onReport = () => {
  if (!props.currentUser) {
    alert('Bạn phải đăng nhập để báo cáo câu trả lời!')
    return
  }
  reportReason.value = ''
  reportError.value = ''
  reportSuccess.value = ''
  showReportModal.value = true
}

const submitReport = async () => {
  if (!reportReason.value.trim()) {
    reportError.value = 'Vui lòng nhập lý do báo cáo'
    return
  }
  try {
    await createReport('answer', props.answer.id, reportReason.value)
    reportSuccess.value = 'Báo cáo thành công!'
    reportError.value = ''
    setTimeout(() => {
      showReportModal.value = false
    }, 1500)
  } catch {
    reportError.value = 'Gửi báo cáo thất bại!'
  }
}
</script>
<template>
  <div class="card mb-2 p-3">
    <!-- Nội dung answer -->
    <!-- Header của answer -->
    <div class="mb-2">
      <!-- Nội dung -->
      <div class="mb-2"
           style="white-space: pre-line;">
        <template v-if="!isEditing">{{ editedContent }}</template>
        <template v-else>
          <textarea v-model="editedContent"
                    class="form-control"></textarea>
          <div class="mt-1 d-flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-success"
                    :disabled="saving"
                    @click="saveEdit">Lưu</button>
            <button class="btn btn-sm btn-secondary"
                    :disabled="saving"
                    @click="cancelEdit">Hủy</button>
          </div>
        </template>
      </div>
      <!-- Người đăng -->
      <small class="text-muted d-block mb-2"> Bởi {{ answer.user.name }} — {{ new
        Date(answer.created_at).toLocaleString() }} </small>
      <!-- Các nút hành động -->
      <div class="d-flex flex-wrap gap-2">
        <button v-if="canEdit && !isEditing"
                class="btn btn-sm btn-outline-primary"
                @click="startEdit">Sửa</button>
        <button v-if="canEdit && !isEditing"
                class="btn btn-sm btn-outline-danger"
                @click="deleteAnswer">Xóa</button>
        <button v-if="currentUser"
                class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2 py-1"
                style="white-space: nowrap;"
                @click="onReport">
          <i class="bi bi-flag"></i>
          <span class="d-none d-sm-inline">Báo cáo</span>
        </button>
      </div>
    </div>
    <!-- Like -->
    <div class="d-flex align-items-center">
      <button class="btn btn-sm btn-outline-success me-2"
              :disabled="liking"
              @click="toggleLike">
        <i :class="liked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"></i>
      </button>
      <span>{{ likeCount }}</span>
    </div>
    <!-- Reply button -->
    <div class="mt-2">
      <button class="btn btn-sm btn-outline-secondary"
              @click="replying = !replying"> {{ replying ? 'Hủy' : 'Phản hồi' }} </button>
    </div>
    <!-- Reply form -->
    <div v-if="replying"
         class="mt-2">
      <textarea v-model="replyContent"
                rows="2"
                class="form-control"
                placeholder="Viết phản hồi..."></textarea>
      <button class="btn btn-sm btn-primary mt-2"
              :disabled="submittingReply"
              @click="submitReply">Gửi</button>
    </div>
    <!-- Replies -->
    <div v-if="replies.length"
         class="mt-3 ps-4 border-start">
      <AnswerCard v-for="reply in replies"
                  :key="reply.id"
                  :answer="reply"
                  :current-user="currentUser"
                  @edit="$emit('edit', $event)"
                  @delete="removeChildReply($event)" />
    </div>
  </div>
  <div class="modal fade show"
       tabindex="-1"
       style="display: block; background: rgba(0,0,0,0.5);"
       v-if="showReportModal">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header">
          <h5 class="modal-title">Báo cáo câu trả lời</h5>
          <button type="button"
                  class="btn-close"
                  @click="showReportModal = false"></button>
        </div>
        <div class="modal-body">
          <textarea v-model="reportReason"
                    rows="3"
                    class="form-control"
                    placeholder="Nhập lý do báo cáo..."></textarea>
          <div v-if="reportError"
               class="text-danger mt-2">{{ reportError }}</div>
          <div v-if="reportSuccess"
               class="text-success mt-2">{{ reportSuccess }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary"
                  @click="showReportModal = false">Hủy</button>
          <button class="btn btn-danger"
                  @click="submitReport">Gửi báo cáo</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media (max-width: 576px) {
  .card .btn {
    font-size: 0.8rem;
    padding: 2px 6px;
  }
}

.card {
  border-radius: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 128, 0, 0.1);
}
</style>
