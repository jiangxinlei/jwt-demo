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
