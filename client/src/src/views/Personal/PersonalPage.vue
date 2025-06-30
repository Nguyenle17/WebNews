<template>
  <div class="personal-page">
    <div class="avatar-feature">
      <img v-if="this.avatar" :src="avatar" alt="avatar" />
      <img v-if="!this.avatar" src="../../assets/imgs/boy.png" alt="avatar" />
      <div class="info-base">
        <h1>{{ fullname }}</h1>
      </div>
      <div class="feature">
        <button
          class="feature-btn"
          :class="{ active: activeFeature === 'Profile' }"
          @click="changeFeature('Profile')"
        >
          Profile
        </button>
        <button
          class="feature-btn"
          :class="{ active: activeFeature === 'BookMark' }"
          @click="changeFeature('BookMark')"
        >
          BookMark
        </button>
      </div>
    </div>
    <div class="content">
      <Profile v-if="activeFeature === 'Profile'" @avatar="handleAvatar" />
      <BookMark v-if="activeFeature === 'BookMark'"></BookMark>
    </div>
  </div>
</template>

<script>
import Profile from "./Profile.vue";
import BookMark from "./BookMark.vue";
import { useAuthStore } from "../../store/auth";

export default {
  name: "PersonalPage",
  components: {
    Profile,
    BookMark,
  },
  data() {
    return {
      activeFeature: "Profile",
      fullname: "",
      avatar: null,
    };
  },
  methods: {
    changeFeature(feature) {
      this.activeFeature = feature;
    },
    fetchUsername() {
      const authStore = useAuthStore();
      this.fullname = authStore.fullname;
    },
    handleAvatar(avatar) {
      this.avatar = avatar;
    },
  },
  mounted() {
    this.fetchUsername();
  },
};
</script>

<style scoped>
.personal-page {
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  margin: 2.5rem 5rem;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease;
  display: flex;
  gap: 20px;
  position: relative;
}

.personal-page::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  backdrop-filter: blur(1.5rem);
  opacity: 0.5;
  z-index: -1;
}

.personal-page:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.avatar-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  border-right: 1px solid rgba(54, 54, 54, 0.5);
  padding: 0 1.5rem;
}

.avatar-feature img {
  width: 12.5rem;
  height: 12.5rem;
  border: 0.5rem solid #007acc;
  border-radius: 50%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 128, 255, 0.3);
}

.avatar-feature img:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 15px rgba(0, 128, 255, 0.5);
}

.info-base {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  padding-bottom: 0.25rem;
}

.info-base h1 {
  text-align: center;
  font-size: 1.75rem;
  color: #007acc;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.feature-btn {
  border: none;
  color: #333333;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 0;
  outline: none;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: center;
  background: none;
  box-shadow: 0 0px 0 rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease, color 0.3s ease, width 0.3s ease;
  cursor: pointer;
}

.feature-btn:hover {
  background-color: #007acc;
  width: 115%;
  color: #ff5722;
  transform: scale(1.1);
  box-shadow: 0 6px 6px rgba(0, 128, 255, 0.5);
  backdrop-filter: blur(10px);
}

.active {
  color: #ff5722;
}

.content {
  padding: 2rem 3.5rem;
  display: flex;
  justify-content: start;
  max-width: 100%;
  flex: 1;
}
@media (max-width: 1024px) {
  .personal-page {
    flex-direction: column;
    align-items: center;
    margin: 2rem 1rem;
    padding: 1.5rem;
  }

  .avatar-feature {
    border-right: none;
    border-bottom: 1px solid rgba(54, 54, 54, 0.5);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .avatar-feature img {
    width: 8rem;
    height: 8rem;
  }

  .info-base {
    margin: 0;
    padding: 0;
  }

  .feature {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
  }

  .feature-btn {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .content {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  .avatar-feature {
    flex-direction: column;
    gap: 0.5rem;
  }

  .avatar-feature img {
    width: 6.5rem;
    height: 6.5rem;
  }

  .info-base h1 {
    font-size: 1.5rem;
  }

  .feature-btn {
    font-size: 0.95rem;
    padding: 0.5rem;
  }

  .content {
    padding: 0.5rem;
  }
}
</style>
