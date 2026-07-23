
import express from "express";

import upload from "../middlewares/multer.js";

import {
  getProfile,
  loginUser,
  registerUser,
  google,
  updateProfile
} from "../controlers/userController.js";

const userRouter =
  express.Router();

userRouter.post("/login",loginUser);

userRouter.post("/register",upload.single("profileImage"), registerUser);

userRouter.get("/profile",getProfile);

userRouter.post("/google",google);
userRouter.put("/update-profile",upload.single("profileImage"), updateProfile
);

export default userRouter;

