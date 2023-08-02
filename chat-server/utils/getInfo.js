const queryData = require("../db");

// 定义一个获取用户信息的函数:
async function getUsersInfo(sql) {
  const userInfo = await new Promise((resolve, reject) => {
    queryData(sql, (error, res) => {
      if (error) {
        console.log("error:", error);
        return;
      } else {
        resolve(res);
      }
    });
  });
  return userInfo;
}

module.exports = getUsersInfo;
