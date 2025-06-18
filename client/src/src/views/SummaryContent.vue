<template>
  <div class="summary-content">
    <h1 class="title">AI Content Summary</h1>

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

      <label for="region-select">Region</label>
      <select id="region-select" v-model="filters.region">
        <option value="vn">Vietnam</option>
        <option value="us">USA</option>
        <option value="jp">Japan</option>
        <option value="kr">Korea</option>
      </select>

      <label for="lang-select">Language</label>
      <select id="lang-select" v-model="filters.lang">
        <option value="vi">Vietnamese</option>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      </select>
      <button @click="filtersAndSearch" class="btn-filter">Summary</button>
    </div>

    <div class="summary">
      <div class="description">
        <h2>Content</h2>
        <textarea
          v-model="filters.content"
          placeholder="Input your content, and I will summarize it for you."
          rows="5"
        ></textarea>
        <div class="loading" v-if="isLoading">
          <div class="circle"></div>
          <p>Processing</p>
        </div>
        <h2 v-if="summarycontent.length">Smart Summarize</h2>
        <p class="response" v-if="summarycontent.length" v-html="summarycontent">
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import { marked } from "marked";
import api from "../utils/api";

export default {
  name: "Summarycontent",
  data() {
    return {
      isLoading: false,
      summarycontent: "",
      filters: {
        models: "deepseek-chat-v3-0324",
        content: "",
        region: "vn",
        lang: "vi",
      },
    };
  },
  methods: {
    async filtersAndSearch() {
      try {
        this.summarycontent = "";
        this.isLoading = true;
        this.content = [];
        const infor = {
          data: {
            content: this.filters.content,
            hl: this.filters.lang,
          },
          models: {
            models: this.filters.models,
          },
        };
        const response = await api.post("/summary/", infor);
        this.summarycontent = marked(
          response.message.content || "No result returned."
        );
      } catch {
        this.summaryNews = "An error occurred while summarizing";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    filters: {
      content(newValue) {
        if (newValue.content.trim() === "") {
          this.summarycontent = "";
        }
      },
    },
  },
};
</script>

<style scoped>
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

.description {
  margin-top: 0.5rem;
  color: #0f172a;
  font-size: 1.1rem;
  min-height: 200px;
  padding: 20px 40px;
  margin: 20px 40px;
  border-radius: 8px;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.description::after {
  content: " ";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: #ffffff;
  opacity: 0.4;
  top: 0;
  left: 0;
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

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.summary-content textarea {
  width: 100%;
  height: auto;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  outline: none;
  min-height: 250px;
  resize: vertical;
}

.response {
  width: 100%;
  height: auto;
  color: #0f172a;
  font-size: 1.1rem;
  padding: 20px;
  margin-top: 0;
  background-color: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-content {
  height: auto;
  padding-bottom: 40px;
}

.description h2 {
  font-size: 24px;
  color: #0f172a;
  margin: 10px 0 0 0;
  padding: 0;
}
</style>