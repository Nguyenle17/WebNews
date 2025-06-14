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

      <input
        type="text"
        v-model="filters.keyword"
        placeholder="Search by keyword"
      />
      <button @click="filtersAndSearch" class="btn-filter">
        Search & Summarize
      </button>
    </div>

    <div class="summary-news">
      <div class="description">
        <p class="news" v-if="news.length">
          Summary of <span>{{ this.temp }}</span> from {{ news.length }} recent
          news articles.
        </p>
        <div class="source" v-if="news.length">
          <p>Sources:</p>
          <a v-for="n in news" :key="n.position" :href="n.link">{{ n.source }}</a>
        </div>
        <p class="content">{{ summaryNews }}</p>
        <div class="loading" v-if="isLoading">
          <div class="circle"></div>
          <p>Processing</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api from "../utils/api";

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
      const infor = {
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
      const response = await api.post("/news/summary-news", infor);
      this.isLoading = false;
      this.summaryNews = response.message.content;
      this.news = response.news;
      this.temp = this.filters.keyword
        ? this.filters.keyword
        : "the latest news";
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

.news {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ff6347;
  margin-bottom: 10px;
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
  color: #43a047;
  font-size: 18px;
  margin: 0;
}

.source p {
  margin: 0 0 10px 0;
}

.source a {
  text-decoration: none;
  color: #003cff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.source a:hover {
  color: #18008d;
}

.news span {
  font-weight: bold;
  color: #2e7d32;
  margin: 0 5px;
}
</style>