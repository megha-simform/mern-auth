import express from "express";

const router = express.Router();

import {
  postSignup,
  postLogin,
  postLogout,
  postRefreshToken,
  postChangePassword,
  postForgotPassword,
  postVerifyEmail,
  postResetPassword,
} from "../controllers/auth.controller.js";

// Handle the POST request for the signup route.
router.post("/signup", postSignup);

// Handle the POST request for the login route.
router.post("/login", postLogin);

// Handle the POST request for the logout route.
router.post("/logout", postLogout);

//Handle the POST request to create new access token on valid refresh token.
router.post("/refresh-token", postRefreshToken);

router.post("/change-password", postChangePassword);

router.post("/forgot-password", postForgotPassword);

router.post(`/reset-password/:resetPasswordToken`, postResetPassword);

router.post("/verify-email/:verifyEmailToken", postVerifyEmail);

export default router;
