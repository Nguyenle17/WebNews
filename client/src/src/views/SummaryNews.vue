<template>
  <div class="summary-news">
    <h1 class="title">AI News Summary Center</h1>

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

      <input type="text" v-model="filters.keyword" placeholder="Search by keyword" />
      <button @click="filtersAndSearch" class="btn-filter">Search & Summarize</button>
    </div>

    <div class="description">
      <p class="news" v-if="news.length">
        Summary of <span>{{ temp }}</span> from {{ news.length }} recent news articles.
      </p>

      <div class="source" v-if="news.length">
        <p>Sources:</p>
        <a v-for="n in news" :key="n.position" :href="n.link" target="_blank" rel="noopener">
          {{ n.source }}
        </a>
      </div>

      <p class="content" v-html="summaryNews"></p>

      <div class="loading" v-if="isLoading">
        <div class="circle"></div>
        <p>Processing</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";
import { marked } from "marked";

export default {
  name: "SummaryNews",
  data() {
    return {
      summaryNews:
        "Summarize information from links, keywords, or text you provide using AI.",
      temp: "",
      isLoading: false,
      news: [],
      filters: {
        models: "deepseek-chat-v3-0324",
        keyword: "",
        region: "vn",
        lang: "vi",
      },
    };
  },
  methods: {
    async filtersAndSearch() {
      this.summaryNews = "";
      this.isLoading = true;
      this.news = [];

      const requestData = {
        data: {
          q: this.filters.keyword,
          gl: this.filters.region,
          hl: this.filters.lang,
          num: 5,
          tbs: "qdr:d",
        },
        models: {
          models: this.filters.models,
        },
      };

      try {
        const response = await api.post("/news/summary-news", requestData);
        this.summaryNews = marked(response.message.content || "No result returned.");
        this.news = response.news;
        this.temp = this.filters.keyword || "the latest news";
      } catch (err) {
        this.summaryNews = "An error occurred while summarizing news.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.summary-news {
  padding: 0 40px;
}

.title {
  font-size: 36px;
  color: #0f172a;
  text-align: center;
}

label {
  font-size: 16px;
  color: #0f172a;
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
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-filter:hover {
  background: #2e7d32;
}

.description {
  margin-top: 20px;
  color: #0f172a;
  font-size: 1.1rem;
  min-height: 200px;
  padding: 20px 40px;
  border-radius: 8px;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
  overflow: hidden;
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
  margin-top: 20px;
}

.news {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ff6347;
  margin-bottom: 10px;
}

.news span {
  font-weight: bold;
  color: #2e7d32;
  margin: 0 5px;
}

.content {
  margin-top: 10px;
  font-size: 16px;
  color: #0f172a;
  line-height: 1.6;
}

.source {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 18px;
  margin-bottom: 15px;
}

.source p {
  margin: 0;
  width: 100%;
  color: #43a047;
}

.source a {
  text-decoration: none;
  color: #003cff;
  transition: color 0.3s;
}

.source a:hover {
  color: #18008d;
}
</style>
