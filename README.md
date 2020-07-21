# jwt 鉴权

## 一、使用

在根目录下执行：

```shell
# 启动服务
yarn server

# 启动项目
yarn start
```

## 二、介绍

jwt 鉴权是用户在调用登录等 API 之前，服务端对用户进行“身份认证”。

![jwt](https://github.com/jiangxinlei/jwt-demo/blob/master/jwt.png)

流程：

- 用户登录
- 登录成功服务端返回 token
- 客户端获取 token 存到 storage 里，带上 token 进行增删改查
- 服务端验证 token 是否有效，有效返回 200
- 客户端的 token 过期或无效
- 服务端处理并返回 401

## 三、实现

### 1、服务端

#### 1.1、安装依赖

```shell
yarn add Koa koa-bodyparser koa-router koa2-cors jsonwebtoken koa-jwt
```

- koa-bodyparser：解析数据
- koa-router：路由
- koa2-cors：跨域
- jsonwebtoken：签发和认证 token
- koa-jwt：jwt 加密解密中间件，也可以不用这个

#### 1.2、创建服务和路由

```js
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
        // 这里判断 token 是否有效或过期
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
```

```js
// admin.js
module.exports = () => {
  return async (ctx, next) => {
    if (ctx.state.user.username === 'admin') {
      next();
    } else {
      ctx.body = {
        code: -6,
        message: '不是管理员账户无权限'
      }
    }
  }
}
```

### 2、客户端

- 使用 axios 封装 request 方法：

```js
// request.js
import axios from 'axios';

class Ajax {

  baseURL= process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3003';
  timeout = 3000;

  request(options) {
    const instance = axios.create();
    const config = this.merge(options);

    this.setInterceptor(instance);
    return instance(config);  // 返回的是 promise
  }

  // 拦截器
  setInterceptor(instance) {
    // 更改请求头
    instance.interceptors.request.use(config => {
      // 可以在这里加请求头

      // 将 token 添加到 localstorage
      config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;

      // 添加 'Content-Type' = 'application/x-www-form-urlencoded' 请求头可以去掉 options 预检请求
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

      return config;
    });

    // 对响应拦截
    // 上一个 promise 返回了一个常量，作为下个 promise 的输入
    instance.interceptors.response.use(res => {
      return res.data;
    });
  }

  merge(options) {
    return {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout
    }
  }
}

export default new Ajax();

```

- 调用 api

```js
import ajax from './request';

export const getUser = () => {
  return ajax.request({
    url: '/user',
    method: 'get'
  });
};

export const getAdmin = () => {
  return ajax.request({
    url: '/admin',
    method: 'get'
  });
};

export const login = (username) => {
  return ajax.request({
    url: '/login',
    method: 'post',
    data: {
      username
    }
  });
};
```
