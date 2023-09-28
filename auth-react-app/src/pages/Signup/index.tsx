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

const Signup = () => {
  const onFinish = (values: any) => {
    // sign up api
  };

  return (
    <Container>
      <Heading>Sign Up</Heading>
      <Form name="signup" onFinish={onFinish}>
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
            Sign Up
          </Button>
        </SubmitFormItem>
      </Form>
    </Container>
  );
};

export default Signup;
