import * as mongoose from "mongoose";
import User from "./user.interface";

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  address: addressSchema,
  email: String,
  name: String,
  password: String,

  // for two way reference
  posts: [
    {
      ref: "Post",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
