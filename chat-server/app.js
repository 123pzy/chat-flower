// koa
const Koa = require("koa");
const router = require("./router/index.js");
const { koaBody } = require("koa-body");
const port = 3003;
const app = new Koa();

app.use(koaBody());

app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With')
	ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	if (ctx.method == 'OPTIONS') {
		ctx.body = 200;
	} else {
		await next()
	}
})

app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
	console.log(`${port}端口已经打开`);
});
