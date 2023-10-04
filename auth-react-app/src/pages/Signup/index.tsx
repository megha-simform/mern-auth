import React from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../apis/routes/APIRoutes";
import axios from "axios";
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
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    axios
      .post(API_PATHS.AUTH.signup, {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error, "error");
        }
      });
    // sign up api
  };

  return (
    <Container>
      <Heading>Sign Up</Heading>
      <Form name="signup" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
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
