import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("database connected",conn.connection.host);
    } catch (error) {
        console.log("error connecting to mongodb",error.message)
        process.exit(1)//1 means falure and 0 means success
    }
}


