import { defineStore } from "pinia";
import { getUsersFuncBoard } from "../api/request";

export const useFuncBoard = defineStore("funcBoard", {
  state: () => {
    return {
      funcBoard: [],
      funcBoardCurrent: [],
    };
  },
  actions: {
    async getFuncBoard(username) {
      const res = await getUsersFuncBoard(username);
      this.funcBoard = JSON.parse(res.data.funcBoard);
    },
  },
});
