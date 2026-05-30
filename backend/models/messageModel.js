// models/messageModel.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    senderModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true
    },

    receiverModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true
    },

    text: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Message",
  messageSchema
);

