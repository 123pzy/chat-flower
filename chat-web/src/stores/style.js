import { defineStore } from "pinia";

export const useStyle = defineStore("style", {
  state: () => {
    return {
      fontColor: "#f5f5f5",
      bgColor: "#18181c",
      inputBgColor: "#303033",
      inputFocus: "#202d2c",
      homeBtnBgColor: "#303033",
      homeBtnHover: "#454548",
      theme: "blackTheme",
    };
  },
  actions: {
    changefontColor() {
      if (this.theme == "blackTheme") {
        this.fontColor = "#18181c";
        this.bgColor = "#f5f5f5";
        this.inputBgColor = "#e3e1e1";
        this.inputFocus = "#f5f5f5";
        this.homeBtnBgColor = "#e3e1e1";
        this.homeBtnHover = "#fff";
        this.theme = "whiteTheme";
      } else {
        this.fontColor = "#f5f5f5";
        this.bgColor = "#18181c";
        this.inputBgColor = "#303033";
        this.inputFocus = "#202d2c";
        this.homeBtnBgColor = "#303033";
        this.homeBtnHover = "#454548";
        this.theme = "blackTheme";
      }
    },
  },
});
