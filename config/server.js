module.exports = {
  projectName: '',
  template: 'react',
  buildPath: 'build',
  script: 'npm run build',
  host: '',        // 服务器地址
  port: 22,        // ssh 端口，一般是 22
  username: 'root',    // 登录服务器用户名
  password: '',    // 登录服务器密码
  serverPath: '/usr/src/my-app'   // 文件上传的服务器地址
};