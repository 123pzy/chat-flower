const Router = require("koa-router");
const loginRouter = new Router();
const getUsersInfo = require("../utils/getInfo");
const jwtUtil = require("../utils/jwtUtil");

loginRouter.post("/", async (ctx) => {
  const { username, password } = ctx.request.body;
  const result = await getUsersInfo(
    `select * from users where username = '${username}'`
  );
  if (result.length == 0) {
    ctx.body = {
      code: 2,
      message: "您似乎还没注册过~",
      token: "token",
    };
  } else {
    const res = await getUsersInfo(
      `select password from users where username = '${username}'`
    );
    if (res[0].password == password) {
      let token = jwtUtil.getToken({ username: `'${username}'` });
      await getUsersInfo(
        `update users set token = '${token}' where username = '${username}'`
      );
      ctx.body = {
        code: 1,
        message: "登陆成功",
        token: token,
        username,
      };
    } else {
      ctx.body = {
        code: 2,
        message: "密码错误",
      };
    }
  }
});

loginRouter.post("/islogin", async (ctx) => {
  const { data } = ctx.request.body;
  const { username, token } = data;
  if (!!token && !!username) {
    const res = await getUsersInfo(
      `select token from users where username = '${username}'`
    );
    if (res[0].token == token) {
      if (jwtUtil.verify(token) != "您的token已过期") {
        ctx.body = {
          code: 1,
          message: "您已经登录",
          islogin: true,
        };
      } else {
        ctx.body = {
          code: 2,
          message: "您的登录已过期,请重新登录！",
          islogin: false,
        };
      }
    } else {
      ctx.body = {
        code: -1,
        message: "您在其他地方登录了，请重新在本地登录~",
        islogin: false,
      };
    }
  } else {
    ctx.body = {
      code: -1,
      message: "请登陆后使用本网站",
      islogin: false,
    };
  }
});

module.exports = loginRouter;
