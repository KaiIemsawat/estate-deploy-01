import bcryptjs from "bcryptjs";

import { errorHandle } from "../middleware/errorHandle.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const isUsernameUsed = await User.findOne({ username });
    const isEmailExisted = await User.findOne({ email });
    if (isEmailExisted || isUsernameUsed) {
        next(errorHandle(400, "Username or email has been registered"));
    }

    if (password.length <= 5) {
        next(errorHandle(403, "Password need 6 or more characters"));
    }

    const hashedPass = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPass });

    try {
        await newUser.save();
        //
        const { password: pass, ...rest } = newUser._doc;
        generateToken(res, newUser._id);
        res.status(201).json(rest);
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandle(404, "Invalid Credentials !"));
        }

        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword) {
            return next(errorHandle(401, "Invlid Credentials !!"));
        }

        if (validUser && validPassword) {
            const { password: pass, ...rest } = validUser._doc;
            generateToken(res, validUser._id);
            res.status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        // In previous cases, 'email' ot other value come from user input (req.body)
        // In this case, 'email' come from 'data' in OAth.jsx (from google)
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const { password: pass, ...rest } = user._doc;
            generateToken(res, user._id);
            res.status(200).json(rest);
        } else {
            // Create tempory password since there is no password provided from google
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8); // 36 mean 0-9 and a-z. slice(-8) to take only last 8
            const hashedPass = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                // rename username to 'name+lastname+randomnumber'
                username:
                    req.body.name.replace(" ", "").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPass,
                avatar: req.body.photo,
            });
            try {
                await newUser.save();
                const { password: pass, ...rest } = newUser._doc;
                generateToken(res, newUser._id);
                res.status(200).json(rest);
            } catch (error) {
                next(error);
            }
        }
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json("User has been logged out!");
    } catch (error) {
        next(error);
    }
};
