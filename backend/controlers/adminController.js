// controllers/adminController.js

import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

export const JWT_SECRET = process.env.JWT_SECRET;


// CREATE ADMIN
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await adminModel.findOne({ email });

    if (exist) {
      return res.json({
        success: false,
        message: "Cet admin existe déjà"
      });
    }

    const admin = await adminModel.create({
        name,
      email,
      password
    });

    // création du token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      JWT_SECRET
    );

    // affiche le token dans la console
    console.log("TOKEN ADMIN :", token);
    res.json({
      success: true,
      message: "Admin créé avec succès",
      admin
    });
     console.log(token)
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message
    });
  }
};


// LOGIN ADMIN

// LOGIN ADMIN
const loginAdmin = async (
  req,
  res
) => {
  try {

    const {
      email,
      password
    } = req.body;

    const admin =
      await adminModel.findOne({
        email
      });

    if (!admin) {
      return res.json({
        success: false,
        message:
          "Admin introuvable"
      });
    }

    if (
      password !==
      admin.password
    ) {
      return res.json({
        success: false,
        message:
          "Mot de passe incorrect"
      });
    }

    const token =
      jwt.sign(
        {
          id: admin._id,
          role:
            admin.role
        },
        JWT_SECRET
      );

    res.json({
      success: true,
      token,

      // utile pour le frontend
      admin: {
        _id:
          admin._id,
        name:
          admin.name,
        email:
          admin.email,
        role:
          admin.role
      }
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message:
        error.message
    });
  }
};


export {
  createAdmin,
  loginAdmin
};