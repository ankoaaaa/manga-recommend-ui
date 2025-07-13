<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="introduction-box">
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.introduction-box {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-left: 5px solid #007bff;
  line-height: 1.6;
}
</style>
