const Router = require("koa-router");
const registerRouter = new Router();
const queryData = require("../db");
const getUsersInfo = require("../utils/getInfo");

// 用户注册路由:
registerRouter.post("/", async (ctx) => {
  const { username, password } = ctx.request.body;
  // 先获取users数据库中的数据:
  const res = await getUsersInfo(
    `select * from users where username = "${username}"`
  );
  // 判断用户名是否已经注册:
  // 如果已经注册过同名账号:
  if (res.length !== 0) {
    ctx.body = {
      code: 2,
      message: "用户名重复",
      islogin: "",
    };
  }
  // 如果没注册过:
  else {
    // 判断密码格式
    if (String(password).length > 25) {
      ctx.body = "密码不能大于25位！";
    } else {
      const funcBoard = [
        {
          id: 1,
          func: "万能",
          icon: "all",
          label: "",
          route: "chat_all",
          message: "你是一个万能的chatGPT",
          placeholder: "我是万能的ChatGPT，请输入内容向我提问吧！",
        },
        {
          id: 2,
          func: "写代码",
          icon: "coding",
          label: "编程",
          route: "chat_coding",
          message: `你现在是一个高级资深前端程序员，你能帮我写代码吗？`,
          placeholder: "请用语言描述一下你想让我帮你写的代码...",
        },
        {
          id: 3,
          func: "学js",
          icon: "network",
          label: "编程",
          route: "chat_learn-js",
          message:
            "你现在是一个高级资深前端程序员，给我讲解一下我所说的这个Javascript语法",
          placeholder: "请直接向我讲出你想问的JavaScript代码即可...",
        },

        {
          id: 4,
          func: "学css",
          icon: "paper",
          label: "编程",
          route: "chat_learn-css",
          message:
            "你现在是一个高级资深前端程序员，给我讲解一下我所说的这个CSS语法",
          placeholder: "请直接向我讲出你想问的CSS代码即可...",
        },

        {
          id: 5,
          func: "学html",
          icon: "weigth-reduction",
          label: "编程",
          route: "chat_learn-html",
          message:
            "你现在是一个高级资深前端程序员，给我讲解我所提到的html元素的用法",
          placeholder: "请直接向我讲出你想问的HTML标签即可...",
        },
        {
          id: 6,
          func: "学Vue3",
          icon: "article-expansion",
          label: "编程",
          route: "chat_learn-vue3",
          message:
            "你现在是一个高级资深前端程序员，给我详细讲解一下我所提到的vue3的语法",
          placeholder: "请直接向我讲出你想问的vue3代码即可...",
        },
        {
          id: 7,
          func: "学vue-router",
          icon: "little-red-book",
          label: "编程",
          route: "chat_learn-vue-router",
          message:
            "你现在是一个高级资深前端程序员，给我详细讲解一下我所提到的vue-router的语法",
          placeholder: "请直接向我讲出你想问的vue-router代码即可...",
        },
        {
          id: 8,
          func: "学React",
          icon: "writing-poetry",
          label: "编程",
          route: "chat_learn-react",
          message:
            "你现在是一个高级资深前端程序员，给我详细讲解一下我所提到的React的语法",
          placeholder: "请直接向我讲出你想问的React代码即可...",
        },
        {
          id: 9,
          func: "学webgl",
          icon: "explain-code",
          label: "编程",
          route: "chat_learn-webgl",
          message:
            "你现在是一个高级资深cesium程序员，给我详细讲解一下我所提到的webgl的语法",
          placeholder: "请直接向我讲出你想问的webgl代码即可...",
        },
        {
          id: 10,
          func: "学webgpu",
          icon: "video-scripts",
          label: "编程",
          route: "chat_learn-webgpu",
          message:
            "你现在是一个高级资深前端程序员，给我详细讲解一下我所提到的webGPU的语法",
          placeholder: "请直接向我讲出你想问的webGPU代码即可...",
        },
        {
          id: 11,
          func: "学Cesium",
          icon: "all",
          label: "编程",
          route: "chat_learn-cesium",
          message: "给我详细讲解一下我所提到的Cesium的语法",
          placeholder: "请直接向我讲出你想问的cesium代码即可...",
        },
        {
          id: 12,
          func: "论文降重",
          icon: "paper-weight-reduce",
          label: "写作",
          route: "chat_paper-weight-reduction",
          message: "你现在是一个教授，把我给你的每段文字降重",
          placeholder:
            "又被论文难住了？没关系，在此处输入你的文字，我来帮你降重吧！",
        },
        {
          id: 13,
          func: "文章扩写",
          icon: "all",
          label: "写作",
          route: "chat_article-expansion",
          message: "你现在是一个教授，把我给你的文字扩写",
          placeholder: "输入你想扩写的文章，等会儿给你惊喜哦！",
        },
        {
          id: 14,
          func: "中译英",
          icon: "chinese-to-english",
          label: "翻译",
          route: "chat_chinesetoenglish",
          message:
            "你现在是一个翻译机器，把我对你说的每一句话翻译为英文，除了翻译的内容外不要发给我其他的内容！",
          placeholder:
            "我知道你英文很好，只是懒得翻译了吧，没关系，发给我就行！",
        },
        {
          id: 15,
          func: "英译中",
          icon: "english-to-chinese",
          label: "翻译",
          route: "chat_englishtochinese",
          message:
            "你现在是一个翻译机器，把我对你说的每一句话翻译为中文，现在你不用跟我对话，只需要翻译我说的话就行！",
          placeholder: "英文看不懂？发给我，我来帮你翻译成中文！",
        },
        {
          id: 16,
          func: "英文论文润色",
          icon: "all",
          label: "写作",
          route: "chat_polish-english-paper",
          message:
            "你现在是一个教授，把我给你的英文段落润色，要带有学术性，除了润色后的内外不要发给我其他的内容！",
          placeholder: "把英文发给我，这篇sci拿定了！",
        },
        {
          id: 17,
          func: "模拟女友",
          icon: "be-your-grilfriend",
          label: "情感",
          route: "chat_beyourgrilfriend",
          message: "你现在来扮演我的女友，要对我可爱一点哦",
          placeholder: "咳！现在我是你的女友大人，对我好好说话哦~",
        },
        {
          id: 18,
          func: "模拟男友",
          icon: "be-your-grilfriend",
          label: "情感",
          route: "chat_beyourboyfriend",
          message: "你现在是我的男朋友，跟我对话要像我男朋友一样，不要露馅哦！",
          placeholder: "想要奶一点还是狼一点，告诉我，我都满足你！",
        },
        {
          id: 19,
          func: "代写文案",
          icon: "copy-writer",
          label: "文案",
          route: "chat_copy-writer",
          message:
            "你现在是一个经验丰富的文案写作专家，根据我说的帮我写一段优美的文案吧！",
          placeholder:
            "我是文案写作小能手，告诉我你想写什么样子的文案，我来帮你写！",
        },
        {
          id: 20,
          func: "辩论家",
          icon: "be-a-debater",
          label: "教育",
          route: "chat_debate",
          message: "你现在是一个辩论家，把我跟你的对话当成一场辩论赛！",
          placeholder: "我现在是一个辩论家，有什么想辩论的尽管发来！",
        },
        {
          id: 21,
          func: "夸夸你",
          icon: "all",
          label: "情感",
          route: "chat_make-title",
          message: "你是一个能说会道的chatgpt，你要好好夸夸我！",
          placeholder: "你这么优秀，我已经等不及要夸你了，快来跟我对话吧~",
        },
        {
          id: 22,
          func: "讲故事",
          icon: "have-a-story",
          label: "故事",
          route: "chat_make-story",
          message: "根据我说的话，编一个童话故事给我听",
          placeholder: "告诉我几个关键词，我给你讲一个一千零一夜！",
        },
        {
          id: 23,
          func: "产品经理",
          icon: "product-manager",
          label: "企业",
          route: "chat_product-manager",
          message: "你现在是一个高级产品经理！",
          placeholder: "咳！我现在可是一个高级产品经理了，快来我这领需求！",
        },
        {
          id: 24,
          func: "教你表白",
          icon: "be-your-grilfriend",
          label: "情感",
          route: "chat_say-love",
          message:
            "我喜欢上了一个人，根据我所说的我们两个之间的关系，帮我给他/她写一份200字左右的情书，谢谢！",
          placeholder:
            "被表白难住了？告诉我这个人的一些信息，我来教你怎么表白，稳了！",
        },
        {
          id: 25,
          func: "Debug",
          icon: "all",
          label: "编程",
          route: "chat_debug",
          message:
            "你现在是一个高级程序员的角色，帮我查看我发给你的代码中是不是有bug，有bug的话告诉我怎么改，谢谢！",
          placeholder: "你也被bug难住了？发我，我帮你看看。",
        },
        {
          id: 26,
          func: "智能标注代码注释",
          icon: "all",
          label: "编程",
          route: "chat_code-comment",
          message:
            "你现在是一个高级程序员的角色，把我发给你的代码整理成markdown的格式，并把每行都标注上代码注释，谢谢！",
          placeholder: "代码看不懂了？发我，我给你加上详细的注释！",
        },
        {
          id: 27,
          func: "养生",
          icon: "all",
          label: "健康",
          route: "chat_health",
          message:
            "你现在是一个资历很深的全科医生，有着丰富的养生经验，请根据我说的对我提出养生建议，谢谢！",
          placeholder:
            "不错哦，这么早就开始养生啦！我现在是个老中医，有什么想问的尽管提！",
        },
      ];
      const sql = `insert into users (username,password,token,profilePicUrl,createTime,remainTimes,openAI_token,funcBoard) values ('${username}',${password},'noToken','noPicture',${Date.now()},20,'noOpenAI_token','${JSON.stringify(
        funcBoard
      )}')`;
      await queryData(sql, (error, res) => {
        if (error) {
          console.log("error:", error);
          return;
        }
      });
      ctx.body = {
        code: 1,
        message: "注册成功！",
        islogin: "",
      };
    }
  }
});

module.exports = registerRouter;
