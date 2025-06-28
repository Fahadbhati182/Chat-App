import User from "../models/Users.model.js";
import jwt from "jsonwebtoken";
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken._id) {
      req.userId = decodedToken._id;
      return next();
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
