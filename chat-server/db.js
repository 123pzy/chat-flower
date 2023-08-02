const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10, // 最大连接数
  host: "localhost",
  port: 3306,
  database: "login",
  user: "root",
  password: "123456",
});
let queryData = function (sql, callback) {
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err, null);
    } else {
      conn.query(sql, (err, result) => {
        callback(err, result);
        conn.release();
      });
    }
  });
};

module.exports = queryData;
