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
  padding: 10px 20px; /* 左右の余白を少し狭める */
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.site-header h1 {
  margin: 0;
  font-size: 20px; /* タイトルの文字サイズを少し小さく */
}
.site-header button {
  margin-left: auto;
  padding: 6px 12px; /* ボタンの余白を少し小さく */
  font-size: 13px; /* ボタンの文字サイズを少し小さく */
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap; /* ボタン内のテキストも折り返さない */
}
.site-header button:hover {
  background-color: #5a6268;
}
@media (max-height: 700px) {
  .site-header {
    padding: 8px 20px; /* ヘッダーの高さも詰める */
  }
  .site-header h1 {
    font-size: 18px;
  }
}
</style>
