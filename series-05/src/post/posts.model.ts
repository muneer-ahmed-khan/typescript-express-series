import * as mongoose from "mongoose";
import Post from "./post.interface";

const postSchema = new mongoose.Schema({
  // for one to many
  // author: {
  //   ref: "User",
  //   type: mongoose.Schema.Types.ObjectId,
  // },

  // for many to many
  authors: [
    {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  content: String,
  title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);

export default postModel;
