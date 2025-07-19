<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import HistoryModal from './components/HistoryModal.vue';
import RecommendationForm from './components/RecommendationForm.vue';
import RecommendationResult from './components/RecommendationResult.vue';
import IntroductionText from './components/IntroductionText.vue';
import TheHeader from './components/TheHeader.vue';
import { loadHistory, saveHistory, type HistoryItem } from './utils/history';

// フィードバックの型を定義
interface Feedback {
  title: string;
  evaluation: 'good' | 'bad';
}

const state = reactive({
  initialFormData: null as any, // 最初の検索条件を保存する場所
  latestResponse: null as any,
  historyList: [] as HistoryItem[],
  isLoading: false,
  isHistoryModalOpen: false,
  loadingMessage: '',
  mangaFeedback: [] as Feedback[], // 漫画へのフィードバック
  categoryFeedback: [] as Feedback[], // カテゴリへのフィードバック
});

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/recommendations`;

onMounted(() => {
  state.historyList = loadHistory();
});

// 最初の検索を行う関数
const handleGetRecommendations = async (formData: any) => {
  // 新しい検索なので、過去のフィードバックはリセット
  state.mangaFeedback = [];
  state.categoryFeedback = [];
  // 最初の検索条件をstateに保存
  state.initialFormData = formData;

  await executeSearch(formData, true); // isFirstSearchフラグをtrueに
};

// 絞り込み検索を行う関数
const handleRefineSearch = async () => {
  if (state.initialFormData) {
    // 保存しておいた最初の検索条件を使い、isFirstSearchフラグはfalseに
    await executeSearch(state.initialFormData, false);
  } else {
    alert('まずは最初の検索を実行してください。');
  }
};

// 漫画へのフィードバックを処理する関数
const handleMangaFeedback = (feedback: {
  title: string;
  evaluation: 'good' | 'bad' | 'none';
}) => {
  const index = state.mangaFeedback.findIndex(
    (f) => f.title === feedback.title
  );

  // 評価が'none'なら、リストから削除
  if (feedback.evaluation === 'none') {
    if (index > -1) state.mangaFeedback.splice(index, 1);
    return;
  }

  if (index > -1) {
    state.mangaFeedback[index] = feedback;
  } else {
    state.mangaFeedback.push(feedback);
  }
};

// カテゴリへのフィードバックを処理する関数
const handleCategoryFeedback = (feedback: {
  title: string;
  evaluation: 'good' | 'bad' | 'none';
}) => {
  const index = state.categoryFeedback.findIndex(
    (f) => f.title === feedback.title
  );

  // 評価が'none'なら、リストから削除
  if (feedback.evaluation === 'none') {
    if (index > -1) state.categoryFeedback.splice(index, 1);
    return;
  }

  if (index > -1) {
    state.categoryFeedback[index] = feedback;
  } else {
    state.categoryFeedback.push(feedback);
  }
};

// API呼び出しとレスポンス処理を共通化
const executeSearch = async (formData: any, isFirstSearch: boolean) => {
  const messages = [
    'AIがあなたにぴったりの漫画を選んでいます...',
    '膨大な作品リストから検索中...',
    'あなたの好みを分析しています...',
    '隠れた名作を探しています...',
  ];
  state.loadingMessage = messages[Math.floor(Math.random() * messages.length)];
  state.isLoading = true;
  state.latestResponse = null;

  try {
    const url = isFirstSearch ? apiUrl : `${apiUrl}/refine`;
    const requestData = isFirstSearch
      ? formData
      : {
          initialRequest: formData,
          mangaFeedback: state.mangaFeedback,
          categoryFeedback: state.categoryFeedback,
        };

    const response = await axios.post(url, requestData);
    state.latestResponse = response.data;

    // 履歴保存ロジック（変更なし）
    if (response.data && response.data.categories) {
      const allRecommendations = response.data.categories.flatMap(
        (category: any) => category.recommendations
      );
      const newHistory = [
        {
          id: Date.now(),
          inputTitles: formData.titles,
          recommendations: allRecommendations,
          date: new Date().toLocaleString('ja-JP'),
        },
        ...state.historyList,
      ];
      state.historyList = newHistory.slice(0, 10);
      saveHistory(state.historyList);
    }
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    state.latestResponse = {
      introduction: 'エラーが発生しました',
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
        @manga-feedback="handleMangaFeedback"
        @category-feedback="handleCategoryFeedback"
      />
      <div
        v-if="
          state.mangaFeedback.length > 0 || state.categoryFeedback.length > 0
        "
        class="button-group"
      >
        <button @click="handleRefineSearch">もっと好みに近づける</button>
      </div>
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
