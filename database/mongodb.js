import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";


if(!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const connectToDatabase = async () => {
    try {

        await mongoose.connect(MONGODB_URI)
        console.log("Connected to database");
        
        
    } catch (error) {
        console.log('Error connecting to database', error);
        process.exit(1);

        
        
    }
}

export default connectToDatabase