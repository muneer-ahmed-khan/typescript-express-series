import * as bodyParser from "body-parser";
import express, { Application } from "express";
import * as mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

/**
 * The `App` class is responsible for setting up and running an Express application.
 * It initializes the necessary middlewares, connects to a MongoDB database, sets up error handling, and registers the provided controllers.
 */
class App {
  /**
   * The Express application instance.
   */
  public app: Application;

  /**
   * Initializes the `App` instance by setting up the Express application, connecting to the database, initializing middlewares, initializing error handling, and registering the provided controllers.
   * @param controllers - The controllers to be registered with the Express application.
   */
  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  /**
   * Starts the application server and listens for incoming requests.
   */
  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  /**
   * Initializes the necessary middlewares for the Express application.
   */
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  /**
   * Sets up the error handling middleware for the Express application.
   */
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  /**
   * Registers the provided controllers with the Express application.
   * @param controllers - The controllers to be registered.
   */
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  /**
   * Connects to the MongoDB database using the provided environment variables.
   */
  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => {
        console.error("Database connection error:", error);
      });
  }
}

export default App;
