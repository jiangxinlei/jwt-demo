import React from 'react';
import { Form, Input, Button, message } from 'antd';

import { login } from '@/models/api';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 4,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 4,
  },
};

export default () => {

  const name = localStorage.getItem('username');

  const onFinish = async ({ username }) => {
    try {
      const res = await login(username);

      if (res.code === 1) {
        localStorage.setItem('token', res.token);
        message.success(res.message)
      } else {
        message.success(res.message)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return name ? (
    <span>登录成功，清除 localstorage 试试</span>
  ) : (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item { ...tailLayout }>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
