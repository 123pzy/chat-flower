import { defineStore } from "pinia";
import axios from "axios";

export const useProfile = defineStore("profile", {
  state: () => {
    return {
      remainTimes: "",
      res: "",
    };
  }
});
