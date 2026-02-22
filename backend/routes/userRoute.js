import express from 'express'

import { adminLogin,getProfile,loginUser, registerUser } from '../controlers/userController.js';

const userRouter = express.Router();
userRouter.post('/login',loginUser)
userRouter.post('/register',registerUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/profile', getProfile);
// userRouter.post("/google", google)

export default userRouter;

