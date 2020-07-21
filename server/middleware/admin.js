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