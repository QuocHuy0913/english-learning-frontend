<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { createReply, likeAnswer, unlikeAnswer, type Answer } from '@/api/answers';

interface User {
  id: number;
  name: string;
}

const props = defineProps<{
  answer: Answer & {
    liked_by_current_user?: boolean;
    replies?: Answer[];
  };
  currentUser: User | null;
}>();

const emit = defineEmits<{
  (e: 'edit', answerId: number): void;
  (e: 'delete', answerId: number): void;
}>();

// ===== Like state =====
const liked = ref(props.answer.liked_by_current_user || false);
const likeCount = ref(props.answer.like_count || 0);
const liking = ref(false);

const canEdit = computed(() => props.currentUser?.id === props.answer.user.id);

watch(
  () => props.answer.liked_by_current_user,
  (newVal) => {
    liked.value = !!newVal;
  }
);

// ===== Replies state (local copy) =====
const replies = ref<Answer[]>(props.answer.replies ? [...props.answer.replies] : []);

// ===== Like/Unlike =====
async function toggleLike() {
  if (!props.currentUser || liking.value) return;

  liking.value = true;
  try {
    let res;
    if (liked.value) {
      res = await unlikeAnswer(props.answer.id);
    } else {
      res = await likeAnswer(props.answer.id);
    }
    likeCount.value = res.data.like_count;
    liked.value = res.data.liked_by_current_user;
  } catch (err) {
    console.error('Failed to toggle like:', err);
  } finally {
    liking.value = false;
  }
}

// ===== Edit/Delete =====
function onEdit() {
  emit('edit', props.answer.id);
}

function onDelete() {
  if (confirm('Are you confirm to delete this answer?')) {
    emit('delete', props.answer.id);
  }
}

// ===== Reply form =====
const replying = ref(false);
const replyContent = ref('');
const submittingReply = ref(false);

async function submitReply() {
  if (!replyContent.value.trim() || !props.currentUser) return;

  submittingReply.value = true;
  try {
    const res = await createReply(props.answer.id, { content: replyContent.value });
    replyContent.value = '';
    replying.value = false;

    replies.value.push(res.data);
  } catch (err) {
    console.error('Failed to create reply:', err);
  } finally {
    submittingReply.value = false;
  }
}

function removeChildReply(answerId: number) {
  replies.value = replies.value.filter(r => r.id !== answerId);
}
</script>
<template>
  <div class="card mb-2 p-3">
    <!-- Nội dung answer -->
    <div class="d-flex justify-content-between align-items-start mb-2">
      <p class="flex-grow-1 me-3"
         style="white-space: pre-line; margin-bottom:0;">{{ answer.content }}</p>
      <div v-if="canEdit"
           class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary"
                @click="onEdit">Sửa</button>
        <button class="btn btn-sm btn-outline-danger"
                @click="onDelete">Xóa</button>
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
      <small class="text-muted ms-auto"> By {{ answer.user.name }} — {{ new Date(answer.created_at).toLocaleString() }}
      </small>
    </div>
    <!-- Reply button -->
    <div class="mt-2">
      <button class="btn btn-sm btn-outline-secondary"
              @click="replying = !replying"> {{ replying ? 'Cancel' : 'Reply' }} </button>
    </div>
    <!-- Reply form -->
    <div v-if="replying"
         class="mt-2">
      <textarea v-model="replyContent"
                rows="2"
                class="form-control"
                placeholder="Write a reply..."></textarea>
      <button class="btn btn-sm btn-primary mt-2"
              :disabled="submittingReply"
              @click="submitReply">Send</button>
    </div>
    <!-- Danh sách replies (đệ quy AnswerCard) -->
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
