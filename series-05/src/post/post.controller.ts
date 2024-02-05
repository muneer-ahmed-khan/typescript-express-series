import * as express from "express";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.Interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import Post from "./post.interface";
import postModel from "./posts.model";
import userModel from "../user/user.model";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post
      .find()
      .populate("authors", "-password -address");
    response.send(posts);
  };

  private getPostById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const post = await this.post
      .findById(id)
      .populate("authors", "-password -address");
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private modifyPost = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    const post = await this.post
      .findByIdAndUpdate(id, postData, { new: true })
      .populate("authors");
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const postData: CreatePostDto = request.body;
    const createdPost = new this.post({
      ...postData,
      authors: [request.user._id],
    });
    const user = await this.user.findById(request.user._id);
    user.posts = [...user.posts, createdPost._id];
    await user.save();
    const savedPost = await createdPost.save();
    await savedPost.populate("authors", "-password -address");
    response.send(savedPost);
  };

  private deletePost = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);
    if (successResponse) {
      response.sendStatus(204);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostsController;
