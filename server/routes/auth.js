import express from 'express';

const router = express.Router();

import { postSignup, postLogin, postLogout } from '../controllers/auth.controller.js';

// Handle the POST request for the signup route.
router.post('/signup', postSignup);

// Handle the POST request for the login route.
router.post('/login', postLogin);

// Handle the POST request for the logout route.
router.post('/logout', postLogout);

export default router;
