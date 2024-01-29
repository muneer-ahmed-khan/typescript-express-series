import * as express from "express";

const app = express();

const router = express.Router();

router.get("/", (request, response) => {
  response.send("Hello world!");
});

router.get("/hello", (request, response) => {
  response.send("Hello world!");
});

app.use("/api", router);

app.listen(3000);
