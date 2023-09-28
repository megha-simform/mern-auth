import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20%;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Home = () => {
  const logoutUser = (values: any) => {
    // logout current user logged
    //clear user auth
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
