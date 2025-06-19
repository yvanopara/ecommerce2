import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { adminEmail, adminPassword } from "../config/adminkeys.js";


//Route for login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'user not found' });
        }

        // Compare plain-text passwords directly
        if (password !== user.password) {
            return res.json({ success: false, message: 'invalid credentials' });
        }

        const token = createToken(user._id);
        res.json({ success: true, message: 'login success', token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'error' });
    }
};

//jwt token
const JWT_SECRET = "random#Secret";
const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET);
};

//Route for register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        // checking if the user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: 'user already exists' });
        }

        // Validation email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid email' });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'password is not strong' });
        }
        if (!name || name.trim().length < 2) {
            return res.json({ success: false, message: 'Name is required' });
        }


        const newUser = new userModel({
            name: name,
            email: email,
            password: password, // Store plain-text password directly
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: 'user registered', token: token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'error user not registered' });
    }
};

export const google = async (req, res) => {
    const { name, email } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            const { password, ...rest } = user._doc;
            return res.status(200).cookie("access_token", token, {
                httpOnly: true,
            }).json(rest);
        } else {
            // Generate a random password (not hashed)
            const generatedPassword = Math.random().toString(36).slice(-8);

            const newUser = new userModel({
                name: name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 10000),
                email,
                password: generatedPassword, // Storing plain text password
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
            const { password, ...rest } = newUser._doc;

            return res.status(200).cookie("access_token", token, {
                httpOnly: true
            }).json(rest);
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Route fro admin Login

const adminLogin = async (req, res) => {
    try {
         
        const {email, password} =req.body
        if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(email+password,JWT_SECRET);
        res.json({ success:true, token });
    }
    else {
            res.json({success:false, message:'invalid credentials'})
        }
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
export { loginUser, registerUser, adminLogin,JWT_SECRET};

