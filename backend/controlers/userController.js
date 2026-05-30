
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";

// JWT SECRET depuis .env
export const JWT_SECRET = process.env.JWT_SECRET;


// JWT TOKEN
const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET);
};


// LOGIN USER
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "user not found"
            });
        }

        // comparaison mot de passe simple
        if (password !== user.password) {
            return res.json({
                success: false,
                message: "invalid credentials"
            });
        }

        const token = createToken(user._id);

        res.json({
            success: true,
            message: "login success",
            token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "error"
        });
    }
};


// REGISTER USER
const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // vérifier si user existe déjà
        const exist = await userModel.findOne({ email });

        if (exist) {
            return res.json({
                success: false,
                message: "user already exists"
            });
        }

        // validation email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid email"
            });
        }

        // validation password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "password is not strong"
            });
        }

        // validation name
        if (!name || name.trim().length < 2) {
            return res.json({
                success: false,
                message: "Name is required"
            });
        }

        const newUser = new userModel({
            name,
            email,
            password
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            message: "user registered",
            token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "error user not registered"
        });
    }
};


// GET PROFILE
const getProfile = async (req, res) => {

    try {

        const token = req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: "No token"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await userModel
            .findById(decoded.id)
            .select("name email");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Invalid token"
        });
    }
};


// GOOGLE LOGIN
const google = async (req, res) => {

    const { name, email } = req.body;

    try {

        let user = await userModel.findOne({ email });

        if (user) {

            const token = jwt.sign(
                { id: user._id },
                JWT_SECRET
            );

            const { password, ...rest } = user._doc;

            return res
                .status(200)
                .cookie("access_token", token, {
                    httpOnly: true
                })
                .json(rest);
        }

        // création nouvel utilisateur google
        const generatedPassword = Math.random()
            .toString(36)
            .slice(-8);

        const newUser = new userModel({
            name:
                name.toLowerCase().replace(/\s+/g, "") +
                Math.floor(Math.random() * 10000),

            email,
            password: generatedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id },
            JWT_SECRET
        );

        const { password, ...rest } = newUser._doc;

        return res
            .status(200)
            .cookie("access_token", token, {
                httpOnly: true
            })
            .json(rest);

    } catch (error) {

        console.error(
            "Google Auth Error:",
            error
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


export {
    loginUser,
    registerUser,
    getProfile,
    google
};