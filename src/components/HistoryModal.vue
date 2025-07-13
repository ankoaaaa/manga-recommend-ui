<script setup lang="ts">
import { computed } from 'vue'; // computedをインポート
import type { HistoryItem } from '../utils/history';

// App.vueから渡されるデータ
const props = defineProps<{
  history: HistoryItem[];
}>();

const emit = defineEmits(['close']);

// 表示用のデータを算出プロパティで生成
const uniqueMangaTitles = computed(() => {
  // 1. すべての履歴から、おすすめされた漫画のタイトルだけを一つの配列にまとめる
  const allTitles = props.history.flatMap((item) =>
    item.recommendations.map((manga) => manga.title)
  );

  // 2. Setを使って重複を排除し、再び配列に戻す
  const uniqueTitles = [...new Set(allTitles)];

  // 3. 最新10件に絞り込む
  return uniqueTitles.slice(0, 10);
});
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')">×</button>
      <h2>最近のおすすめタイトル</h2>
      <ul v-if="uniqueMangaTitles.length > 0" class="recommendation-list">
        <li v-for="title in uniqueMangaTitles" :key="title">
          {{ title }}
        </li>
      </ul>
      <p v-else>履歴はまだありません。</p>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.recommendation-list {
  list-style-type: disc; /* 点のリストマーカーを表示 */
  padding-left: 20px;
}

.recommendation-list li {
  padding: 8px 0;
}
</style>
