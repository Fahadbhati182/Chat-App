import express from "express";
import { authUser } from "../middleware/authUser.js";
import { getAllUserForSlidebar, getUserMessage, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", authUser, getAllUserForSlidebar);
messageRouter.get("/:id", authUser, getUserMessage);
messageRouter.put("/mark/:id", authUser, markMessageAsSeen);
messageRouter.post("/send/:id", authUser, sendMessage);

export default messageRouter;
