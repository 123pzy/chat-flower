const Router = require("koa-router");
const router = new Router();
const loginRouter = require("./login");
const registerRouter = require("./register");
const profileRouter = require("./profile");

router.use("/login", loginRouter.routes(), loginRouter.allowedMethods());
router.use(
  "/register",
  registerRouter.routes(),
  registerRouter.allowedMethods()
);
router.use("/profile", profileRouter.routes(), profileRouter.allowedMethods());

module.exports = router;
