<template>
  <div class="analysis">
    <h1 class="title">INTELLI ANALYSIS</h1>

    <div class="filters">
      <label for="model-select">Model</label>
      <select id="model-select" v-model="filters.models" class="model-dropdown">
        <option value="deepseek-chat-v3-0324">DeepSeek V3 0324</option>
        <option value="deepseek-r1-0528">DeepSeek-R1</option>
        <option value="gpt-4.1">GPT-4.1</option>
        <option value="gpt-4o">GPT-4o</option>
        <option value="gemma-3n-e4b-it">Gemma-3n</option>
        <option value="llama-3.1-8b-instruct">LLaMA 3.2</option>
        <option value="llama-4-maverick">LLaMA-4-maverick</option>
      </select>

      <label for="lang-select">Language</label>
      <select id="lang-select" v-model="filters.lang">
        <option value="vi">Vietnamese</option>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      </select>
      <button @click="Analysis" class="btn-filter">Analysis</button>
    </div>

  
  </div>
</template>


<script>
import api from "../utils/api";
import GoogleMap from "../components/features/GoogleMap.vue";
import { marked } from "marked";

export default {
  name: "FoodballAnalysis",
  data() {
    
  },
  methods: {
    
  },
  watch: {

  },
};
</script>

<style scoped>
.analysis {
  width: 100%;
  height: 100%;
  font-family: "Poppins", sans-serif;
  padding-bottom: 60px;
}

.title {
  font-size: 36px;
  color: #0f172a;
  text-align: center;
}

label {
  font-size: 16px;
  color: #0f172a;
  margin-right: 0px;
}

.filters {
  display: flex;
  gap: 16px;
  padding: 15px 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: fit-content;
  margin: 0 auto;
  backdrop-filter: blur(40px);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.filters::after {
  content: " ";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: #333;
  opacity: 0.2;
  top: 0;
  left: 0;
}

.filters input,
.filters select {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  outline: none;
  background: #ffffff;
  color: #333;
}

.btn-filter {
  background: #43a047;
  border: none;
  outline: none;
}

.btn-filter:hover {
  background: #2e7d32;
  border: none;
  outline: none;
}

.model-dropdown {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid #0f172a;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}


</style>