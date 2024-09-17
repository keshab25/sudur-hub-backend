import User from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatchAsyncError } from "../middlewares/tryCatchAsyncErrors.js";

//register
export const register = tryCatchAsyncError(async (req, res, next) => {
  const { fullName, email, mobileNo, password } = req.body;
  if (!fullName || !email || !mobileNo || !password)
    return next(new ErrorHandler("please provide all fields", 400));

  if (!/\S+@\S+\.\S+/.test(email))
    return next(new ErrorHandler("Email must be valid!", 400));

  const exists = await User.findOne({ email });
  if (exists) return next(new ErrorHandler("Email aready exists!", 400));

  const user = await User.create({
    fullName,
    email,
    mobileNo,
    password,
  });

  res.status(201).json({
    success: true,
    message: "register successFully",
    user,
  });
});

//login
export const login = tryCatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("please provide required fields!", 400));

  if (!/\S+@\S+\.\S+/.test(email))
    return next(new ErrorHandler("email must be valid!", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("email does not exist!", 400));

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return next(new ErrorHandler("invalid incredintials!", 400));

  const token = await user.getJwtToken();

  res.status(200).json({
    success: true,
    message: "login successFully!",
    user,
    token,
  });
});

//logged in user
export const loggedInUser = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("user does not exist!", 400));

  res.status(200).json({
    success: true,
    message: "user get successFully",
    data:user,
  });
});

//update profile

export const updateProfile = tryCatchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  if (!user) {
    if (req.file) {
      await unlink(req.file.path);
    }
    return next(new ErrorHandler("product not found!", 400));
  }
  const { fullName } = req.body;

  if (!fullName) {
    if (req.file) {
      await unlink(req.file.path);
    }
    return next(new ErrorHandler("please provide required fields!", 400));
  }

  const existingImageUrl = user.avatar.url;
  const baseUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 4000
  }`;
  const avatarPath = req.file.filename;
  let userImageUrl;

  if (existingImageUrl) {
    const filename = path.basename(existingImageUrl);
    const previousAvatarPath = path.join("public", "gallery", filename);
    fs.unlinkSync(previousAvatarPath);
  }

  if (avatarPath) {
    userImageUrl = `${baseUrl}/gallery/${avatarPath}`.replace(/\\/g,"/")
  }

  user.fullName = fullName;
  user.avatar = userImageUrl ? { url: userImageUrl } : undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "profile update successFully",
    user,
  });
});

//change password
export const changePassword = tryCatchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("field must be filled!", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("password must be match!", 400));

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new ErrorHandler("user not found!", 400));

  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched)
    return next(new ErrorHandler("oldPassword is incorrect!", 400));
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "psassword change successfully",
  });
});
