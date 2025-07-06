import express from "express";

import { allOrders, paymentUpdate, placeOrder, updateStatus, userOrders } from "../controlers/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const orderRouter = express.Router();

//Admin Features
orderRouter.post("/list",adminAuth,allOrders); 
orderRouter.post("/status",adminAuth,updateStatus);
orderRouter.post("/paid", adminAuth, paymentUpdate);



orderRouter.post("/place",authUser, placeOrder);
orderRouter.post("/userorders",authUser,userOrders);




export default orderRouter;