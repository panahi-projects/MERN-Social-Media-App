import bcrypt from "bcrypt";
// import Jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const Register = async (req, res) => {
    try {
        const user = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(user.password, salt);

        const newUser = new User({
            ...user,
            password: passwordHash,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};