<script setup lang="ts">
import { reactive } from 'vue';

// このコンポーネントが管理するデータ
const formData = reactive({
  title1: '',
  title2: '',
  title3: '',
  reason: '',
  userInfo: {
    // ユーザー自身の情報
    age: 'all', // all, 10s, 20s, 30s, over40
    gender: 'all', // all, male, female
  },
  demographics: [] as string[],
  volume: 'all', // all, under_10, under_20,under_30, over_30
  era: 'all', // all, over_2020y, over_2010y, over_2000y, old
});

// 親コンポーネント(App.vue)にイベントを通知するための準備
const emit = defineEmits(['submit']);

// ボタンが押された時に、入力データを親に渡す
const handleSubmit = () => {
  const titles = [formData.title1, formData.title2, formData.title3].filter(
    (t) => t
  );
  if (titles.length === 0) {
    alert('好きな漫画を1つ以上入力してください。');
    return;
  }
  // 親コンポーネントに、フィルター情報も一緒に渡す
  emit('submit', {
    titles,
    reason: formData.reason,
    filters: {
      userInfo: formData.userInfo,
      demographics: formData.demographics,
      volume: formData.volume,
      era: formData.era,
    },
  });
};
</script>

<template>
  <div class="filter-group">
    <h4 class="filter-title">絞り込み条件</h4>
    <div class="filter-columns">
      <div class="filter-column">
        <div class="filter-item">
          <label>あなたの年代:</label>
          <select v-model="formData.userInfo.age">
            <option value="all">指定なし</option>
            <option value="10s">10代</option>
            <option value="20s">20代</option>
            <option value="30s">30代</option>
            <option value="over40">40代以上</option>
          </select>
        </div>
        <div class="filter-item">
          <label>あなたの性別:</label>
          <select v-model="formData.userInfo.gender">
            <option value="all">指定なし</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
      </div>
      <div class="filter-column">
        <div class="filter-item">
          <label>おすすめしてほしい巻数:</label>
          <select v-model="formData.volume">
            <option value="all">すべて</option>
            <option value="under_10">10巻未満</option>
            <option value="under_20">20巻未満</option>
            <option value="under_30">30巻未満</option>
            <option value="over_30">30巻以上</option>
          </select>
        </div>
        <div class="filter-item">
          <label>おすすめしてほしい年代:</label>
          <select v-model="formData.era">
            <option value="all">すべて</option>
            <option value="over_2020y">2020年代～</option>
            <option value="over_2010y">2010年代～</option>
            <option value="over_2000y">2000年代～</option>
            <option value="old">～2000年代</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="input-group">
    <p>好きな漫画のタイトルを3つまで入力してください</p>
    <input v-model="formData.title1" type="text" placeholder="例: 呪術廻戦" />
    <input
      v-model="formData.title2"
      type="text"
      placeholder="例: チェンソーマン"
    />
    <input v-model="formData.title3" type="text" placeholder="例: ダンダダン" />
    <textarea
      v-model="formData.reason"
      rows="3"
      placeholder="どんなところが好きですか？（例: 主人公の成長、緻密な伏線など）"
    ></textarea>
  </div>

  <div class="button-group">
    <button @click="handleSubmit">おすすめを教えてもらう</button>
  </div>
</template>

<style scoped>
/* ----- 入力グループ ----- */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.input-group p {
  text-align: center;
}
input,
textarea {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}
textarea {
  margin-top: 10px;
}

/* ----- フィルターグループ ----- */
.filter-group {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fcfcfc;
}
.filter-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #555;
}
.filter-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 30px; /* 縦と横の隙間 */
}
.filter-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.filter-item label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}
.filter-item select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
}

.filter-item label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  white-space: nowrap; /* テキストを折り返さない */
}

/* ----- ボタン ----- */
.button-group {
  text-align: center;
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
button:hover {
  background-color: #0056b3;
}

/* --- ▼ 縦画面用のスマホ対応を追加 ▼ --- */

@media (max-height: 700px) {
  .filter-group {
    margin: 10px auto;
    padding: 10px;
    gap: 10px;
  }
  .input-group {
    margin-bottom: 10px;
  }
  .input-group p {
    margin-bottom: 10px; /* pタグの余白も詰める */
  }
  .button-group {
    margin-top: 10px;
  }
  .filter-title {
    margin-bottom: 10px;
  }
  input,
  textarea {
    padding: 8px; /* 入力欄の高さも少し詰める */
    font-size: 14px;
  }
}
</style>
