import express from "express";
import {
  getUserData,
  isAuth,
  updateProfile,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controllers.js";
import { authUser } from "../middleware/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/get-data", authUser, getUserData);
userRouter.get("/logout", authUser, userLogout);
userRouter.put("/update", authUser, updateProfile);

export default userRouter;
