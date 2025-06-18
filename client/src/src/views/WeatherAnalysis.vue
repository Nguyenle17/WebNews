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

    <div class="weather-analysis">
      <div class="location">
        <h2 class="map-title">Choose a location to analyze the weather</h2>
        <GoogleMap v-model="mapFilter" />
      </div>

      <div class="analysis-result">
        <div class="loading" v-if="isLoading">
          <div class="circle"></div>
          <p>Processing</p>
        </div>
        <p class="result-text" v-html="resultText" v-if="!isLoading"></p>
      </div>
    </div>
  </div>
</template>


<script>
import api from "../utils/api";
import GoogleMap from "../components/features/GoogleMap.vue";
import { marked } from "marked";

export default {
  name: "WeatherAnalysis",
  components: {
    GoogleMap,
  },
  data() {
    return {
      isLoading: false,
      resultText:
        " Analysis results will be displayed here based on the selected filters and location.",
      mapFilter: {
        lat: 10.7769,
        lng: 106.7009,
      },
      filters: {
        models: "deepseek-chat-v3-0324",
        lang: "vi",
      },
    };
  },
  methods: {
    async Analysis() {
      this.isLoading = true;
      this.resultText = "Processing...";

      try {
        const info = {
          mapFilter: this.mapFilter,
          models: this.filters.models,
          lang: this.filters.lang,
        };

        const response = await api.post("/weather/analysis", info);
        this.resultText = marked(response.message) || "No result returned.";
      } catch (error) {
        console.error("Error during analysis:", error);
        this.resultText = "An error occurred while analyzing the weather.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    mapFilter: {
      lat(newValue) {
        this.lat = newValue;
      },
      lng(newValue) {
        this.lng = newValue;
      },
    },
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

.location {
  width: auto;
  height: auto;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.map-title {
  text-align: center;
  color: #0f172a;
  margin-bottom: 10px;
  backdrop-filter: blur(20px);
  width: fit-content;
  margin: 10px auto;
  padding: 10px 20px;
  border-radius: 4px;
  overflow: hidden;
}

.analysis-result {
  height: 500px;
  border-radius: 8px;
  backdrop-filter: blur(50px);
  position: relative;
  z-index: 1;
  color: #333;
  padding: 40px;
  overflow: auto;
  flex: 1;
}

.weather-analysis {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 20px;
  height: auto;
  padding: 40px;
}
</style>