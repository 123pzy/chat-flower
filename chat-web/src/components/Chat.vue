<script setup>
import { ref, nextTick, watch, onMounted } from 'vue';
import { useChat } from '../stores/chat';

const chat = useChat();
// css样式
const styleGitHubCss = ref('markdown-body');
const token = localStorage.getItem('token');
// 用户头像链接
const imgUrl =
  import.meta.env.MODE === 'development'
    ? ` /api/profile/getimg/${token}`
    : `/profile/getimg/${token}`;

const props = defineProps(['chatContext']);
// 实现打字回复效果的动态位置调整
await nextTick();
watch(
  () => chat.htmlBefore,
  () => {
    if (
      props.chatContext.scrollTop + props.chatContext.clientHeight >=
      props.chatContext.scrollHeight - 100
    ) {
      props.chatContext.scrollTo({
        top: props.chatContext.scrollHeight,
        behavior: 'smooth',
      });
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => chat.messages.length,
  () => {
    props.chatContext.scrollTo({
      top: props.chatContext.scrollHeight,
      behavior: 'smooth',
    });
  }
);
// onMounted(() => {
//   const link = document.createElement('link');
//   link.type = 'text/css';
//   link.rel = 'stylesheet';
//   link.href =
//     'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css';
//   document.head.appendChild(link);
// });
</script>

<template>
  <div
    class="chat_container"
    v-for="(msg, index) in chat.messages"
    :key="index"
  >
    <div class="answer_container" v-if="msg.role == 'assistant'">
      <img src="../assets/chatPGT.jpg" />
      <span class="answer_content" v-html="msg.content" :class="styleGitHubCss">
      </span>
    </div>
    <div class="say_container" v-if="msg.role == 'user'">
      <span class="say_content"> {{ msg.content }} </span>
      <img
        :src="imgUrl"
        @click="$router.push('/profile/edit')"
        style="cursor: pointer"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$contentMarginTop: 25px;
.say_container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 40px;
  height: auto;
  max-width: 800px;
  padding-left: 50%;
  padding-top: $contentMarginTop;
  position: relative;
  .say_content {
    display: flex;
    align-items: center;
    height: 80%;
    background-color: #dfe4ea;
    // 设置自动换行：
    word-wrap: break-word;
    word-break: break-all;
    min-height: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    border-radius: 3px;
  }
  .say_content::after {
    content: '';
    // css绘制三角形：
    border-top: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #dfe4ea;
    position: relative;
    // 控制伪元素的位置：
    left: 19px;
    top: 0px;
  }
  img {
    height: 100%;
    width: 40px;
    margin-left: 15px;
  }
  .time_bar {
    color: #dcdde1;
    position: absolute;
    top: 15px;
    font-size: 12px;
  }
}

// answer:
.answer_container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 40px;
  height: auto;
  max-width: 800px;
  padding-right: 100px;
  padding-top: $contentMarginTop;
  .answer_content {
    height: 100%;
    background-color: #dfe4ea;
    // padding: 10px;
    // 设置自动换行：
    word-wrap: break-word;
    word-break: break-all;
    min-height: 40px;
    padding-top: 0px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 3px;
  }
  .answer_content::before {
    content: '';
    // css绘制三角形：
    border-top: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #dfe4ea;
    position: relative;
    // 控制伪元素的位置：
    left: -28px;
    top: 5px;
  }
  img {
    height: 100%;
    width: 40px;
    margin-right: 15px;
  }
}
</style>
