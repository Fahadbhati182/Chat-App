import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DataBase Connected Succesfully");
    });
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error.message);
  }
};
