const profileRouter = require("koa-router")();
const multer = require("@koa/multer");
const path = require("path");
const getUsersInfo = require("../utils/getInfo");
// 使用fs模块提供的基于Promise的异步方法
const fsPromises = require("fs").promises;

// 设置存储文件的位置及文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: function (req, file, cb) {
    namefile = cb(null, Date.now() + "-" + file.originalname);
  },
});
// 使用multer中间件处理上传的文件
const upload = multer({ storage });

// 处理上传文件的路由
profileRouter.post("/:token", upload.single("file"), async (ctx) => {
  const { token } = ctx.params;
  const path = ctx.file.path.replace(/\\/g, "/");
  await getUsersInfo(
    `update users set profilePicUrl = '${path}' where token = '${token}'`
  );
  ctx.body = "上传成功";
});

// 获取数据库中的头像路径
profileRouter.get("/getimg/:token", async (ctx) => {
  const { token } = ctx.params;
  if (token == null) {
    ctx.body = {
      code: 4,
      message: "您未登录",
    };
  } else {
    const imgUrl = await getUsersInfo(
      `SELECT profilePicUrl FROM users WHERE token = '${token}'`
    );

    if (imgUrl[0].profilePicUrl == "noPicture") {
      try {
        const data = await fsPromises.readFile("./uploads/default.png");
        ctx.body = data;
      } catch (error) {
        console.log("error:", error);
      }
    } else {
      try {
        const data = await fsPromises.readFile(`${imgUrl[0].profilePicUrl}`);
        ctx.body = data;
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// chatGPT调用次数减一
profileRouter.delete("/:username", async (ctx) => {
  const username = ctx.params.username;
  const res = await getUsersInfo(
    `select remainTimes from users where username = '${username}'`
  );
  if (res[0].remainTimes > 0) {
    await getUsersInfo(
      `update users set remainTimes = remainTimes - 1 where username = '${username}'`
    );
    ctx.body = {
      code: 1,
      message: `你的免费使用次数还剩${res[0].remainTimes - 1}`,
      remainTimes: res[0].remainTimes - 1,
    };
  } else {
    ctx.body = {
      code: 5,
      message: "你的免费使用次数用完了！",
    };
  }
});

// 获取剩余次数
profileRouter.get("/getremaintimes", async (ctx) => {
  const { token } = ctx.request.query;
  const res = await getUsersInfo(
    `select remainTimes from users where token = '${token}'`
  );
  ctx.body = {
    code: 1,
    message: `您的剩余使用次数为${res[0].remainTimes}`,
    remainTimes: res[0].remainTimes,
  };
});

// 更换用户名
profileRouter.put("/changeusername", async (ctx) => {
  const { token, newUsername } = ctx.request.body;
  // 先获取users数据库中的数据:
  const res = await getUsersInfo(
    `select * from users where username = "${newUsername}"`
  );
  // 判断用户名是否已经注册:
  // 如果已经注册:
  if (res.length !== 0) {
    ctx.body = {
      code: 2,
      message: "用户名重复",
      islogin: "",
    };
  } else {
    await getUsersInfo(
      `update users set username = '${newUsername}' where token = '${token}' `
    );
    ctx.body = {
      code: 1,
      message: "更新用户名成功",
    };
  }
});

// 获取用户名
profileRouter.get("/getusername", async (ctx) => {
  const { token } = ctx.request.query;
  if (!!token) {
    const res = await getUsersInfo(
      `select username from users where token = '${token}'`
    );
    const username = res[0].username;
    ctx.body = {
      code: 1,
      message: "获取用户名成功！",
      username,
    };
  } else {
    ctx.body = {
      code: -1,
      message: "您还未登录",
    };
  }
});

// 添加个人openAI_token
profileRouter.post("/chat/openaitoken", async (ctx) => {
  const { openAI_token, token } = ctx.request.body;
  const res = await getUsersInfo(
    `update users set openAI_token = '${openAI_token}' where token = '${token}'`
  );
  if (res.changedRows) {
    ctx.body = {
      code: 1,
      message: "已收到你的Token！",
    };
  } else {
    ctx.body = {
      code: -1,
      message: "出错啦！",
    };
  }
});

// 删除个人openAI_tokne
profileRouter.delete("/deleteOpenAIToken/:token", async (ctx) => {
  const token = ctx.params.token;
  console.log(token);
  const res = await getUsersInfo(
    `update users set openAI_token = 'noOpenAI_token' where token = '${token}'`
  );
  ctx.body = {
    code: 1,
    message: "已删掉你的openAI-token",
  };
});

// 判断是否有个人openAI_token
profileRouter.get("/haveOpenAIToken", async (ctx) => {
  const { token } = ctx.request.query;
  const res = await getUsersInfo(
    `select openAI_token from users where token = '${token}'`
  );
  ctx.body = {
    code: 1,
    openAI_token: res[0].openAI_token,
    message: "你已经上传了你的openAI token",
  };
});

// 获取funcBoard
profileRouter.get("/getFuncBoard/:username", async (ctx) => {
  const username = ctx.params.username;
  const res = await getUsersInfo(
    `select funcBoard from users where username = '${username}'`
  );
  ctx.body = {
    code: 1,
    funcBoard: res[0].funcBoard,
    message: "已经获得funcBoard",
  };
});

// 添加func
profileRouter.post("/setFuncBoard/funcBoard", async (ctx) => {
  let { func, username } = ctx.request.body;
  const res = await getUsersInfo(
    `select funcBoard from users where username = '${username}'`
  );
  let newFuncBoard = JSON.parse(res[0].funcBoard);
  newFuncBoard.push(func);
  newFuncBoard = JSON.stringify(newFuncBoard);
  const res2 = await getUsersInfo(
    `update users set funcBoard = '${newFuncBoard}' where username = '${username}'`
  );
  // 在这里加上try/catch

  ctx.body = {
    code: 1,
    message: "success",
  };
});

// 删除一个funcBoard
profileRouter.delete("/deleteFuncBoard/:data", async (ctx) => {
  let { data } = ctx.params;
  data = JSON.parse(data);
  const id = data.id;
  const username = data.username;
  const res = await getUsersInfo(
    `select funcBoard from users where username = '${username}'`
  );
  let funcBoard = JSON.parse(res[0].funcBoard);
  let funcBoardName;
  let newFuncBoard = funcBoard.filter((item) => {
    if (item.id == id) {
      funcBoardName = item.func;
    }
    return item.id != id;
  });
  newFuncBoard = JSON.stringify(newFuncBoard);
  const res2 = await getUsersInfo(
    `update users set funcBoard = '${newFuncBoard}' where username = '${username}'`
  );
  ctx.body = {
    code: 1,
    message: `你的"${funcBoardName}"板块已删除`,
  };
});
module.exports = profileRouter;
