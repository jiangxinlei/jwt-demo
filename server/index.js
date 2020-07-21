const Koa = require('Koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('koa2-cors');
const { sign, verify } = require('jsonwebtoken');   // 签发 token
const secret = 'jiangxinlei';  // 密钥，token 解码用的
const jwt = require('koa-jwt')({ secret });  // jwt 加密解密中间件

const admin = require('./middleware/admin')();

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: function(ctx) {
		if (ctx.url === '/login') {
			return "*"; // 允许来自所有域名请求
		}
		return '*';
	},
	exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	maxAge: 5,
	credentials: true,
	allowMethods: ['GET', 'POST', 'DELETE'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(bodyParser({
  extendTypes: {
    json: ['application/x-www-form-urlencoded'],  // 前端在拦截请求时加了请求头，所以后端也要加，不然无法解析 body 数据
  }
}));

// app.use(jwt.unless({
//   path: [/\/login/]   //数组中的路径不需要通过jwt验证
// }));

router.post('/login', (ctx, next) => {
  // ctx.request.params  URL 路径参数
  // ctx.request.query   请求参数 
  // ctx.request.header  头参数
  // ctx.request.body    json 对象参数

  let userInfo = ctx.request.body;  // 对应上面的 body 解析
  if (userInfo && userInfo.username) {

    const { username } = userInfo;

    // 签发令牌
    const token = sign({ username }, secret, {
      expiresIn: '1h',  // 失效时间
    });

    ctx.body = {
      message: '登录成功',
      code: 1,
      token
    };
  } else {
    ctx.body = {
      message: '用户名不存在',
      code: -1,
    };
  }
})
  .get('/user', async (ctx, next) => {
    const token = ctx.request.header.authorization.split(' ')[1];
    if (token !== 'null') {
      verify(token, secret, (err, decoded) => {
        if (err) {
          switch (err.name) {
            case 'JsonWebTokenError':
              ctx.body = {
                message: '无效的 token',
                code: -4,
                status: 401
              }
              break;
            case 'TokenExpiredError':
              ctx.body = {
                message: 'token 过期',
                code: -3,
                status: 401
              }
              break;
          }
        }

        if (decoded) {
          ctx.body = {
            username: decoded.username,
            code: 1
          }
        }
      });
      
    } else {
      ctx.body = {
        message: '请先登录',
        code: -2
      }
    }
  })
  .get('/admin', jwt, admin, async (ctx, next) => {
    ctx.body = {
      message: '您是管理员',
      code: 1
    }
  });

// 挂载路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(3003, () => {
  console.log('http://localhost:3003');
})