<template>
  <div class="add-book">
    <form class="form" @submit.prevent="handleAdd">
      <h1>ADD BOOK</h1>
      <div class="input-form">
        <input
          type="name"
          id="name"
          name="name"
          required
          placeholder=" "
          v-model="name"
        />
        <label for="name">Name</label>
        <img src="../assets/imgs/open-book.png" alt="mail" />
      </div>
      <div class="input-form">
        <input
          type="author"
          id="author"
          name="author"
          required
          placeholder=" "
          v-model="author"
        />
        <label for="author">Author</label>
        <img src="../assets/imgs/writer.png" alt="mail" />
      </div>
      <div class="input-form">
        <input
          type="description"
          id="description"
          name="description"
          required
          placeholder=" "
          v-model="description"
        />
        <label for="">Description</label>
        <img src="../assets/imgs/product-description.png" alt="mail" />
      </div>
      <div class="input-form">
        <input
          type="year"
          id="year"
          name="year"
          required
          placeholder=" "
          v-model="year"
        />
        <label for="year">Year</label>
        <img src="../assets/imgs/calendar.png" alt="mail" />
      </div>
      <div v-if="imagePreview" class="preview">
        <img :src="imagePreview" alt="Preview" />
      </div>
      <div class="input-form">
        <input
          type="file"
          id="img"
          name="imageFile"
          @change="handleFileUpload"
          required
          placeholder=" "
        />
        <label for="img">Image</label>
        <img src="../assets/imgs/image-gallery.png" alt="mail" />
      </div>
      <div class="btn">
        <button type="submit">ADD BOOK</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "../utils/api";

export default {
  name: "AddBook",
  data() {
    return {
      name: "",
      author: "",
      description: "",
      year: "",
      imageFile: "",
      imagePreview: "",
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    async handleAdd() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("author", this.author);
      formData.append("description", this.description);
      formData.append("year", this.year);
      formData.append("imageFile", this.imageFile);

      try {
        const result = await api.post("/book/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (result.status === 200) {
          alert("Book added successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding book:", error);
      }
    },
  },
};
</script>

<style>
.form {
  margin: 20px auto;
  padding: 20px 40px;
  width: fit-content;
  border-radius: 10px;
  background: transparent;
  backdrop-filter: blur(40px);
  border: 2px solid #4c5362;
}
.form h1 {
  color: #12083c;
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
}

.input-form {
  width: 400px;
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


.preview img {
  max-width: 300px;
  height: auto;
  margin-top: 10px;
}
</style>