<script setup lang="ts">
import { reactive, onMounted, nextTick } from 'vue';
import HistoryModal from './components/HistoryModal.vue';
import { loadHistory, saveHistory, type HistoryItem } from './utils/history';
import axios from 'axios';

// reactiveを使って、コンポーネントの状態を一つのオブジェクトで管理
const state = reactive({
  title1: '',
  title2: '',
  title3: '',
  latestResponse: null as any,
  historyList: [] as HistoryItem[],
  isLoading: false,
  isHistoryModalOpen: false,
});

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/recommendations`;

// マウント時に履歴を読み込む
onMounted(() => {
  state.historyList = loadHistory();
});

const getRecommendations = async () => {
  state.isLoading = true;
  state.latestResponse = null;
  await nextTick();
  try {
    const titles = [state.title1, state.title2, state.title3].filter((t) => t);
    if (titles.length === 0) {
      alert('好きな漫画を1つ以上入力してください。');
      state.isLoading = false;
      return;
    }
    const response = await axios.post(apiUrl, {
      titles: titles,
    });

    const newHistory = [
      {
        id: Date.now(),
        inputTitles: titles,
        recommendations: response.data.recommendations,
        date: new Date().toLocaleString('ja-JP'),
      },
      ...state.historyList,
    ];
    state.historyList = newHistory.slice(0, 10);
    saveHistory(state.historyList);

    state.latestResponse = response.data;
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    state.latestResponse = {
      recommendations: [
        { title: 'エラー', description: '取得に失敗しました。' },
      ],
    };
  } finally {
    state.isLoading = false;
  }
};
</script>

<template>
  <header class="site-header">
    <h1>AI漫画レコメンド</h1>
    <button @click="state.isHistoryModalOpen = true" class="secondary">
      最近の履歴を見る
    </button>
  </header>

  <div class="container">
    <div v-if="state.isLoading" class="loading-overlay">
      <span class="loader"></span>
    </div>

    <Transition name="modal-fade">
      <HistoryModal
        v-if="state.isHistoryModalOpen"
        :history="state.historyList"
        @close="state.isHistoryModalOpen = false"
      />
    </Transition>

    <div class="input-group">
      <p>好きな漫画のタイトルを3つまで入力してください</p>
      <input v-model="state.title1" type="text" placeholder="例: 呪術廻戦" />
      <input
        v-model="state.title2"
        type="text"
        placeholder="例: チェンソーマン"
      />
      <input v-model="state.title3" type="text" placeholder="例: ダンダダン" />
    </div>

    <div class="button-group">
      <button @click="getRecommendations" :disabled="state.isLoading">
        おすすめを教えてもらう
      </button>
    </div>

    <div v-if="state.latestResponse" class="response-area">
      <h2>あなたへのおすすめ</h2>
      <ul>
        <li
          v-for="manga in state.latestResponse.recommendations"
          :key="manga.title"
        >
          <h3>{{ manga.title }}</h3>
          <p>{{ manga.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* bodyのスタイルはグローバルなmain.cssに移動したので削除 */

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}
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
.site-header .secondary {
  margin-left: auto;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.input-group p {
  text-align: center;
}
input {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

/* ▼ ボタンのグループはFlexboxで中央揃えに統一 ▼ */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
button.secondary {
  background-color: #6c757d;
}
button:hover {
  background-color: #0056b3;
}
button.secondary:hover {
  background-color: #5a6268;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.response-area {
  margin-top: 20px;
  text-align: left;
}

/* liのスタイルはApp.vue内の結果表示用 */
.response-area li {
  list-style: none;
  margin-bottom: 15px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.response-area li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
.response-area li h3 {
  margin-top: 0;
  margin-bottom: 8px;
}
.response-area li p {
  margin-bottom: 0;
  color: #555;
}

/* ローディングオーバーレイとローダーのスタイル */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #007bff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
