import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatchAsyncError } from "./tryCatchAsyncErrors.js";

//for authenticated users
export const isAuthenticated = tryCatchAsyncError(async (req, res, next) => {
  const token = req?.headers?.authorization?.replace("Bearer ", "");
  if (!token) return next(new ErrorHandler("please login first", 401));
  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodeData.id);
  if (!user) return next(new ErrorHandler("user not found!", 400));
  req.user = user;
  next();
});

//for admin
export const isAuthAdmin = tryCatchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(
      new ErrorHandler("you are not authenticate to access this resourse!", 401)
    );
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorize to access this resourse`,
        403
      )
    );
  next();
});
