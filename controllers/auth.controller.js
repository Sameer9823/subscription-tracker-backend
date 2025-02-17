import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.status = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            const error = new Error('User not found')
            error.status = 404
            throw error
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('Incorrect password')
            error.status = 401
            throw error
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
              
        })
    } catch (error) {
       next(error)
        
        
    }
};

export const signOut = async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      // Get token from header
      const token = authHeader.split(" ")[1];

      // ✅ Tell frontend to remove token (No need to store expired token)
      return res.status(200).json({ 
          success: true,
          message: "Signed out successfully. Remove token from frontend." 
      });

  } catch (error) {
      next(error);
  }
};

