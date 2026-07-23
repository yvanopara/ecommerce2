
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import { OAuth2Client } from "google-auth-library";

export const JWT_SECRET =
  process.env.JWT_SECRET;

const GOOGLE_CLIENT_ID =
  "242570790563-no0fguencfhn43euu64bsgetcepng53k.apps.googleusercontent.com";

const client =
  new OAuth2Client(
    GOOGLE_CLIENT_ID
  );



// TOKEN
const createToken = (
  id
) => {
  return jwt.sign(
    { id },
    JWT_SECRET
  );
};



// LOGIN USER
const loginUser =
  async (req, res) => {

    const {
      email,
      password
    } = req.body;

    try {

      const user =
        await userModel.findOne(
          { email }
        );

      if (!user) {
        return res.json({
          success: false,
          message:
            "Utilisateur introuvable"
        });
      }

      if (
        password !==
        user.password
      ) {
        return res.json({
          success: false,
          message:
            "Mot de passe incorrect"
        });
      }

      const token =
        createToken(
          user._id
        );

      res.json({
        success: true,
        token,
        user
      });

    } catch (error) {

      console.log(
        error
      );

      res.json({
        success: false,
        message:
          "Erreur login"
      });
    }
  };



// REGISTER USER
const registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        phone
      } = req.body;

      const exist =
        await userModel.findOne(
          { email }
        );

      if (exist) {
        return res.json({
          success: false,
          message:
            "Utilisateur existe déjà"
        });
      }

      if (
        !validator.isEmail(
          email
        )
      ) {
        return res.json({
          success: false,
          message:
            "Email invalide"
        });
      }

      if (
        password.length <
        8
      ) {
        return res.json({
          success: false,
          message:
            "Mot de passe trop court"
        });
      }

      let imageUrl =
        "";

      // PHOTO OPTIONNELLE
      if (
        req.file
      ) {

        const result =
          await cloudinary.uploader.upload(
            req.file
              .path,
            {
              resource_type:
                "image"
            }
          );

        imageUrl =
          result.secure_url;
      }

      const newUser =
        new userModel(
          {
            name,
            email,
            password,

            phone:
              phone ||
              "",

            profileImage:
              imageUrl
          }
        );

      const user =
        await newUser.save();

      const token =
        createToken(
          user._id
        );

      res.json({
        success: true,
        token,
        user
      });

    } catch (error) {

      console.log(
        error
      );

      res.json({
        success: false,
        message:
          "Erreur register"
      });
    }
  };



// GET PROFILE
const getProfile =
  async (req, res) => {

    try {

      const token =
        req.headers
          .token;

      if (!token) {
        return res.json({
          success: false,
          message:
            "No token"
        });
      }

      const decoded =
        jwt.verify(
          token,
          JWT_SECRET
        );

      const user =
        await userModel.findById(
          decoded.id
        );

      if (!user) {
        return res.json({
          success: false,
          message:
            "User not found"
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {

      console.log(
        error
      );

      res.json({
        success: false,
        message:
          "Invalid token"
      });
    }
  };



// GOOGLE LOGIN
const google =
  async (req, res) => {

    try {

      const {
        credential
      } = req.body;

      const ticket =
        await client.verifyIdToken(
          {
            idToken:
              credential,
            audience:
              GOOGLE_CLIENT_ID
          }
        );

      const payload =
        ticket.getPayload();

      const {
        email,
        name,
        picture
      } = payload;

      let user =
        await userModel.findOne(
          {
            email
          }
        );

      // LOGIN
      if (user) {

        const token =
          createToken(
            user._id
          );

        return res.json({
          success: true,
          token,
          user
        });
      }

      // REGISTER
      const generatedPassword =
        Math.random()
          .toString(36)
          .slice(-8);

      user =
        await userModel.create(
          {
            name,
            email,
            password:
              generatedPassword,

            phone:
              "",

            // PHOTO GOOGLE
            profileImage:
              picture ||
              ""
          }
        );

      const token =
        createToken(
          user._id
        );

      res.json({
        success: true,
        token,
        user
      });

    } catch (error) {

      console.log(
        "Google error:",
        error
      );

      res.status(
        500
      ).json({
        success: false,
        message:
          "Erreur Google login"
      });
    }
  };
  // UPDATE PROFILE
const updateProfile = async (req, res) => {

  try {

    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Token manquant"
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const user = await userModel.findById(
      decoded.id
    );

    if (!user) {
      return res.json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    const {
      name,
      phone
    } = req.body;

    if (name) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    // Nouvelle photo
    if (req.file) {

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "image"
          }
        );

      user.profileImage =
        result.secure_url;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profil mis à jour",
      user
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Erreur lors de la mise à jour"
    });

  }

};



export {
  loginUser,
  registerUser,
  getProfile,
  google,
   updateProfile
};
