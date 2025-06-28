import { io, userSocketMap } from "../../server.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.model.js";
import User from "../models/Users.model.js";

export const getAllUserForSlidebar = async (req, res) => {
  try {
    const userId = req.userId;
    const filterUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};
    const promise = filterUser.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promise);

    res.json({ success: true, users: filterUser, unseen: unseenMessages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

export const getUserMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: selectedUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: userId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.userId;
    const { id: receiverId } = req.params;

    console.log({ text, image, senderId, receiverId });

    let imageUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSockerId = userSocketMap[receiverId];
    if (receiverSockerId) {
      io.to(receiverSockerId).emit("newMessage", newMessage);
    }

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};
