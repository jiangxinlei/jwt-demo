import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout, Space } from 'antd'

import Profile from '@/views/Profile';
import Login from '@/views/Login';
import Admin from '@/views/Admin';

import '@/index.less';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="App" style={{ height: '100vh' }}>
      <Header>
        <Space>
          <Link to="/">个人中心</Link>
          <Link to="/login">登录</Link>
          <Link to="/admin">管理员</Link>
        </Space>
      </Header>

      <Content className="content">
        <Switch>
          <Route exact path="/">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
