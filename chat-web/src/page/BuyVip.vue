<script setup>
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";

const style = useStyle();
const { fontColor, bgColor } = storeToRefs(style);
</script>

<template>
  <div class="container">
    <div class="qrcode">
      <img src="../assets/weixin.jpg" alt="" />
      <hr />
    </div>
    <span class="text"
      >由于项目都是使用本人的个人chatGPT账号调用的API接口，每个用户只匹配了20次免费使用chatGPT的机会。扫二维码加我微信，我给你增加次数~</span
    >
  </div>
</template>

<style lang="scss" scoped>
$font-color: v-bind(fontColor);
$bgColor: v-bind(bgColor);
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 91vh;
  width: 100%;
  background-color: $bgColor;
}
.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bgColor;
  margin-top: 10vh;
  img {
    height: 100%;
    width: 15vw;
    min-width: 150px;
    margin-right: 2vw;
    margin-left: 2vw;
    margin-bottom: 10vh;
  }
}
.text {
  display: inline-block;
  width: 50vw;
  min-width: 300px;
  color: $font-color;
  font-size: 1.3em;
  margin-bottom: 10vh;
  text-indent: 2em; // 首行缩进
}
</style>
