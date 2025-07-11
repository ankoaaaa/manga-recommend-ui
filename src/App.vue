<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

// 3つの漫画タイトルを保持するための変数
const title1 = ref('');
const title2 = ref('');
const title3 = ref('');

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/recommendations`;

const responseData = ref<any>(null);
const isLoading = ref(false);

const getRecommendations = async () => {
  isLoading.value = true;
  responseData.value = null;
  try {
    const titles = [title1.value, title2.value, title3.value].filter((t) => t); // 空のタイトルを除外
    if (titles.length === 0) {
      alert('好きな漫画を1つ以上入力してください。');
      isLoading.value = false;
      return;
    }

    // POSTメソッドに変更し、リクエストボディにタイトルリストを詰める
    const response = await axios.post(apiUrl, {
      titles: titles,
    });
    responseData.value = response.data;
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    responseData.value = { message: 'エラーが発生しました' };
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <h1>AI漫画レコメンド</h1>

    <div class="input-group">
      <p>好きな漫画のタイトルを3つまで入力してください</p>
      <input v-model="title1" type="text" placeholder="例: 呪術廻戦" />
      <input v-model="title2" type="text" placeholder="例: チェンソーマン" />
      <input v-model="title3" type="text" placeholder="例: ダンダダン" />
    </div>

    <button @click="getRecommendations" :disabled="isLoading">
      {{ isLoading ? '考え中...' : 'おすすめを教えてもらう' }}
    </button>

    <div v-if="responseData" class="response-area">
      <h2>あなたへのおすすめ</h2>
      <ul>
        <li v-for="manga in responseData.recommendations" :key="manga.title">
          <h3>{{ manga.title }}</h3>
          <p>{{ manga.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

h1,
.input-group p {
  text-align: center;
}

input {
  /* ▼ input要素が親の幅いっぱいに広がるように設定 ▼ */
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff; /* 青系の背景色 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s; /* ホバー時の色変化を滑らかに */
  /* ボタンを中央に配置するためのスタイル (追加) */
  display: block;
  margin: 20px auto 0; /* 上下に余白、左右中央揃え */
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.response-area {
  margin-top: 20px;
  text-align: left;
}

li {
  list-style: none;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
