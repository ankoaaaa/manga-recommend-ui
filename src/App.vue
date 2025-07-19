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
/* ----- App.vueの基本レイアウト ----- */
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.results-container {
  margin-top: 40px;
}

/* ----- ローディング関連 ----- */
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
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.loading-message {
  font-size: 18px;
  font-weight: bold;
  color: #333;
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

/* ----- スマホ対応 ----- */
@media (max-width: 768px) {
  .container {
    margin: 20px 0;
    padding: 15px;
  }
}
@media (max-height: 700px) {
  .container {
    margin: 15px auto; /* 上下marginをさらに詰める */
    padding: 10px;
  }
}
</style>
