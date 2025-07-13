<script setup lang="ts">
// このコンポーネントが受け取るデータの型を定義
interface Manga {
  title: string;
  description: string;
  interpretation?: string;
}

// 親コンポーネント(App.vue)からデータを受け取る準備
defineProps<{
  recommendations: Manga[];
}>();
</script>

<template>
  <div class="response-area">
    <h2>あなたへのおすすめ</h2>
    <ul>
      <li v-for="manga in recommendations" :key="manga.title">
        <h3>{{ manga.title }}</h3>
        <p>{{ manga.description }}</p>

        <div v-if="manga.interpretation" class="interpretation-box">
          <p><strong>AIの推しポイント:</strong> {{ manga.interpretation }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* App.vueから、response-areaとliのスタイルをここに移動 */
.response-area {
  margin-top: 20px;
  text-align: left;
}
li {
  list-style: none;
  margin-bottom: 15px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
li h3 {
  margin-top: 0;
  margin-bottom: 8px;
}
li p {
  margin-bottom: 0;
  color: #555;
}
.interpretation-box {
  margin-top: 15px;
  padding: 10px;
  background-color: #e9f7ef; /* 薄い緑色 */
  border-left: 4px solid #28a745; /* 左の緑の線 */
  border-radius: 4px;
}

.interpretation-box p {
  margin: 0;
  font-size: 14px;
  color: #155724; /* 少し濃い緑色 */
}
</style>
