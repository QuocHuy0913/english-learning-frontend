<script setup lang="ts">
import { onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import { useNotificationStore } from './stores/notificationStore';

const notificationStore = useNotificationStore()

onMounted(() => {
  notificationStore.loadAll()
})
</script>
<template>
  <div class="app-container">
    <NavBar @ask="$router.push({ name: 'QuestionCreate' })" />
    <router-view></router-view>
  </div>
</template>
<style scoped>
html,
body {
  background-color: #e6f4ea;
  margin: 0;
  padding: 0;
  min-height: 100%;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}
</style>
