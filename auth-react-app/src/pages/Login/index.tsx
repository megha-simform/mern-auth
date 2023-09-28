import React from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20%;
  padding: 40px;
`;

const Heading = styled.h1`
  text-align: center;
`;

const SubmitFormItem = styled(Form.Item)`
  display: flex;
  justify-content: center;
`;

const Login = () => {
  const onFinish = (values: any) => {
    // login api
  };

  return (
    <Container>
      <Heading>Login</Heading>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <SubmitFormItem>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </SubmitFormItem>
      </Form>
    </Container>
  );
};

export default Login;
