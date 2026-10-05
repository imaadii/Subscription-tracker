import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const { name, email, password } = req.body;

        const existing_user = await User.findOne({ email });
        console.log(existing_user);

        if (existing_user) {
            const error = new Error("User already exists.");
            error.statusCode = 409;
            throw error;
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User 
        const newUsers = await User.create([{
            name: name,
            email: email,
            password: hashedPassword,
        }], { session});

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created',
            data: {
                token: token,
                user: newUsers[0]
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}


export const signin = async (req, res, next) => {

}

export const signout = async (req, res, next) => {

}