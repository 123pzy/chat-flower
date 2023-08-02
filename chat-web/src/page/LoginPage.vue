<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useLogin } from "../stores/login";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginAxios, registerAxios } from "../api/request";
import { useStyle } from "../stores/style";
import { storeToRefs } from "pinia";
import { User, Lock } from "@element-plus/icons-vue";

// 字体颜色
const styleStore = useStyle();
const { fontColor } = storeToRefs(styleStore);

// 自定义
const login = useLogin();
const already = ref(false);
const style = ref({
  center: true,
});
const router = useRouter();

// 点击选择登录或注册的span元素之后切换显示:
function changeLogin() {
  already.value = !already.value;
  style.value.center = !style.value.center;
  login.$reset();
}

// 登录:
async function submitLogin() {
  const res = await loginAxios({
    username: login.ruleForm.username,
    password: login.ruleForm.pass,
  });
  if (res.data.code == 1) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    // element-plus的登录结果提示：
    ElMessage({
      showClose: true,
      message: `${res.data.message}` + ",即将跳转网站首页",
      type: "success",
    });
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } else {
    ElMessage({
      showClose: true,
      message: `${res.data.message}`,
      type: "error",
    });
  }
}

const ruleFormRef = ref();
const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please input the age"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("Please input digits"));
    } else {
      if (value < 18) {
        callback(new Error("Age must be greater than 18"));
      } else {
        callback();
      }
    }
  }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码!"));
  } else {
    if (login.ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码!"));
  } else if (value !== login.ruleForm.pass) {
    callback(new Error("两次密码输入不一致!"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  age: [{ validator: checkAge, trigger: "blur" }],
});

// 验证注册时两次输入的密码是否一致,一致的话发送axios请求,注册用户
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 注册:
      if (login.ruleForm.username.trim() == "") {
        ElMessage({
          showClose: true,
          message: "用户名不能为空!",
          type: "error",
        });
      } else if (String(login.ruleForm.username.trim()).length > 6) {
        ElMessage({
          showClose: true,
          message: "用户名为任意字符，且不能超过6位哦！",
          type: "error",
        });
      } else {
        registerAxios({
          username: `${login.ruleForm.username.trim()}`,
          password: `${login.ruleForm.pass.trim()}`,
        }).then((res) => {
          ElMessage({
            showClose: true,
            message: `${res.data.message}`,
            type: `${res.data.code == 1 ? "success" : "error"}`,
          });
          if (res.data.code == 1) {
            already.value = !already.value;
          } else {
            login.$reset();
          }
        });
      }
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置用户名和密码
  login.$reset();
};
</script>

<template>
  <div class="container">
    <h1 class="title">Chat万花筒</h1>
    <img src="../assets/icon/登陆注册页图片.svg" alt="" />
    <!-- 注册 -->
    <div class="register_container" v-if="already">
      <div class="register-text">注册</div>
      <el-form
        ref="ruleFormRef"
        :model="login.ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="login.ruleForm.username"
            maxlength="6"
            :prefix-icon="User"
            placeholder="输入用户名"
            show-word-limit
            type="text"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="login.ruleForm.pass"
            type="password"
            maxlength="20"
            autocomplete="off"
            :prefix-icon="Lock"
            placeholder="输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="login.ruleForm.checkPass"
            type="password"
            autocomplete="off"
            :prefix-icon="Lock"
            placeholder="确认密码"
            @keyup.enter.native="submitForm(ruleFormRef)"
            show-password
          />
        </el-form-item>
        <div class="submit_box">
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(ruleFormRef)"
              :disabled="
                !Boolean(
                  login.ruleForm.username &&
                    login.ruleForm.pass &&
                    login.ruleForm.checkPass
                )
              "
              >提交</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </div>
        <span class="shift-btn" @click="changeLogin"
          >已有账号?点我直接登录</span
        >
      </el-form>
    </div>

    <!-- 登录 -->
    <div class="login_container" v-else>
      <div class="login-text">登录</div>
      <el-form
        ref="ruleFormRef"
        :model="login.ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="login.ruleForm.username"
            maxlength="6"
            :prefix-icon="User"
            placeholder="输入用户名"
            show-word-limit
            type="text"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="login.ruleForm.pass"
            type="password"
            autocomplete="off"
            maxlength="20"
            :prefix-icon="Lock"
            placeholder="输入密码"
            @keyup.enter.native="submitLogin"
            show-password
          />
        </el-form-item>
        <div class="login_box">
          <el-form-item>
            <el-button
              type="primary"
              @click="submitLogin()"
              :plain="true"
              size="large"
              :disabled="
                !Boolean(login.ruleForm.username && login.ruleForm.pass)
              "
              >登录</el-button
            >
          </el-form-item>
        </div>
        <span class="login_text" @click="changeLogin">还没有账号?点我注册</span>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$font-color: v-bind(fontColor);
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;
  img {
    height: 50vh;
    width: 50vw;
  }
  .title {
    position: absolute;
    top: 8vh;
    color: $font-color;
    font-size: 2.8em;
  }
  // 登录注册框
  .register_container,
  .login_container {
    background: #fff;
    height: 320px;
    width: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1vw;
    padding-top: 2vh;
    position: relative;
    .submit_box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .login_box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .shift-btn,
    .login_text {
      display: inline-block;
      width: 100%;
      text-align: center;
      cursor: pointer;
    }
  }
}
.register-text,
.login-text {
  position: absolute;
  top: 3px;
  left: 180px;
  margin-top: 15px;
  transform: translate(-50%);
  color: black;
  font-size: 22px;
  font-weight: 700;
}

// 解决element-plus输入框的闪烁变长问题
:deep(.el-input__wrapper) {
  position: relative;

  .el-input__inner {
    padding-right: 18px;
  }
  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
