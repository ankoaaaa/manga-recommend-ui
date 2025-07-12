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
    <div v-if="isLoading" class="loading-overlay">
      <span class="loader"></span>
    </div>

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
  padding: 20px; /* 内側の余白を少し増やす */
  background-color: #ffffff; /* カードの背景を白に */
  border: 1px solid #e0e0e0; /* 枠線を少し柔らかい色に */
  border-radius: 12px; /* 角をさらに丸くする */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* 薄い影を付けて立体感を出す */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* アニメーションを滑らかに */
}

/* マウスを乗せた時にカードを少し浮かび上がらせる */
li:hover {
  transform: translateY(-5px); /* 少し上に移動 */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1); /* 影を濃くする */
}

/* カード内の見出しと説明文のスタイル */
li h3 {
  margin-top: 0;
  margin-bottom: 8px;
}

li p {
  margin-bottom: 0;
  color: #555; /* 説明文の色を少し薄くする */
}

/* ▼ ローディングオーバーレイのスタイルを追加 ▼ */
.loading-overlay {
  position: fixed; /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明の白で覆う */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 他の要素より手前に表示 */
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  --c: no-repeat radial-gradient(farthest-side, #514b82 92%, #0000);
  background: var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 50%,
    var(--c) 0 50%;
  background-size: 10px 10px;
  animation: l18 1s infinite;
  position: relative;
}
.loader::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: 3px;
  background: repeating-conic-gradient(#0000 0 35deg, #514b82 0 90deg);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
  border-radius: 50%;
}
@keyframes l18 {
  100% {
    transform: rotate(0.5turn);
  }
}
</style>
