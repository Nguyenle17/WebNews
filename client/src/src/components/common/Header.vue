<template>
  <header>
    <img src="../../../public/vite.svg" alt="logo" />

    <div class="link-page">
      <router-link to="/">HOME</router-link>
      <router-link to="/summary-news" v-if="!isAdmin">SMART NEWS</router-link>
      <router-link to="/summary-content" v-if="!isAdmin"
        >SMART RECAP</router-link
      >
      <router-link to="/weather-analysis" v-if="!isAdmin"
        >WEATHER ANALYSIS</router-link
      >
      <router-link to="/foodball-analysis" v-if="!isAdmin"
        >FOOTBALL ANALYSIS</router-link
      >
      <router-link to="/login" v-if="!isAuthenticated">LOGIN</router-link>
      <router-link to="/account" v-if="isAuthenticated & !isAdmin">
        <img src="../../assets/imgs/user.png" alt="icon" />
        ACCOUNT
      </router-link>
      <router-link to="/admin/add-book" v-if="isAdmin">ADD BOOK</router-link>
      <router-link to="/admin/update-delete" v-if="isAdmin">
        UPDATE OR DELETE BOOK</router-link
      >
      <a @click="handleLogout" v-if="isAuthenticated">LOGOUT</a>
    </div>

    <!-- <div class="search">
      <button class="btn-search">
        <img src="../../assets/imgs/magnifying-glass.png" alt="icon" />
      </button>
      <input type="text" placeholder="Search..." />
    </div> -->
  </header>
</template>

<script>
import { useAuthStore } from "../../store/auth";
import { computed } from "vue";

export default {
  name: "Header",
  methods: {
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.reload();
    },
  },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    return {
      isAuthenticated,
      isAdmin,
    };
  },
};
</script>

<style>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px 0px;
  width: calc(100%);
  backdrop-filter: blur(20px);
  position: relative;
  top: 0;
}

header::after {
  content: "";
  top: 0;
  left: 0;
  width: calc(100%);
  height: 100%;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.5;
  position: absolute;
}

.link-page {
  display: flex;
  gap: 50px;
  background-color: #fff;
  padding: 20px 60px;
  border: none;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.link-page a {
  text-decoration: none;
  color: #121212;
  font-weight: 200;
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease;
}

.link-page a:hover {
  color: #ff5733;
  transform: scale(1.1);
}

.link-page a::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  background-color: #ff5733;
  bottom: -5px;
  left: 0;
  transition: width 0.3s ease;
}

.link-page a:hover::after {
  width: 100%;
}

.btn-search {
  outline: none;
  border: none;
  height: fit-content;
  width: fit-content;
  position: absolute;
  background: none;
  padding: 0;
}

.search {
  position: relative;
  overflow: hidden;
}

.search img {
  height: 38px;
  width: auto;
  padding: 5px 8px;
  backdrop-filter: blur(20px);
  background-color: #d3d3d3;
  border-radius: 15px 0 0 15px;
  top: 0px;
}

.search input {
  font-size: 16px;
  padding: 14px 60px;
  border-radius: 15px;
  color: #121212;
  background-color: #fff;
  outline: none;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

a img {
  height: 16px;
  width: auto;
}

@media screen and (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 20px;
    width: 100%;
  }

  header::after {
  content: "";
  top: 0;
  left: 0;
  width: calc(100%);
  height: 100%;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.5;
  position: absolute;
}


  .link-page {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 0;
    width: 100%;
    padding: 20px;
    border-radius: 20px;
  }

  .search {
    width: 100%;
  }

  .search input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    font-size: 15px;
  }

  .search img {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .btn-search {
    left: 0;
  }

  .link-page a {
    font-size: 16px;
  }
}
</style>