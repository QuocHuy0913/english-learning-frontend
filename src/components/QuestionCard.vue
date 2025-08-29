<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, watch } from 'vue';
import { fetchAnswersByQuestion } from '../api/answers';
import { toggleLikeQuestion, type Question } from '../api/questions';

const props = defineProps<{ question: Question }>();
const emit = defineEmits(['select']);

const answersCount = ref<number>(0);
const likesCount = ref<number>(props.question.likesCount ?? 0);
const liked = ref<boolean>(props.question.liked ?? false);

const onClick = () => {
  emit('select', props.question.id);
};

const toggleLike = async (e: Event) => {
  e.stopPropagation();
  try {
    const res = await toggleLikeQuestion(props.question.id);
    likesCount.value = res.data.likesCount; // ✅ OK vì là ref
    liked.value = res.data.liked;
  } catch (err) {
    console.error('Like error:', err);
  }
};

watch(
  () => props.question,
  (newQ) => {
    likesCount.value = newQ.likesCount ?? 0;
    liked.value = newQ.liked ?? false;
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    const res = await fetchAnswersByQuestion(props.question.id);
    answersCount.value = res.data.length;
  } catch {
    answersCount.value = 0;
  }
});
</script>
<template>
  <div class="card mb-3 shadow-sm border-start border question-card"
       role="button"
       @click="onClick">
    <div class="card-body">
      <!-- Tiêu đề -->
      <h5 class="card-title fw-bold mb-2 text-dark">{{ question.title }}</h5>
      <!-- Nội dung ngắn -->
      <p v-if="question.content"
         class="card-text text-muted small excerpt mb-2"> {{ question.content }} </p>
      <!-- User + thời gian -->
      <div class="d-flex align-items-center mb-2 text-muted small">
        <div class="avatar me-2">
          <i class="bi bi-person-fill text-white"></i>
        </div>
        <span class="fw-semibold">{{ question.user.name }}</span>
        <span class="ms-2">• {{ new Date(question.created_at).toLocaleString() }}</span>
      </div>
      <!-- Tags -->
      <div class="mb-3">
        <span v-for="tag in question.tags ?? []"
              :key="tag.id"
              class="badge text-dark fw-semibold border border-success-subtle me-2"> {{ tag.name }} </span>
      </div>
      <!-- Stats -->
      <div class="d-flex gap-3 text-muted small align-items-center">
        <div role="button"
             class="d-flex align-items-center"
             @click="toggleLike">
          <i class="bi me-1"
             :class="liked ? 'bi-hand-thumbs-up-fill text-success' : 'bi-hand-thumbs-up text-muted'"></i> {{ likesCount
            }} thích
        </div>
        <div><i class="bi bi-check2-circle me-1 text-success"></i>{{ answersCount }} trả lời</div>
      </div>
    </div>
  </div>
</template>
