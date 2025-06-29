<template>
  <div class="layout">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from "../components/common/Header.vue";

export default {
  name: "Layout",
  components: {
    Header,
  },
};
</script>

<style>
.layout {
    height: 100%;
    width: 100%;
    box-sizing: border-box;

}
</style>