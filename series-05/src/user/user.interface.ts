import Post from "post/post.interface";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  posts: Array<Post>;
}

export default User;
