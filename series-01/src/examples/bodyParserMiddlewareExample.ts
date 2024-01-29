import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.post("/", (request, response) => {
  response.send(request.body);
});

app.listen(3000);
