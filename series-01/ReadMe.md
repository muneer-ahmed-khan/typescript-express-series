# TypeScript Express Series #01: Getting Started

Welcome to the TypeScript Express Series-01 repository, where we kick off our journey into building web applications with TypeScript and Express. In this series, we'll cover essential concepts, practical examples, and lay the foundation for more advanced topics in future series.

## Setting Up Your TypeScript Express Project

To get started, let's set up our TypeScript Express project. Ensure you have Node.js installed, and then run the following commands:

```bash
npm init
npm install typescript express ts-node @types/node
```

This installs the necessary packages, including TypeScript and Express. Now, create a tsconfig.json file with the following compiler options:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "target": "es2017",
    "outDir": "./dist",
    "baseUrl": "./src"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

Add a script in your package.json to run the project using ts-node:
```json
"scripts": {
  "dev": "ts-node ./src/server.ts"
}
```

# Creating a Simple Express Server

Now, let's create a basic Express server. In your `src/examples/expressServerExample.ts` file:

```typescript
import * as express from 'express';

const app = express();

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
```

# Run your project with:

```bash
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000) to see your "Hello world!" message.

# Middleware in TypeScript Express

Middleware plays a crucial role in Express applications. Let's create a simple logger middleware in `src/examples/loggerMiddlewareExample.ts`:

```typescript
import * as express from 'express';

function loggerMiddleware(request: express.Request, response: express.Response, next) {
  console.log(`${request.method} ${request.path}`);
  next();
}

export default loggerMiddleware;
```

### Use the middleware with complete file
`src/examples/loggerMiddlewareExample.ts`:

```typescript
import * as express from 'express';
import loggerMiddleware from './middleware/logger';

const app = express();

app.use(loggerMiddleware);

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
```

# Routing in TypeScript Express

Express supports routing to handle different HTTP methods and paths. Let's create a basic router in `src/examples/routerMiddlewareExample.ts` with a slight change in the file from example below:

```typescript
import * as express from 'express';
import loggerMiddleware from './middleware/logger';
import helloRouter from './routes/hello';

const app = express();

app.use(loggerMiddleware);
app.use('/hello', helloRouter);

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
```

Visit http://localhost:5000/hello to see the "Hello from the router!" message.


# Request and Response Objects

Explore the `express.Request` and `express.Response` objects to handle incoming requests and send responses. Update your route in `src/examples/expressRequestExample.ts`:

```typescript
import * as express from 'express';

const router = express.Router();

router.get('/', (request: express.Request, response: express.Response) => {
  response.send({
    hostname: request.hostname,
    path: request.path,
    method: request.method,
  });
});

export default router;
```

Run your server and visit http://localhost:3000/ to see the JSON response.

This concludes the initial setup and exploration of TypeScript Express in Series #01. Stay tuned for more advanced topics in future series. Happy coding! 🚀



