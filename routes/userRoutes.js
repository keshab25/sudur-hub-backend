import express from "express";
import { changePassword, loggedInUser, login, register, updateProfile } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../file/upload.js";
const router = express.Router();


//register
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/single/user").get(isAuthenticated, loggedInUser);
router.route("/update/user").put(isAuthenticated, upload.single("avatar"),updateProfile);

router.route("/change/password").put(isAuthenticated,changePassword);

export default router;