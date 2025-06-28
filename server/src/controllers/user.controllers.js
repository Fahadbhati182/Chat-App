import cloudinary from "../lib/cloudinary.js";
import User from "../models/Users.model.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ error: "User already exits" });
    }

    const user = await User.create({
      fullName: name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({ error: "User failed to connect" });
    }
    console.log(user);

    const token = user.generateAuthToken();

    if (!token) {
      return res.status(400).json({ error: "User already exits" });
    }

    res.cookie("userToken", token, {
      httpOnly: true,
    });
    res.status(201).json({
      message: "User registered successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    if (!token) {
      return res.status(400).json({ error: "User already exits" });
    }

    res.cookie("userToken", token, {
      httpOnly: true,
    });
    res.status(201).json({
      message: "User login successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const isAuth = async (req, res) => {
  res.status(200).json({
    message: "User is Authenticated ",
    success: true,
  });
};

export const getUserData = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(200).json({
    message: "User Data out successfully.",
    user,
    success: true,
  });
};

export const userLogout = async (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: false,
  });
  res.status(200).json({
    message: "User logged out successfully.",
    success: true,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    console.log(profilePic, fullName, bio);

    if (!profilePic || !fullName || !bio) {
      return res.status(401).json({ error: "All fields are required" });
    }

    const userId = req.userId;
    let updateUser;

    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      console.log(upload.secure_url);
      updateUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updateUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
