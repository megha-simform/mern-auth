import express from "express";

const router = express.Router();

import {
  postSignup,
  postLogin,
  postLogout,
  postRefreshToken,
} from "../controllers/auth.controller.js";

// Handle the POST request for the signup route.
router.post("/signup", postSignup);

// Handle the POST request for the login route.
router.post("/login", postLogin);

// Handle the POST request for the logout route.
router.post("/logout", postLogout);

//Handle the POST request to create new access token on valid refresh token.
router.post("/refresh-token", postRefreshToken);

export default router;
