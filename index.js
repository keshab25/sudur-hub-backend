
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";
import ProductRoute  from "./routes/productRoute.js";
import userRoute from "./routes/userRoutes.js";
import { errorListening } from "./middlewares/error.js";
import cors from "cors";


const app = express();

dotenv.config();

//database connection
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//for code uncaughtException
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`.red);
    console.log(`Shutting down the server to uncaughtException!`);
    process.exit(1);
})
//routing
app.use("/api/v1",ProductRoute);
app.use("/api/v1",userRoute);

app.use("/gallery",express.static("public/gallery"))

//handling custom error
app.use(errorListening);


const PORT = process.env.PORT;
const server = app.listen(PORT,()=>{
    console.log(`server is running at port:http://localhost:${PORT}`.cyan.underline.bold
    );
});

//for handling the promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`.red);
    console.log(`shutting down the server to handle promise rejection!`);
    server.close(()=>{
        process.exit(1);
    });
});


