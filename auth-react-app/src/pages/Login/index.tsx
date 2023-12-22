import React, { useContext } from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { API_PATHS } from "../../apis/routes/APIRoutes";
import axios from "axios";
import AuthAPIService from "../../apis/auth";

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
  const navigate = useNavigate();
  const userAuthData = useContext(AuthContext);

  const handleGoogleLogin = () => {
    AuthAPIService.loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    AuthAPIService.loginWithFacebook();
  };

  const handleMicrosoftLogin = () => {
    AuthAPIService.loginWithMicrosoft();
  };

  // login api
  const onFinish = (values: any) => {
    axios
      .post(API_PATHS.AUTH.login, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("access-token", response.data.accessToken);
          localStorage.setItem("refresh-token", response.data.refreshToken);

          userAuthData.user = response.data.user;
          navigate("/");
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error, "error");
        }
      });
  };

  return (
    <Container>
      <Heading>Login</Heading>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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
        <SubmitFormItem>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <button onClick={handleGoogleLogin}>Login with Google</button>
          <button onClick={handleFacebookLogin}>Login with Facebook</button>
          <button onClick={handleMicrosoftLogin}>Login with Microsoft</button>
        </SubmitFormItem>
      </Form>
    </Container>
  );
};

export default Login;
