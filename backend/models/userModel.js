
import mongoose from "mongoose";

const userSchema =
  new mongoose.Schema(
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

      // optionnel
      phone: {
        type: String,
        default: ""
      },

      // image cloudinary OU image google
      profileImage: {
        type: String,
        default: ""
      },

      cartData: {
        type: Object,
        default: {}
      },

      favorites: {
        type: [String],
        default: []
      }
    },
    {
      minimize: false,
      timestamps: true
    }
  );

const userModel =
  mongoose.models.user ||
  mongoose.model(
    "user",
    userSchema
  );

export default userModel;

