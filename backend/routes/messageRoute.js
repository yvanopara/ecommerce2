
import express from "express";

import {
  sendMessage,
  getMessages,
  markAsRead,
  getConversations
} from "../controlers/messageController.js";

const messageRouter =
  express.Router();

messageRouter.post(
  "/send",
  sendMessage
);

messageRouter.get(
  "/history/:userId/:adminId",
  getMessages
);

messageRouter.put(
  "/read/:messageId",
  markAsRead
);

// NOUVELLE ROUTE
messageRouter.get(
  "/conversations/:adminId",
  getConversations
);

export default messageRouter;

