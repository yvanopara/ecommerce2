// routes/adminRoute.js

import express from "express";
import {
  createAdmin,
  loginAdmin
} from "../controlers/adminController.js";


const adminRouter = express.Router();

adminRouter.post("/create", createAdmin);
adminRouter.post("/login", loginAdmin);

export default adminRouter;