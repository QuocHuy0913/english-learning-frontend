<script lang="ts" setup>
import { ref, computed } from 'vue';
import { createReply, likeAnswer, unlikeAnswer, updateAnswer, type Answer } from '@/api/answers';

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
</script>
<template>
  <div class="card mb-2 p-3">
    <!-- Nội dung answer -->
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div class="flex-grow-1 me-3"
           style="white-space: pre-line; margin-bottom:0;">
        <template v-if="!isEditing"> {{ editedContent }} </template>
        <template v-else>
          <textarea v-model="editedContent"
                    class="form-control"></textarea>
          <div class="mt-1 d-flex gap-2">
            <button class="btn btn-sm btn-success mt-1"
                    :disabled="saving"
                    @click="saveEdit">Lưu</button>
            <button class="btn btn-sm btn-secondary mt-1"
                    :disabled="saving"
                    @click="cancelEdit">Hủy</button>
          </div>
        </template>
      </div>
      <div v-if="canEdit && !isEditing"
           class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary"
                @click="startEdit">Sửa</button>
        <button class="btn btn-sm btn-outline-danger"
                @click="deleteAnswer">Xóa</button>
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
      <small class="text-muted ms-auto"> Bởi {{ answer.user.name }} — {{ new Date(answer.created_at).toLocaleString() }}
      </small>
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
</template>
<style scoped>
.card {
  border-radius: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 128, 0, 0.1);
}
</style>
