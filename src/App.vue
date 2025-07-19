<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import HistoryModal from './components/HistoryModal.vue';
import RecommendationForm from './components/RecommendationForm.vue';
import RecommendationResult from './components/RecommendationResult.vue';
import IntroductionText from './components/IntroductionText.vue';
import TheHeader from './components/TheHeader.vue';
import { loadHistory, saveHistory, type HistoryItem } from './utils/history';

const state = reactive({
  latestResponse: null as any,
  historyList: [] as HistoryItem[],
  isLoading: false,
  isHistoryModalOpen: false,
  loadingMessage: '',
});

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/recommendations`;

onMounted(() => {
  state.historyList = loadHistory();
});

// RecommendationFormからデータを受け取ってAPIを呼び出す関数
const handleGetRecommendations = async (formData: {
  titles: string[];
  reason: string;
}) => {
  state.loadingMessage = 'AIがあなたにぴったりの漫画を選んでいます...';
  state.isLoading = true;
  state.latestResponse = null;
  try {
    const response = await axios.post(apiUrl, {
      titles: formData.titles,
      reason: formData.reason,
    });

    state.latestResponse = response.data;

    // 1. 新しいデータ構造から、すべてのrecommendationsを一つの配列にまとめる
    const allRecommendations = response.data.categories.flatMap(
      (category: any) => category.recommendations
    );

    // 2. 修正したデータで履歴オブジェクトを作成
    const newHistory = [
      {
        id: Date.now(),
        inputTitles: formData.titles,
        recommendations: allRecommendations, // ここを修正！
        date: new Date().toLocaleString('ja-JP'),
      },
      ...state.historyList,
    ];

    state.historyList = newHistory.slice(0, 10);
    saveHistory(state.historyList);
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    // ▼ エラー時のデータ構造を正常時と合わせる ▼
    state.latestResponse = {
      introduction: 'エラー', // introductionも追加
      categories: [
        {
          categoryTitle: 'エラー',
          recommendations: [
            {
              title: '取得に失敗しました',
              description: '時間をおいて再度お試しください。',
            },
          ],
        },
      ],
    };
  } finally {
    state.isLoading = false;
  }
};
const openHistoryModal = () => {
  state.isHistoryModalOpen = true;
};
</script>

<template>
  <TheHeader @show-history="openHistoryModal" />
  <div class="container">
    <RecommendationForm @submit="handleGetRecommendations" />
    <div v-if="state.latestResponse" class="results-container">
      <IntroductionText
        v-if="state.latestResponse.introduction"
        :text="state.latestResponse.introduction"
      />
      <RecommendationResult
        v-if="state.latestResponse.categories"
        :categories="state.latestResponse.categories"
      />
    </div>
  </div>

  <div v-if="state.isLoading" class="loading-overlay">
    <div class="loader-container">
      <span class="loader"></span>
      <p class="loading-message">{{ state.loadingMessage }}</p>
    </div>
  </div>

  <Transition name="modal-fade">
    <HistoryModal
      v-if="state.isHistoryModalOpen"
      :history="state.historyList"
      @close="state.isHistoryModalOpen = false"
    />
  </Transition>
</template>

<style scoped>
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

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* ▼ メッセージのスタイル ▼ */
.loading-message {
  font-size: 18px;
  font-weight: bold;
  color: #333;
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
