<script setup lang="ts">
// 親コンポーネント(App.vue)に「履歴ボタンが押された」ことを通知する
const emit = defineEmits(['show-history']);
</script>

<template>
  <header class="site-header">
    <h1>AI漫画レコメンド</h1>
    <button @click="emit('show-history')" class="secondary">
      最近の履歴を見る
    </button>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.site-header h1 {
  margin: 0;
  font-size: 24px;
}
.site-header button {
  /* 直接buttonタグを指定 */
  margin-left: auto;
  padding: 8px 16px; /* 少し小さく調整 */
  font-size: 14px;
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.site-header button:hover {
  background-color: #5a6268;
}
</style>
