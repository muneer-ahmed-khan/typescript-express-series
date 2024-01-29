# TypeScript Express Series-01

Express is a framework for Node.js used to build the backend for web applications. It is unopinionated, meaning that you can use it in a manner in which you see fit. In this tutorial, I present a way that works for me while working with TypeScript Express.

## Starting up the project

To get started, we need to install necessary packages first using NPM.

```bash
npm init
npm install typescript express ts-node
```

We start with an elementary `tsconfig.json` file:

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

To run our project, we need to add a script in our `package.json`:

```json
"scripts": {
  "dev": "ts-node ./src/server.ts"
}
```

As you can see, our app starts at the `server.ts` file in the `src` directory. Let’s start with the basics:

```typescript
// src/server.ts
import * as express from 'express';

const app = express();

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(5000);
```

The `express()` function creates the Express application that we are going to interact with.

### Middleware

Middleware functions have access to the request and response objects. It can attach to any place in the request-response cycle. A third argument that middleware receives is the `next` function. When called, the next middleware in the chain is executed. An example of a middleware is the `get` callback that handles the HTTP GET request that we’ve written above.

Let’s create a very simple logger middleware that will log to console what requests were made.

```typescript
// src/server.ts
import * as express from 'express';

function loggerMiddleware(request: express.Request, response: express.Response, next) {
  console.log(`${request.method} ${request.path}`);
  next();
}

const app = express();

app.use(loggerMiddleware);

app.get('/hello', (request, response) => {
  response.send('Hello world!');
});

app.listen(5000);
```

In this example, as soon as someone sends the GET request to the `/hello` path, “GET /hello” will be printed in the console in which the app runs.

Thanks to calling `next()`, the control of the request can be passed further. If you create a middleware that neither ends the request-response cycle (for example by sending a response) or calls the `next` function, the request will not finish with a valid response.

There are a lot of ready-to-use middlewares that you can attach to your application, and you will have plenty of chances to see some of them in this course. A crucial one is the `body-parser`. It parses the body of the incoming request and makes it available under the `request.body` property. In this example, we use the `bodyParser.json` middleware that parses the JSON data.

```bash
npm install body-parser
```

```typescript
// src/server.ts
import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.post('/', (request, response) => {
  response.send(request.body);
});

app.listen(5000);
```

The body was sent back to us thanks to running `response.send(request.body)`. Without the body parser, the `request.body` property wouldn’t be accessible.

As we go further, we explain more advanced concepts connected to the middleware.

### Routing

The `app` object has a set of functions that attach callbacks to HTTP requests performed to specified paths, just like the examples above with `app.get` and `app.post`. You can also attach callbacks to other HTTP methods like POST, PUT, PATCH, and DELETE.

Another way to set up routing is to use the `router` object. Once you create a router object you can call the methods like `get`, `put`, `patch`, and `delete` just like on the `app` object.

```typescript
// src/server.ts
const router = express.Router();

router.get('/', (request, response) => {
  response.send('Hello world!');
});
```
The only thing left that is required is to use the router.

```typescript
// src/server.ts
app.use('/', router);
```

As you can see by the usage of `app.use`, the `router` instance is just a middleware that you can attach to your application.

The addresses of the routes are a combination of paths provided for the `app.use` and the `router.METHOD`.

```typescript
router.get('/hello', (request, response) => {
  response.send('Hello world!');
});
 
app.use('/api', router);
```

The code above results in creating a route `/api/hello` that responds with text “Hello world!”.

### Request

The `request` object contains information about the HTTP request, such as headers, the request query string, and parameters.

It inherits from `http.IncomingMessage.prototype` and therefore contains its fields and methods, aside from adding new ones.

```typescript
// Check if http.IncomingMessage.prototype is the prototype of the request object
http.IncomingMessage.prototype.isPrototypeOf(request); // true
```

The code above results in creating a route `/api/hello` that responds with text “Hello world!”.

### Request

The `request` object contains information about the HTTP request, such as headers, the request query string, and parameters.

It inherits from `http.IncomingMessage.prototype` and therefore contains its fields and methods, aside from adding new ones.

```typescript
// Check if http.IncomingMessage.prototype is the prototype of the request object
http.IncomingMessage.prototype.isPrototypeOf(request); // true
```

We continue to go deeper into the `request` object as the course progresses.

### Response

The `response` object represents the HTTP response that the application sends when receiving an HTTP request.

It inherits from `http.ServerResponse.prototype`: `http.ServerResponse.prototype.isPrototypeOf(response); // true`

Its the most important method is called `send`. It sends the HTTP response so that the client can receive it. The function accepts different types of data: strings, objects (Array included), or Buffers. `send` ends the response process with data, but you can also end it without any data using the `end` function.

The same as with the `request`, we dive more into the `response` object as we go.

### Controllers

A common way of structuring an Express application is called Model-View-Controller (MVC). Some of the key components of MVC are controllers. They contain the logic of the application and deal with handling client requests. Since this course covers TypeScript Express, we use classes. For the sake of readable code, I also create a class for the app instance itself.

```typescript
// src/server.ts
import App from './app';
import PostsController from './posts/posts.controller';

const app = new App(
  [
    new PostsController(),
  ],
  5000,
);

app.listen();
```


