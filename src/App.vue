<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

// 3つの漫画タイトルを保持するための変数
const title1 = ref('');
const title2 = ref('');
const title3 = ref('');

const responseData = ref<any>(null);
const isLoading = ref(false);

const getRecommendations = async () => {
  isLoading.value = true;
  responseData.value = null;
  try {
    const titles = [title1.value, title2.value, title3.value].filter(t => t); // 空のタイトルを除外
    if (titles.length === 0) {
      alert('好きな漫画を1つ以上入力してください。');
      isLoading.value = false;
      return;
    }

    // POSTメソッドに変更し、リクエストボディにタイトルリストを詰める
    const response = await axios.post('https://manga-recommend-api.onrender.com/api/v1/recommendations', {[
      titles: titles
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
  <div>
    <h1>AI漫画レコメンド</h1>
    <div class="input-area">
      <p>好きな漫画のタイトルを3つまで入力してください</p>
      <input v-model="title1" type="text" placeholder="例: 呪術廻戦">
      <input v-model="title2" type="text" placeholder="例: チェンソーマン">
      <input v-model="title3" type="text" placeholder="例: ダンダダン">
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
.input-area { margin-bottom: 20px; }
input { display: block; margin-bottom: 10px; width: 300px; padding: 5px; }
.response-area { margin-top: 20px; }
li { list-style: none; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; }
</style>