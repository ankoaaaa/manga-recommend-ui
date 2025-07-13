<script setup lang="ts">
import { reactive } from 'vue';

// このコンポーネントが管理するデータ
const formData = reactive({
  title1: '',
  title2: '',
  title3: '',
  reason: '',
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
  emit('submit', { titles, reason: formData.reason });
};
</script>

<template>
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
/* App.vueから、input-group, input, textarea, button-group, buttonのスタイルをここに移動 */
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
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
