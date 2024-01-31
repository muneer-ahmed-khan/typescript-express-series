# TypeScript Express Series #02: Express MongoDB

Welcome to the TypeScript Express Series-02 repository, where we dive into incorporating MongoDB into our TypeScript Express application. In this series, we'll cover the usage of the Mongoose library, environmental variables, and the MVC pattern for better project organization. If you find this content helpful, consider giving the repository a star.

## MongoDB Setup with mLab

In this section, we'll set up MongoDB with the mLab platform. mLab provides hosting for your database and offers a free plan called the sandbox. After creating a new database, you'll obtain a URI, such as `mongodb://<dbuser>:<dbpassword>@ds227594.mlab.com:27594/tutorial`.

**Environment Variables**

To handle sensitive information like database credentials, we use environment variables. Create a `.env` file in your project's parent directory with the following content:

```env
MONGO_USER=mwanago
MONGO_PASSWORD=myPassword
MONGO_PATH=@ds227594.mlab.com:27594/tutorial
PORT=5000
```

Remember to add `.env` to your `.gitignore` to avoid committing sensitive information.

**Connecting to the Database**

In your `src/server.ts` file (the entry point), import `dotenv/config` at the beginning to load environment variables:

```typescript
import * as mongoose from 'mongoose';
import 'dotenv/config';

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
```

**Validating Environment Variables**

To ensure all required environment variables are set, use the `envalid` package. Create a file named `validateEnv.ts` in `src/utils/`:

```typescript
import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
  });
}

export default validateEnv;
```

Call `validateEnv()` at the beginning of your `src/server.ts` file.

## Express MongoDB with Mongoose

With the database connection established, let's explore Express MongoDB using the Mongoose library.

**Model Definition**

Create a schema for your posts in `src/posts/post.model.ts`:

```typescript
import * as mongoose from 'mongoose';
import Post from './post.interface';

const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;
```

**Saving a Document**

To save a document, create it using the model and then save it:

```typescript
import postModel from './posts.model';

function createPost(request: express.Request, response: express.Response) {
  const postData: Post = request.body;
  const createdPost = new postModel(postData);
  createdPost.save()
    .then(savedPost => {
      response.send(savedPost);
    });
}
```

**Retrieving All Documents**

Use the `find` method to retrieve all documents:

```typescript
import postModel from './posts.model';

function getAllPosts(request: express.Request, response: express.Response) {
  postModel.find()
    .then(posts => {
      response.send(posts);
    });
}
```

**Retrieve a Certain Document**

Retrieve a document based on its unique id:

```typescript
import postModel from './posts.model';

function getPostById(request: express.Request, response: express.Response) {
  const id = request.params.id;
  postModel.findById(id)
    .then(post => {
      response.send(post);
    });
}
```

**Replacing a Document**

Replace a document using HTTP PATCH:

```typescript
import postModel from './posts.model';

function modifyPost(request: express.Request, response: express.Response) {
  const id = request.params.id;
  const postData: Post = request.body;
  postModel.findByIdAndUpdate(id, postData, { new: true })
    .then(post => {
      response.send(post);
    });
}
```

**Removing a Document**

Remove a document using HTTP DELETE:

```typescript
import postModel from './posts.model';

function deletePost(request: express.Request, response: express.Response) {
  const id = request.params.id;
  postModel.findByIdAndDelete(id)
    .then(successResponse => {
      if (successResponse) {
        response.send(200);
      } else {
        response.send(404);
      }
    });
}
```

**Controller**

Summing up all model manipulations, the controller in `src/posts/posts.controller.ts` is organized as follows:

```typescript
import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import Post from './post.interface';
import postModel from './posts.model';

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }

  // ... (methods: getAllPosts, getPostById, modifyPost, createPost, deletePost)
}

export default PostsController;
```

This concludes the Express MongoDB tutorial. Feel free to explore