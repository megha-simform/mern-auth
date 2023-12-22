import React, { useContext } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { API_PATHS } from "../../apis/routes/APIRoutes";
import { AuthContext } from "../../AuthContext";
import { axiosApi } from "../../apis/auth";

const Container = styled.div`
  margin: 20%;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Home = () => {
  const navigate = useNavigate();
  const userAuthData = useContext(AuthContext);

  // logout current user logged
  //clear user auth
  const logoutUser = () => {
    axiosApi
      .post(API_PATHS.AUTH.logout, {})
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          userAuthData.user = {};
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        // localStorage.clear();
        // userAuthData.user = undefined;
        // navigate("/login");
      });
  };

  return (
    <Container>
      <h1>Home</h1>
      <p>Welcome to the home page USER!</p>

      <Button onClick={logoutUser}>Logout</Button>
    </Container>
  );
};

export default Home;
