<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChat } from '../stores/chat';
import { useFuncBoard } from '../stores/funcBoard';
import InputComponent from '../components/InputComponent.vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import Chat from '../components/Chat.vue';
import { ElMessage } from 'element-plus';
import {
  deleteRemainTimes,
  getUsername,
  chatEventSource,
  haveOwnOpenAItoken,
  sendMessageArray,
  getUsersFuncBoard,
} from '../api/request';
import { marked } from 'marked';
import { useStyle } from '../stores/style';
import { storeToRefs } from 'pinia';
// 按需引入图标
import { Switch } from '@element-plus/icons-vue';

const chatContext = ref(null);
// pinia
const route = useRoute();
const chat = useChat();
let eventSource;
const { temperature } = storeToRefs(chat);
const funcBoard = useFuncBoard();
const style = useStyle();
var { fontColor } = storeToRefs(style);
const router = useRouter();
// 获取用户名
const token = localStorage.getItem('token');
if (!!token) {
  var username_res = await getUsername({ token });
  var username = username_res.data.username;
}

// 定义html
async function sendQuestion() {
  if (chat.toSay()) {
    chat.htmlBefore = '';
    const haveToken = localStorage.getItem('haveToken') == 'true';
    if (!haveToken) {
      // chatGPT免费使用次数减一
      const remainTimesRes = await deleteRemainTimes(username);
      // 判断是否还有使用次数
      if (remainTimesRes.data.remainTimes >= 0) {
        // 发送SSE请求,重点！
        // 发送请求，只传递messageArr
        let data = {
          temperature: temperature.value,
          message: JSON.stringify(chat.messages),
        };
        await sendMessageArray(data);
        sendEventSource();
      } else {
        ElMessage({
          showClose: true,
          message: `${remainTimesRes.data.message}`,
          type: 'error',
        });
      }
    } else {
      const tokenObj = { token: token };
      const res_openAItoken = await haveOwnOpenAItoken(tokenObj);
      // 发送请求，传递openAI_token和messageArr
      let data = {
        openAI_token: res_openAItoken,
        temperature: temperature.value,
        message: JSON.stringify(chat.messages),
      };
      await sendMessageArray(data);
      sendEventSource();
    }
  }
}
// 发送eventSource请求
function sendEventSource() {
  eventSource = chatEventSource();
  chat.messages.push({
    role: 'assistant',
    content: '',
  });
  eventSource.onmessage = (event) => {
    if (!event.data.includes('[DONE]')) {
      chat.htmlBefore += JSON.parse(event.data).choices[0].delta.content;
      marked.setOptions({ mangle: false, headerIds: false }); // 消除警告
      chat.messages[chat.messages.length - 1].content = marked.parse(
        chat.htmlBefore
      );
    } else if (event.data.includes('[DONE]')) {
      eventSource.close();
      chat.pushed = false;
    }
  };
  eventSource.onerror = (error) => {
    console.error('流式传输发生错误：', error);
    ElMessage({
      showClose: true,
      message: '你给的token似乎不太对哦',
      type: 'error',
    });
  };
}

// 点击侧边栏按钮跳转chat界面
async function handleRouterPush(route) {
  if (eventSource) {
    eventSource.close();
  }
  await router.push(route);
  await reGetFuncBoard();
}

// 重新获取funcBoard
async function reGetFuncBoard() {
  const res = await getUsersFuncBoard(username);
  funcBoard.funcBoard = JSON.parse(res.data.funcBoard);
  funcBoard.funcBoardCurrent = funcBoard.funcBoard.find((item) => {
    return item.route == route.params.route;
  });
  const system_message = {
    role: 'system',
    content: funcBoard.funcBoardCurrent.message,
  };
  chat.messages.push(system_message);
}

onMounted(async () => {
  reGetFuncBoard();
});
</script>

<template>
  <div class="chat_container">
    <aside class="chat_history">
      <div class="func-btn-title">
        <Switch style="height: 15px; margin-right: 5px" />切换模块
      </div>
      <div class="chat_every_history">
        <div
          v-for="board in funcBoard.funcBoard"
          class="func-btn"
          @click="handleRouterPush(board.route)"
        >
          {{ board.func }}
        </div>
      </div>
    </aside>
    <div class="chat_content">
      <div class="chat_context" ref="chatContext">
        <Suspense><Chat :chatContext="chatContext"></Chat></Suspense>
      </div>
      <div class="chat_question_box">
        <!-- 用法提示 -->
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="'值越大回复结果越随意（创造性）,当前值为：' + temperature"
          placement="top"
        >
          <!-- 温度计 -->
          <div class="slider-demo-block">
            <el-slider
              v-model="temperature"
              vertical
              :show-tooltip="false"
              height="45px"
              :step="0.1"
              :max="1.6"
              :min="0.2"
            />
          </div>
        </el-tooltip>

        <InputComponent
          :height="35"
          :width="60"
          @keydown.enter.native="sendQuestion"
          :placeholder="funcBoard.funcBoardCurrent.placeholder || '请输入...'"
        ></InputComponent>
        <ButtonComponent @click.native="sendQuestion" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$font-color: v-bind(fontColor);
.chat_container {
  display: flex;
  height: 88.5vh;
  width: 100%;
  box-sizing: border-box;

  .chat_history {
    flex: 1;
    border-right: 2px solid #666;
    overflow: auto; // 添加滚动条
    .func-btn-title {
      color: #999;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-weight: 600;
    }
    .chat_every_history {
      padding-left: 8px;
      padding-right: 8px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(6vw, 1fr));
      gap: 0.8rem;
      text-align: center;
      .func-btn {
        color: #999;
        font-size: 14px;
        height: 35px;
        box-shadow: 0 0 0 0.5px #4ca488;
        line-height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        cursor: pointer;
      }
    }
  }
  .chat_content {
    flex: 4;
    display: grid;
    grid-template-rows: 1fr 70px;
    .chat_context {
      margin-top: 3vh;
      width: 95%;
      margin-left: 2.5%;
      overflow: auto; // 添加滚动条
      padding-bottom: 10px;
      border-bottom: 1px solid #353535;
    }
    // 隐藏滚动条
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    ::-webkit-scrollbar-thumb {
      display: none; /* Chrome Safari */
    }

    .chat_question_box {
      align-self: flex-end;
      flex-basis: 60vw;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      margin-bottom: 15px;
      .slider-demo-block {
        display: flex;
        align-items: center;
        margin-right: 5px;
      }
      .slider-demo-block .el-slider {
        margin-top: 0;
        margin-left: 12px;
      }
    }
  }
}
</style>
