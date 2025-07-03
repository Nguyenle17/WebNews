<template>
  <div class="profile">
    <form @submit.prevent="updateProfile">
      <h1>Profile</h1>
      <div class="name">
        <div class="input-box">
          <label for="fullname">Full name</label>
          <input type="text" v-model="fullname" :readonly="!isUpdate" />
        </div>
      </div>
      <div class="input-box">
        <label for="email">Email</label>
        <input type="text" v-model="email" readonly />
      </div>
      <div class="input-box">
        <label for="phone">Phone</label>
        <input type="tel" v-model="phone" :readonly="!isUpdate" />
      </div>
      <div class="input-box">
        <label for="address">Address</label>
        <input type="text" v-model="address" :readonly="!isUpdate" />
      </div>
      <div class="input-box" v-if="isUpdate">
        <div class="input-box">
          <label for="password">Password</label>
          <input type="text" v-model="password" :readonly="!isUpdate" />
        </div>

        <div class="input-box">
          <label for="confirmpassword">Confirm Password</label>
          <input type="text" v-model="confirmpassword" :readonly="!isUpdate" />
        </div>

        <label for="avatar">Avatar</label>
        <input
          type="file"
          id="avatar"
          @change="onFileChange"
          accept="image/*"
        />
        <div v-if="avatarPreview">
          <img
            :src="avatarPreview"
            alt="Avatar Preview"
            class="avatar-preview"
          />
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="btn-submit">
        <button class="btn" type="submit" v-if="isUpdate">Update</button>
        <button class="btn" v-if="!isUpdate" @click="changeButon">Edit</button>
      </div>
    </form>

    <div class="interest-tags">
      <h1>Interest</h1>
      <div class="interests">
        <div class="tag" v-for="(interest, index) in interests" :key="index">
          <p>{{ interest.content }}</p>
          <button class="btn-x" @click="removeInterest(index, interest.id)">
            x
          </button>
        </div>
      </div>
      <div class="interest-input">
        <input
          type="text"
          v-model="interestInput"
          @keyup.enter="addInterest"
          placeholder="Add your interest Enter"
        />
        <button class="btn" type="button" @click="addInterest">Add</button>
      </div>
    </div>
  </div>
</template>
  

<script>
import { useAuthStore } from "../../store/auth";
import Api from "../../utils/api";

export default {
  name: "Profile",
  data() {
    return {
      isUpdate: false,
      id: "",
      fullname: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
      errorMessage: "",
      address: "",
      avatar: "",
      avatarFile: null,
      avatarPreview: "",
      interestInput: "",
      interests: [],
    };
  },
  methods: {
    changeButon() {
      this.isUpdate = !this.isUpdate;
    },
    async fetchData() {
      const authStore = useAuthStore();
      this.fullname = authStore.fullname;
      this.email = authStore.email;
      this.phone = authStore.phone;
      this.address = authStore.address;
      const interestsData = await Api.get("/user/interest");
      this.interests = interestsData.data;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatarFile = file;
        this.avatarPreview = URL.createObjectURL(file);
      }
    },
    async updateProfile() {
      if (this.password !== this.confirmpassword) {
        this.errorMessage = "Passwords do not match";
        this.changeButon();
      } else {
        const formData = new FormData();
        formData.append("fullname", this.fullname);
        formData.append("phone", this.phone);
        formData.append("address", this.address);
        if (this.password) {
          formData.append("password", this.password);
        }
        if (this.avatarFile) {
          formData.append("avatar", this.avatarFile);
        }

        const { success, message, user } = await Api.put("/user/update", formData);
        if (success) {
          localStorage.setItem("user", JSON.stringify(user));
          const authStore = useAuthStore();
          authStore.updated();
          window.location.reload();
        } else {
          this.errorMessage = message;
        }
      }
    },
    handleAvatar() {
      if (this.avatar) {
        this.$emit("avatar", this.avatar);
      }
    },
    async addInterest() {
      const input = this.interestInput.trim();
      if (input && !this.interests.includes(input)) {
        const result = await Api.put("/user/interest", { content: input });
        const data = result.data;
        if (result) this.interests.push({ id: data.id, content: data.content });
      }
      this.interestInput = "";
    },
    async removeInterest(index, id) {
      const result = await Api.delete(`/user/remove-interest/${id}`);
      if (result) this.interests.splice(index, 1);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
<style scoped>
.disable {
  display: none;
}

.profile {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.profile form {
  flex: 1 1 400px;
}

.interest-tags {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 300px;
  gap: 20px;
  max-height: 400px;
}

.profile h1 {
  color: #007acc;
  font-size: 40px;
  margin-bottom: 16px;
}

.input-box input,
.input-box textarea {
  width: auto;
}

.input-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.input-box label {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.input-box input {
  font-size: 16px;
  padding: 8px 16px;
  background: none;
  border-radius: 4px;
  outline: none;
  border: 1px solid rgba(128, 128, 128, 0.3);
  box-shadow: 0px 1px 1px rgba(255, 255, 255, 02);
  color: #333333;
  width: auto;
}

.btn-submit {
  display: flex;
  justify-content: end;
}

.btn {
  font-size: 16px;
  background-color: #ff5722;
  padding: 5px 30px;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-x {
  padding: 0;
  margin: 0;
  background: transparent;
  color: #ff0000;
}

.btn:hover {
  background-color: #007acc;
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 6px 6px rgba(0, 128, 255, 0.5);
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 8px;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  margin-top: 10px;
  border-radius: 50%;
  object-fit: cover;
}

.tag {
  background-color: #4a4a4aa8;
  color: #ffffff;
  font-weight: 500;
  padding: 0px 10px;
  border-radius: 15px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.interests {
  display: flex;
  gap: 10px;
  overflow: auto;
  width: 100%;
  flex-wrap: wrap;
}

.interest-input {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.interest-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #333333a4;
  font-size: 16px;
  outline: none;
  border-radius: 4px;
  color: #000;
  background: transparent;
}

@media (max-width: 768px) {
  .profile {
    flex-direction: column;
  }

  .profile form {
    margin-right: 0;
  }

  .btn-submit {
    justify-content: center;
  }
}
</style>