import mongoose from "mongoose";

const connectDB = async()=>{
 
    const {connection} = await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongoDB is connected at:${connection.host}`.cyan.underline.bold);
}
 
export default connectDB;