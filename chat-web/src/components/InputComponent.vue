<script setup>
import { useChat } from "../stores/chat";
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";

const style = useStyle();
const { inputBgColor, inputFocus, fontColor } = storeToRefs(style);
const props = defineProps(["height", "width", "placeholder", "modelValue"]);
const chat = useChat();
</script>

<template>
  <input
    type="text"
    class="input"
    v-model="chat.say"
    :placeholder="props.placeholder || '请输入...'"
  />
</template>

<style scoped>
.input {
  height: v-bind(height + "px");
  width: v-bind(width + "vw");
  color: v-bind(fontColor); /*设置输入的文字的颜色 */
  caret-color: #4ca488; /* 设置光标的颜色 */
  text-indent: 10px; /* 设置光标距离左边框的长度 */
  background-color: v-bind(inputBgColor);
  border: 1px solid v-bind(inputBgColor);
  box-sizing: border-box; /* 设置padding不撑大总体大小 */
  border-radius: 2px;
  z-index: 10;
}
.input::placeholder {
  /* 设置placeholder的效果 */
  font-size: 14px;
  /* 缩进10px */
  text-indent: 10px;
  padding-left: 3px;
}
.input:focus,
.input:hover {
  /* 去掉鼠标选中时候的边框 */
  outline: none;
  border: 1.5px solid #4ca488;
}
.input:focus {
  background-color: v-bind(inputFocus);
}
</style>
