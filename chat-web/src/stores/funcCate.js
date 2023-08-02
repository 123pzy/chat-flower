import { defineStore } from "pinia";

export const useFuncCate = defineStore("funcCate", {
  state: () => ({
    funcCate: [
      {
        id: 1,
        label: "全部",
        category: 0,
      },
      {
        id: 2,
        label: "职业",
        category: 0,
      },
      {
        id: 3,
        label: "论文",
        category: 0,
      },
      {
        id: 4,
        label: "编程",
        category: 0,
      },
      {
        id: 5,
        label: "文案",
        category: 0,
      },
      {
        id: 6,
        label: "写作",
        category: 0,
      },
      {
        id: 7,
        label: "企业",
        category: 0,
      },
      {
        id: 8,
        label: "情感",
        category: 0,
      },
      {
        id: 9,
        label: "故事",
        category: 0,
      },
      {
        id: 10,
        label: "翻译",
        category: 0,
      },
      {
        id: 11,
        label: "教育",
        category: 0,
      },
      {
        id: 12,
        label: "健康",
        category: 0,
      },
      {
        id: 13,
        label: "游戏",
        category: 0,
      },
      {
        id: 14,
        label: "自定义",
        category: 0,
      },
    ],
    cate:'全部'
  }),
});
