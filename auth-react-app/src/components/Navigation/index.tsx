import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

const Navigation: React.FC = () => {
  const menuItems = [
    { key: '1', to: '/home', label: 'Home' },
    { key: '2', to: '/profile', label: 'Profile' },
  ];

  return (
    <Layout>
      <Header>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>
              <Link to={item.to}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content>
        {/* Your main content goes here */}
      </Content>
    </Layout>
  );
};

export default Navigation;
