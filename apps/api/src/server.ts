import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import ErrorMiddleware from "middleware/ErrorMiddleware";

export const createServer = (): Express => {
  const app: Express = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors());

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is running" });
  });

  app.use(ErrorMiddleware);

  return app;
};
