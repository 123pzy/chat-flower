import { defineStore } from "pinia";

export const useLogin = defineStore("login", {
  state: () => {
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        username: "",
      },
      isLogin: "",
      token: localStorage.getItem("token"),
    };
  },
});
