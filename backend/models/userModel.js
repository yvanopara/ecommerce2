import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    cartData: {
      type: Object,
      default: {}
    },

    favorites: {
      type: [String],
      default: []
    },

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },
  {
    minimize: false,
    timestamps: true
  }
);

const userModel =
  mongoose.models.user ||
  mongoose.model("user", userSchema);

export default userModel;

