const jwt = require("jsonwebtoken");
const SIGN_KEY = "3892428#$WRD@#$@#R#R()*&(";

class JWTUtil {
  getToken(userData) {
    return jwt.sign(userData, SIGN_KEY, { expiresIn: '7d' });
  }
  verify(token) {
    try {
      return jwt.verify(token, SIGN_KEY);
    } catch (err) {
      return "您的token已过期";
    }
  }
}

module.exports = new JWTUtil();
