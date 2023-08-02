import { defineStore } from "pinia";

export const useChat = defineStore("chat", {
  state: () => {
    return {
      say: "",
      messages: [],
      pushed: false,
      htmlBefore: "",
      temperature: 0.8,
    };
  },
  actions: {
    toSay() {
      if (this.say != "" && this.pushed == false) {
        this.messages.push({
          role: "user",
          content: `${this.say}`,
        });
        this.say = "";
        this.pushed = true;
        return this.pushed;
      }
    },
  },
});
