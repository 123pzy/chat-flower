<script setup>
import sprite from "../assets/icon/sprite.svg";
import sprite2 from "../assets/icon/sprite2.svg";
import { useFuncBoard } from "../stores/funcBoard.js";
import { useFuncCate } from "../stores/funcCate";
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { setUsersFuncBoard, deleteUsersFuncBoard } from "../api/request";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const style = useStyle();
const { fontColor, theme } = storeToRefs(style);
const funcBoard = useFuncBoard();
const funcCate = useFuncCate();
const username = localStorage.getItem("username");
const router = useRouter();

// 点击板块跳转chatpage组件
function handleRouterPush(e, route) {
  if (e.target.tagName != "IMG") {
    router.push(route);
  }
}

// element弹出输入框,用于自定义添加funcBoard板块
const open = () => {
  ElMessageBox.prompt(
    `请输入你要chatGPT扮演一个什么样的角色，比如你想让它做你的英语老师，检查你的英文是否包含语法错误，你就可以说:你现在是我的英文老师，检查我发给你的每段英文中是否包含语法错误。关于chatgpt扮演的角色描述的越详细越好~ 
    注意，不要提交不符合社会主义核心价值观的内容！`,
    "自定义chatgpt",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      inputErrorMessage: "输入的不对哦~",
      lockScroll: false,
    }
  )
    .then(({ value }) => {
      if (value) {
        const message = value;
        setTimeout(() => {
          ElMessageBox.prompt("请给你的自定义板块起个名字", "输入板块名", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            inputErrorMessage: "输入的不对哦~",
            lockScroll: false,
          })
            .then(async ({ value }) => {
              if (value) {
                const func = {
                  id:
                    funcBoard.funcBoard[funcBoard.funcBoard.length - 1].id + 1,
                  func: value,
                  icon: "all",
                  label: "自定义",
                  route: `chat_your-maked-${funcBoard.funcBoard.length + 1}`,
                  message: `${message}`,
                };
                funcBoard.funcBoard.push(func);
                // 添加新的funcBoard到数据库
                await setUsersFuncBoard({ func, username });
                ElMessage({
                  type: "success",
                  message: `自定义功能成功，快去试试吧！`,
                });
              }
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "自定义功能很好玩的~再试试吧~",
              });
            });
        }, 500);
        ElMessage({
          type: "success",
          message: `下面输入你自定义板块的名字吧`,
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "自定义功能很好玩的~再试试吧~",
      });
    });
};
// 删除funcBoard
async function deleteFuncBoard(id) {
  ElMessageBox.confirm("确认要删掉该板块吗?", "确认删掉？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "确认要删掉吗？",
    lockScroll: false, // 控制弹出框之后页面不要抖动
  })
    .then(async () => {
      const data = { id, username };
      const res = await deleteUsersFuncBoard(data);
      funcBoard.getFuncBoard(username);
      ElMessage({
        type: "success",
        message: res.data.message,
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
}

onMounted(async () => {
  const username = localStorage.getItem("username");
  funcBoard.getFuncBoard(username);
});
</script>

<template>
  <div id="boardContainer">
    <div
      v-for="board in funcBoard.funcBoard"
      v-show="funcCate.cate === '全部' ? true : board.label === funcCate.cate"
      @click.stop="handleRouterPush($event, board.route)"
      class="board-box"
    >
      <svg class="funcboard_icon">
        <use
          :href="`${fontColor == '#f5f5f5' ? sprite : sprite2}#icon-${
            board.icon
          }`"
          fill="none"
        ></use>
      </svg>
      <img
        src="../assets/icon/deleteBtn_black.svg"
        class="btn-detele"
        @click="deleteFuncBoard(board.id)"
        :id="board.id"
      />
      <div class="func-name">{{ board.func }}</div>
    </div>
    <div @click="open">
      <img
        src="../assets/icon/plus.svg"
        class="addButton"
        v-if="theme == 'blackTheme'"
      />
      <img src="../assets/icon/plus2.svg" class="addButton" v-else />
      <div :style="{ color: theme == 'blackTheme' ? '#63e2b7' : '#65accf' }">
        增加自定义功能
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$font-color: v-bind(fontColor);
#boardContainer {
  // grid布局
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10vw, 150px));
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  > div {
    height: 140px;
    box-shadow: 0 0 0 0.1px $font-color;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    div {
      font-size: 22px;
      padding-bottom: 10px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .addButton {
      margin-top: 10px;
      height: 45px;
    }
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 180px;
    color: $font-color;
  }
}
.board-box {
  position: relative;
}
// hover效果的时候显示删除按钮
.board-box:hover .btn-detele {
  display: block;
}
.funcboard_icon {
  height: 50px;
  width: 48px;
}
.btn-detele {
  display: none;
  height: 25px;
  width: 25px;
  position: absolute;
  background-color: transparent;
  top: 10px;
  right: 10px;
}
</style>
