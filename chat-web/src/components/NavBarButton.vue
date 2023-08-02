<script setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  getUsername,
  UseYourToken,
  haveOwnOpenAItoken,
  deleteOpenAIToken,
} from "../api/request";
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";

let haveToken = ref(false); // 初始状态下默认没有上传自己的openAI的token
const style = useStyle();
const { fontColor, theme } = storeToRefs(style);
const token = localStorage.getItem("token");
// 获取用户名
const username_res = await getUsername({ token });
const username = username_res.data.username;
const router = useRouter();
// 退出登录
function logout() {
  localStorage.clear();
  router.go(0);
}
const imgUrl =
  import.meta.env.MODE === "development"
    ? ` /api/profile/getimg/${token}`
    : `/profile/getimg/${token}`;

// 改变色调：
function changeColor() {
  style.changefontColor();
}
// 输入个人token
const open = async () => {
  if (!haveToken.value) {
    ElMessageBox.prompt(
      "你可以在此处输入自己openAI账号的token，提升该网站的使用流畅度，同时享受不限次数使用本网站！",
      "输入个人token",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputErrorMessage: "输入有误！",
        lockScroll: false,
      }
    )
      .then(async ({ value }) => {
        // // 发送请求，把用户的个人openAI token存到数据库
        const data = { openAI_token: String(value), token: token };
        const res = await UseYourToken(data);
        ElMessage({
          type: "success",
          message: `${res.data.message}`,
        });
        change();
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "使用个人token流畅度更好哦",
        });
      });
  } else {
    // 调用删除openAI_token接口
    await deleteOpenAIToken(token);
    ElMessage({
      showClose: true,
      message: "你的openAI token已删除！",
      type: "info",
    });
    change();
  }
};
// 判断是否上传了openAI_token
async function change() {
  const res_openAIt = await haveOwnOpenAItoken({ token });
  if (res_openAIt !== "noOpenAI_token") {
    haveToken.value = true;
    localStorage.setItem("haveToken", haveToken.value);
  } else {
    haveToken.value = false;
    localStorage.setItem("haveToken", haveToken.value);
  }
}
change();
</script>

<template>
  <div class="text_box">
    <span class="span_home" @click="$router.push('/')">首页</span>
    <span class="span_2" @click="open">{{
      haveToken ? "删除你的openAI Token" : "使用自己的token"
    }}</span>
    <span class="span_3" @click="$router.push('/gettutorial')">教程</span>
    <span class="span_4" @click="$router.push('/buyvip')">购买次数</span>
    <img
      src="../assets/icon/moon.svg"
      alt=""
      class="icon_moon_sun"
      @click="changeColor"
      v-if="theme === 'blackTheme'"
    />
    <img
      src="../assets/icon/sun.svg"
      alt=""
      class="icon_moon_sun"
      @click="changeColor"
      v-else
    />
    <div class="headImage_box">
      <img
        :src="imgUrl"
        alt=""
        class="headImg"
        @click="$router.push('/profile/edit')"
      />
    </div>
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$router.push('/profile/edit')"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
$font-color: v-bind(fontColor);
.text_box {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-basis: 65vw;
  float: right;
  flex-wrap: wrap;
  gap: 18px;
  margin-right: 10px;
  span:nth-child(-n + 4) {
    color: $font-color;
    font-size: 0.85em;
    height: 20px;
    box-shadow: 0 0 0 0.5px #4ca488;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
    cursor: pointer;
  }
  span:nth-child(1) {
    // 设置0.5px的边框
    box-shadow: 0 0 0 0.5px $font-color;
  }
  span:nth-child(2) {
    color: #63e2b7;
  }
  span:nth-child(3) {
    color: #65accf;
  }
  span:nth-child(4) {
    color: #63e2b7;
  }
  .icon_moon_sun {
    height: 25px;
    width: 25px;
    cursor: pointer;
  }
  .icon_bell {
    height: 23px;
    width: 23px;
    background-color: #666;
    border-radius: 10%;
  }
  .headImage_box {
    height: 28px;
    width: 28px;
  }
  .headImg {
    height: 100%;
    width: auto;
    border-radius: 50%;
    cursor: pointer;
  }
  .myName {
    color: white;
    font-size: 14px;
  }
}

// element-plus下拉框
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  border: none;
}
</style>
