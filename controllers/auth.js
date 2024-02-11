import bcrypt from "bcrypt";
import  Jwt  from "jsonwebtoken";
import User from "../models/User.js"

/* REGISTER USER */
export const register = async(req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const Path = "p2.jpeg";

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath : Path,
            friends,
            location,
            occupation,
            viewedProfile : Math.floor(Math.random() * 10000),
            impressions : Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500),json({error : err.message})
    }
}

/* LOGGING */

export const login = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email : email});
        if(!user) return res.status(400).json({ msg : "User does not exist. "});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg : "Invalid user credentials "});

        const token = Jwt.sign({id: user.id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token, user});

    } catch (err) {
        res.status(500).json({error : err.message})
    }
}