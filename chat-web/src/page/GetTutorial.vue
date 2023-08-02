<script setup>
import { useStyle } from '../stores/style';
import {storeToRefs} from 'pinia'

const style = useStyle()
const {fontColor} = storeToRefs(style)
</script>

<template>
  <div class="container">
    <div class="container_text">
      <p class="text_p">
        你这么聪明肯定不需要教程，不过既然点进来了，就让我我大致讲一下这个网站的用法吧~
      </p>
      <h2 class="text_h2">（假装这里有一段500字的教程~~）</h2>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$font-color: v-bind(fontColor);
.container {
  height: 91%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container_text {
  height: 80vh;
  width: 50vw;
  min-width: 300px;
  // position: absolute;
  box-sizing: border-box;
  padding: 20px;
}
.text_p {
  color: $font-color;
  text-indent: 2em; // 首行缩进
}
.text_h2{
  color: v-bind(fontColor);
  margin-top: 20px;
  text-align: center;
}
</style>
