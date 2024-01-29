import * as express from "express";

const app = express();

app.get("*", (request, response) => {
  response.send({
    hostname: request.hostname,
    path: request.path,
    method: request.method,
  });
});

app.listen(3000);
