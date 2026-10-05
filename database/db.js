import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";


if(!MONGODB_URI) {
    throw new Error('Please provide MONGODB_URI');
}

const db_connection = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default db_connection;