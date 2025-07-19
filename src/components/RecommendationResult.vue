<script setup lang="ts">
import { ref } from 'vue';

interface Manga {
  title: string;
  description: string;
  interpretation?: string;
  volumeCount?: number;
  publishedYear?: number;
}
interface Category {
  categoryTitle: string;
  recommendations: Manga[];
}
const props = defineProps<{
  categories: Category[];
}>();

const emit = defineEmits(['manga-feedback', 'category-feedback']);

const selectedFeedback = ref<Record<string, 'good' | 'bad'>>({});
const onMangaFeedback = (title: string, evaluation: 'good' | 'bad') => {
  // すでに同じ評価が選択されていたら、選択を解除
  if (selectedFeedback.value[title] === evaluation) {
    delete selectedFeedback.value[title];
    emit('manga-feedback', { title, evaluation: 'none' }); // 'none'で解除を通知
  } else {
    selectedFeedback.value[title] = evaluation;
    emit('manga-feedback', { title, evaluation });
  }
};

// カテゴリ評価も同様に
const onCategoryFeedback = (title: string, evaluation: 'good' | 'bad') => {
  if (selectedFeedback.value[title] === evaluation) {
    delete selectedFeedback.value[title];
    emit('category-feedback', { title, evaluation: 'none' });
  } else {
    selectedFeedback.value[title] = evaluation;
    emit('category-feedback', { title, evaluation });
  }
};
</script>

<template>
  <div class="response-area">
    <div
      v-for="category in categories"
      :key="category.categoryTitle"
      class="category-section"
    >
      <div class="category-header">
        <h2>
          {{ category.categoryTitle }}
          <div class="feedback-buttons">
            <button
              @click="onCategoryFeedback(category.categoryTitle, 'good')"
              :class="{
                selected: selectedFeedback[category.categoryTitle] === 'good',
              }"
              title="この切り口は良い"
            >
              👍
            </button>
            <button
              @click="onCategoryFeedback(category.categoryTitle, 'bad')"
              :class="{
                selected: selectedFeedback[category.categoryTitle] === 'bad',
              }"
              class="bad"
              title="この切り口は違う"
            >
              👎
            </button>
          </div>
        </h2>
      </div>

      <ul>
        <li v-for="manga in category.recommendations" :key="manga.title">
          <h3>{{ manga.title }}</h3>
          <div class="manga-meta">
            <span v-if="manga.volumeCount">全{{ manga.volumeCount }}</span>
            <span v-if="manga.publishedYear">{{ manga.publishedYear }}～</span>
          </div>
          <p>{{ manga.description }}</p>
          <div v-if="manga.interpretation" class="interpretation-box">
            <p><strong>AIの推しポイント:</strong> {{ manga.interpretation }}</p>
          </div>
          <div class="feedback-buttons">
            <button
              @click="onMangaFeedback(manga.title, 'good')"
              :class="{ selected: selectedFeedback[manga.title] === 'good' }"
              title="この方向でもっと探す"
            >
              👍
            </button>
            <button
              @click="onMangaFeedback(manga.title, 'bad')"
              :class="{ selected: selectedFeedback[manga.title] === 'bad' }"
              class="bad"
              title="これは好みじゃない"
            >
              👎
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.category-section {
  margin-bottom: 40px;
}
.category-section h2 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

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

.manga-meta {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}
.manga-meta span {
  margin-right: 15px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

/* カテゴリヘッダー内のボタンは小さくする */
.category-header .feedback-buttons {
  margin-top: 0;
}

.feedback-buttons button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px; /* 丸いボタンに */
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.feedback-buttons button:hover {
  background-color: #e0e0e0;
  transform: scale(1.1);
}

.feedback-buttons button.bad {
  /* 悪い評価ボタンのスタイル（任意） */
}
.feedback-buttons button.selected {
  background-color: #007bff; /* 例: ポジティブな色 */
  border-color: #0056b3;
  color: white;
}

.feedback-buttons button.bad.selected {
  background-color: #dc3545; /* 例: ネガティブな色 */
  border-color: #c82333;
  color: white;
}
</style>
