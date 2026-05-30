
import express from 'express';

import {
  getProfile,
  loginUser,
  registerUser
} from '../controlers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/profile', getProfile);

// userRouter.post("/google", google)

export default userRouter;

