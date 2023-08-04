import { defineStore } from "pinia";

export const useProfile = defineStore("profile", {
  state: () => {
    return {
      remainTimes: "",
      res: "",
    };
  }
});
