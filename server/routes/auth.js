import express from 'express';

const router = express.Router();

import postSignup from '../controllers/auth.controller.js';

// Handle the POST request for the signup route.
router.post('/signup', postSignup);

export default router;
