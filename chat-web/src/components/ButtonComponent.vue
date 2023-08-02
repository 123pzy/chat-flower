<script setup>
import { ref, watch } from "vue";
import { useChat } from "../stores/chat";
import button from "../assets/icon/button.svg";

const chat = useChat();
const btnStyle = ref({
  btn_focus: false,
  btn_no_focus: false,
});

// 监听input框里有没有值，给button添加动画效果
watch(
  () => chat.say,
  (newval) => {
    if (newval != "") {
      btnStyle.value["btn_focus"] = true;
      btnStyle.value["btn_no_focus"] = false;
    } else {
      btnStyle.value["btn_focus"] = false;
      btnStyle.value["btn_no_focus"] = true;
    }
  }
);
</script>

<template>
  <button :class="btnStyle">
    <img src="../assets/icon/button.svg" alt="" class="icon-button" />
  </button>
</template>

<style scoped>
button {
  background-color: #306052;
  height: 35px;
  width: 100px;
  margin-left: 20px;
  border: none;
  border-radius: 4px;
}
.icon-button {
  height: 20px;
  width: 20px;
}
.btn_focus {
  animation: shiftColorfocus1 0.5s;
  background-color: #63e2b7;
}
.btn_no_focus {
  animation: shiftColorfocus2 0.5s;
}
@keyframes shiftColorfocus1 {
  0% {
    background-color: #306052;
  }
  100% {
    background-color: #63e2b7;
  }
}

@keyframes shiftColorfocus2 {
  0% {
    background-color: #63e2b7;
  }
  100% {
    background-color: #306052;
  }
}
</style>
