# TypeScript Express Series #03: Express Error Handling

Welcome to the TypeScript Express Series-03 repository, where we dive into implementing error handling in our TypeScript Express application. In this series, we'll explore how to handle errors gracefully, create custom exceptions, and develop error-handling middleware. If you find this content helpful, consider giving the repository a star.

## Error Handling in Route Handlers

In the previous part of the tutorial, we wrote route handlers for retrieving, modifying, creating, and deleting posts. However, these handlers lack proper error handling. Let's enhance the `getPostById` handler as an example:

```typescript
private getPostById = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const id = request.params.id;
  this.post.findById(id)
    .then((post) => {
      if (post) {
        response.send(post);
      } else {
        next(new HttpException(404, 'Post not found'));
      }
    })
    .catch((error) => {
      next(new HttpException(500, 'Internal Server Error'));
    });
};
```

Now, the handler properly handles the case where the database operation fails by forwarding the error to the Express error-handling middleware.

## Express Error Handling Middleware

To centralize error handling, we create a custom error-handling middleware. First, let's define a base `HttpException` class:

```typescript
// src/exceptions/HttpException.ts
class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
```

Next, we create the error-handling middleware in `src/middleware/error.middleware.ts`:

```typescript
// src/middleware/error.middleware.ts
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response
    .status(status)
    .send({
      status,
      message,
    });
}

export default errorMiddleware;
```

Make sure to add this middleware at the end of your application stack in `src/app.ts`:

```typescript
// src/app.ts
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  // ... (existing code)

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // ... (existing code)
}

export default App;
```

Now, any unhandled errors in your application will be caught by this middleware, providing a consistent way to handle errors.

## Custom Exceptions for Better Error Messages

To provide more detailed error messages, we can create custom exceptions. For example, a `PostNotFoundException`:

```typescript
// src/exceptions/PostNotFoundException.ts
import HttpException from "./HttpException";

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}

export default PostNotFoundException;
```

You can use this exception in your route handlers:

```typescript
// Example in getPostById handler
private getPostById = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const id = request.params.id;
  this.post.findById(id)
    .then((post) => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    })
    .catch((error) => {
      next(new HttpException(500, 'Internal Server Error'));
    });
};
```

## Conclusion

This concludes the Express Error Handling tutorial. We've implemented proper error handling in route handlers, created a custom error-handling middleware, and introduced custom exceptions for more informative error messages. Feel free to explore the provided code and enhance it further as needed. If you have any questions or feedback, please don't hesitate to reach out.