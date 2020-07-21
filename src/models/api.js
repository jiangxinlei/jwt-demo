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