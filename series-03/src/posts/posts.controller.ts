import express, { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import CreatePostDto from "./post.dto";
import validationMiddleware from "../middleware/validation.middleware";
import Post from "./posts.interface";

class PostsController implements Controller {
  public path = "/posts";
  public router: Router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
  }

  private getAllPosts = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const posts = await this.post.find();
      response.send(posts);
    } catch (error) {
      response.status(500).send(error.message);
    }
  };

  private getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id;
    try {
      const post = await this.post.findById(id);
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  };

  private modifyPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id;
    const postData: Post = request.body;
    try {
      const post = await this.post.findByIdAndUpdate(id, postData, {
        new: true,
      });
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  };

  private createPost = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const postData: Post = request.body;
    try {
      const createdPost = new this.post(postData);
      const savedPost = await createdPost.save();
      response.send(savedPost);
    } catch (error) {
      response.status(500).send(error.message);
    }
  };

  private deletePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id;
    try {
      const successResponse = await this.post.findByIdAndDelete(id);
      if (successResponse) {
        response.sendStatus(200);
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  };
}

export default PostsController;
