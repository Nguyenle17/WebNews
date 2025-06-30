<template>
  <div class="login-register">
    <!-- Form Login -->
    <form v-if="!isRegister" class="form" @submit.prevent="handleLogin">
      <h1>Login</h1>
      <div class="input-form">
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder=" "
          v-model="email"
        />
        <label for="email">Email</label>
        <img src="../assets/imgs/mail.png" alt="mail" />
      </div>
      <div class="input-form">
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder=" "
          v-model="password"
        />
        <label for="password">Password</label>
        <img src="../assets/imgs/key.png" alt="key" />
      </div>
      <div class="remember">
        <input type="checkbox" v-model="rememberMe" />
        <label for="remember"> Remember Me </label>
      </div>
      <div class="btn">
        <button type="submit">
          Login <img src="../assets/imgs/login.png" alt="login" />
        </button>
        <button>Login with Google</button>
        <a class="change" @click="handleChange"
          >You don't already have an account? Register?</a
        >
      </div>
      <p class="error">{{ this.error }}</p>
    </form>

    <!-- Form Register -->
    <form v-if="isRegister" class="form" @submit.prevent="handleRegister">
      <h1>Register</h1>
      <div class="input-form">
        <input
          type="text"
          id="name"
          name="full_name"
          required
          placeholder=" "
          v-model="fullName"
        />
        <label for="full_name">Full Name</label>
        <img src="../assets/imgs/user.png" alt="user" />
      </div>
      <div class="input-form">
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder=" "
          v-model="email"
        />
        <label for="email">Email</label>
        <img src="../assets/imgs/mail.png" alt="mail" />
      </div>

      <div class="group-input">
        <div class="input-form">
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder=" "
            v-model="phone"
          />
          <label for="phone">Phone</label>
          <img src="../assets/imgs/phone-call.png" alt="phone" />
        </div>
        <div class="input-form">
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder=" "
            v-model="password"
          />
          <label for="password">Password</label>
          <img src="../assets/imgs/key.png" alt="key" />
        </div>
      </div>

      <div class="input-form">
        <input
          type="text"
          id="address"
          name="address"
          required
          placeholder=" "
          v-model="address"
        />
        <label for="address">Address</label>
        <img src="../assets/imgs/location.png" alt="location" />
      </div>

      <!-- <div class="input-form">
        <input
          type="file"
          id="avatar"
          name="avatar"
          @change="handleFileUpload"
        />
        <label fo="avatar">Avatar</label>
      </div> -->

      <div class="btn">
        <button type="submit">
          Register <img src="../assets/imgs/login.png" alt="login" />
        </button>
        <a @click="handleChange">Already have an account? Login?</a>
        <p class="error">{{ this.error }}</p>
      </div>
    </form>
  </div>
</template>
  

<script>
import Api from "../utils/api";

export default {
  name: "LoginRegister",
  data() {
    return {
      isRegister: false,
      error: "",

      email: "",
      password: "",
      fullName: "",
      phone: "",
      address: "",
      avatar: null,
      rememberMe: false,
    };
  },
  methods: {
    handleChange() {
      this.isRegister = !this.isRegister;
      this.email = "";
      this.password = "";
    },
    async handleLogin() {
      const data = new FormData();
      data.append("email", this.email);
      data.append("password", this.password);
      const result = await Api.post("/user/auth/login", data);
      if (result.status === "success") {
        const data = await Api.get("/user/info");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        window.location.href = "/";
      } else {
        this.error = result.message;
      }
    },
    async handleRegister() {
      const data = new FormData();
      data.append("email", this.email);
      data.append("password", this.password);
      data.append("fullname", this.fullName);
      data.append("phone", this.phone);
      data.append("address", this.address);
      data.append("role", "user");
      data.append("avatar", null);

      const result = await Api.post("/user/auth/register", data);
      if (result.status === "success") {
        window.location.href = "/";
      } else {
        this.error = result.message;
      }
    },
  },
};
</script>

<style scoped>
.form {
  margin: 20px auto;
  padding: 20px 40px;
  width: fit-content;
  border-radius: 10px;
  background-color: #ffffff;
  backdrop-filter: blur(40px);
  border: 2px solid #4c5362;
  animation: rotateY180 1s ease forwards;
  transform-style: preserve-3d;
}
.form h1 {
  color: #12083c;
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
}

.input-form {
  width: auto;
  border: 1px solid #12083c;
  padding: 15px 30px;
  border-radius: 30px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.input-form input {
  width: 100%;
  height: 100%;
  font-size: 1rem;
  padding-right: 1.75rem;
  border: none;
  outline: none;
  color: #12083c;
  background-color: transparent;
}

.input-form label {
  color: #12083c;
  font-size: 16px;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease, font-size 0.3s ease;
  pointer-events: none;
}

.input-form input:focus + label,
.input-form input:not(:placeholder-shown) + label {
  transform: translateY(-150%) !important;
  font-size: 14px !important;
  background: #ffffff;
  padding: 0 3px;
}

.input-form img {
  height: 18px;
  width: auto;
  margin: 0;
}

.remember {
  color: #12083c;
  font-weight: 300;
}

.btn {
  display: flex;
  flex-direction: column;
  margin: 30px 0 20px 0;
  gap: 5px;
}

.btn button {
  border-radius: 30px;
  background-color: #0d1936;
  font-size: 18px;
  padding: 10px 0;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  gap: 10px;
}

.btn button:hover {
  transform: scale(1.05);
}

.btn a {
  color: #12083c;
}

.btn img {
  height: 18px;
  width: auto;
  transition: transform 0.3s ease;
}

.btn button:hover img {
  transform: translateX(5px);
}

/* REGISTER */
.group-input {
  display: flex;
  gap: 10px;
}

.error {
  color: #ff0000;
  font-style: italic;
}

@keyframes rotateY180 {
  0% {
    transform: rotateY(0deg);
  }

  50% {
    transform: rotateY(90deg);
  }

  100% {
    transform: rotateY(0deg);
  }
}
</style>