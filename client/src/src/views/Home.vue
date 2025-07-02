<template>
  <div class="home">
    <div class="introduction">
      <h1>
        Welcome to our Website
        <br />
        Your ultimate destination for online reading news!
      </h1>
      <button class="cta-button" @click="scrollToNews">Get Started</button>
      <p class="info-text">
        Explore a wide range of news and immerse yourself in the world of
        literature.
      </p>
    </div>

    <h1
      class="title-top-news"
      ref="topNews"
      v-if="authenticate && suggestionNews.length"
    >
      SUGGESTIONS
    </h1>
    <div class="suggestion" v-if="authenticate">
      <div class="news" v-for="n in suggestionNews" :key="n.position">
        <img v-if="n.imageUrl" :src="n.imageUrl" :alt="n.title" />
        <img v-if="!n.imageUrl" src="../assets/imgs/image.png" alt="" />
        <div class="information-news">
          <h2 class="news-title">{{ n.title }}</h2>
          <p class="news-content">{{ n.snippet }}</p>
        </div>
        <div class="source-time">
          <p class="news-source">{{ n.source }}</p>
          <p class="news-time">{{ n.date }}</p>
        </div>
        <a :href="n.link" target="_blank">View detail</a>
      </div>
    </div>

    <h1 class="title-top-news" ref="topNews">NEWS</h1>
    <div class="container-news">
      <div class="filters">
        <input
          type="text"
          v-model="filters.keyword"
          placeholder="Search by keyword"
        />

        <select v-model="filters.region">
          <option value="vn">Vietnam</option>
          <option value="us">USA</option>
          <option value="jp">Japan</option>
          <option value="kr">Korea</option>
        </select>

        <select v-model="filters.lang">
          <option value="vi">Vietnamese</option>
          <option value="en">English</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
        </select>
        <button @click="applyFilters" class="btn-filter">Filter News</button>
      </div>

      <div class="top-news">
        <div class="news" v-for="n in news" :key="n.position">
          <img :src="n.imageUrl || '../assets/imgs/image.png'" :alt="n.title" />
          <div class="information-news">
            <h2 class="news-title">{{ n.title }}</h2>
            <p class="news-content">{{ n.snippet }}</p>
          </div>
          khd
          <div class="source-time">
            <p class="news-source">{{ n.source }}</p>
            <p class="news-time">{{ n.date }}</p>
          </div>
          <a :href="n.link" target="_blank">View detail</a>
        </div>
      </div>

      <div class="pagenation">
        <button class="pre btn-page" @click="page--" :disabled="page <= 1">
          Previous
        </button>
        <input class="page" v-model.number="page" type="number" />
        <button class="next btn-page" @click="page++">Next</button>
      </div>
    </div>
  </div>
</template>


<script>
import Api from "../utils/api";
import { useAuthStore } from "../store/auth";

export default {
  name: "Home",
  data() {
    return {
      authenticate: false,
      interests: [],
      suggestionNews: [],
      page: 1,
      num_news: 16,
      news: [],
      filters: {
        keyword: "tin tức nổi bật",
        region: "vn",
        lang: "vi",
      },
    };
  },
  methods: {
    async fetchData() {
      const authStore = useAuthStore();
      this.authenticate = authStore.isAuthenticated;
      const interestsData = await Api.get("/user/getInterest");
      this.interests = interestsData.data;
      const selected = this.interests;
      if (this.authenticate) {
        const data = {
          q: selected.map((item) => item.content).join(" OR "),
          gl: this.filters.region,
          hl: this.filters.lang,
          num: 20,
          tbs: "qdr:w",
        };
        const response = await Api.post("/news/", data);
        this.suggestionNews = response.news;
      }
    },
    async getNews() {
      const news_start = (this.page - 1) * this.num_news;
      const data = {
        q: this.filters.keyword,
        gl: this.filters.region,
        hl: this.filters.lang,
        num: this.num_news,
        page: this.page - 1,
      };
      const response = await Api.post("/news/", data);
      this.news = response.news;
    },

    async applyFilters() {
      this.page = 1;
      await this.getNews();
      await this.fetchData();
    },

    scrollToNews() {
      this.$refs.topNews.scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    this.getNews();
    this.fetchData();
  },
  watch: {
    page(newPage) {
      this.getNews();
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  padding-bottom: 40px;
}

.introduction {
  height: 500px;
  position: relative;
  transition: background-image 1s ease-in-out;
}

.introduction h1 {
  max-width: 700px;
  color: #180036;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: 1px;
  padding: 60px;
}

.container-news {
  height: auto;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 10px;
  margin: 0 20px;
}

.cta-button {
  margin: 20px 60px 0;
  padding: 15px 30px;
  font-size: 18px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.cta-button:hover {
  background-color: #e55347;
  transform: scale(1.05);
}

.info-text {
  font-size: 16px;
  color: #180036;
  font-style: italic;
  margin: 15px 60px;
}

.title-top-news {
  text-align: center;
  font-size: 36px;
  color: #180036;
  padding-top: 30px;
}

.suggestion {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 36px;
}

.top-news {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 36px;
}

.news {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 450px;
  position: relative;
}

.news:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.information-news {
  display: flex;
  flex-direction: column;
  height: 300px;
  background: #ffffff;
  padding: 0 20px;
  transition: transform 0.4s ease, height 0.4s ease;
}

.news:hover .information-news {
  transform: translateY(-50px);
}

.news:hover img {
  opacity: 0.8;
}

.news img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-bottom: 1px solid #eee;
  transition: opacity 0.4s ease;
}

.news-title {
  font-size: 18px;
  color: #180036;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  padding: 10px 5px 5px;
  margin: 0 0 5px 0;
  max-height: 100px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  padding: 0 5px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.4s ease;
}

.news:hover .news-content {
  max-height: 80px;
  opacity: 1;
  margin-top: 4px;
}

.news-time,
.news-source {
  font-size: 12px;
  color: #777;
  padding: 2px 8px;
  margin: 0;
}

.source-time {
  display: flex;
  margin: 5px;
  position: absolute;
  bottom: 50px;
}

.news a {
  text-align: center;
  background-color: #e55347;
  color: #fff;
  text-decoration: none;
  padding: 10px 0;
  font-size: 18px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: background-color 0.3s ease;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.news a:hover {
  background-color: #ff6347;
}

.pagenation {
  display: flex;
  width: 100%;
  height: auto;
  font-size: 16px;
  color: #333;
  gap: 20px;
  justify-content: center;
}

.btn-page {
  padding: 8px 16px;
  width: 100px;
  background: #003cff;
  border: none;
  transition: background 0.4s ease;
}

.btn-page:hover {
  background: #18008d;
}

.page {
  margin: 0;
  width: 40px;
  padding-left: 20px;
  background: #ffffff;
  outline: none;
  border: none;
  color: hsl(0, 0%, 20%);
  font-size: 16px;
}

.filters {
  display: flex;
  gap: 16px;
  padding: 15px 0;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 0;
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

@media screen and (max-width: 768px) {
  .introduction h1 {
    font-size: 28px;
    padding: 30px 20px;
  }

  .cta-button {
    margin: 20px 20px 0;
    padding: 12px 20px;
    font-size: 16px;
  }

  .info-text {
    margin: 10px 20px;
    font-size: 14px;
  }

  .title-top-news {
    font-size: 28px;
    margin-top: 20px;
  }

  .container-news {
    margin: 0 10px;
    padding: 10px 5px;
  }

  .suggestion,
  .top-news {
    grid-template-columns: repeat(1, 1fr);
    padding: 10px;
    gap: 16px;
  }

  .news {
    height: auto;
  }

  .news img {
    height: 180px;
  }

  .news-title {
    font-size: 16px;
  }

  .news-content {
    font-size: 13px;
  }

  .news a {
    font-size: 16px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .filters input,
  .filters select {
    font-size: 14px;
    width: 100%;
  }

  .btn-filter {
    width: 100%;
    font-size: 14px;
    padding: 10px;
  }

  .pagenation {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding-top: 10px;
  }

  .btn-page {
    width: 100%;
    font-size: 14px;
  }

  .page {
    width: 60px;
    text-align: center;
    padding: 4px;
    font-size: 14px;
  }
}
</style>
