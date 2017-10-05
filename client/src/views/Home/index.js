import React from 'react';
import { Layout } from 'antd';

import LoginForm from './LoginForm';
import './styles.css';

const { Header, Content, Sider } = Layout;

const Home = () => (
  <Layout>
    <Header className="header_title">Couchsurfing BotApp</Header>
    <Content>
      <LoginForm />
    </Content>
  </Layout>
);

export default Home;
