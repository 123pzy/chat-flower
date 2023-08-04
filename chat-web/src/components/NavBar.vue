<script setup>
import NavBarButton from "../components/NavBarButton.vue";
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";

const style = useStyle();
const { bgColor, fontColor } = storeToRefs(style);
</script>

<template>
  <div id="nav">
    <div class="icon_box">
      <!-- logo图 -->
      <img
        src="../assets/icon/logo.svg"
        alt=""
        class="icon_cat"
        @click="$router.push('/')"
      />
      <h1 class="title" @click="$router.push('/')">Chat万花筒</h1>
    </div>
    <Suspense><NavBarButton></NavBarButton></Suspense>
  </div>
</template>

<style lang="scss" scoped>
$font-color: v-bind(fontColor);
$bgColor: v-bind(bgColor);
#nav {
  display: flex;
  justify-content: space-between;
  height: 9vh;
  width: 100%;
  min-height: 80px;
  box-shadow: 0 0 0 0.4px #57606f;
  background-color: $bgColor;
}
.icon_box {
  display: flex;
  align-items: center;
  flex-basis: 30vw;
  justify-content: flex-start;
  padding-left: 1vw;
  .title {
    color: $font-color;
    font-size: 1.8vw;
    margin-left: 0.6vw;
  }
}
.icon_cat {
  height: 4vw;
  width: 4vw;
  min-width: 40px;
  min-height: 40px;
  max-width: 80px;
}
</style>
