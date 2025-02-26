import { httpStatusCode } from "@customtype/http";
import ApiError from "@utils/apiError";
import { API_KEY } from "@utils/index";
import { NextFunction, Request, Response } from "express";

export const apiMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey)
    throw new ApiError("Please provided api key", httpStatusCode.UNAUTHORIZED);
  if (apiKey !== API_KEY) {
    throw new ApiError("You are unauthorized.", httpStatusCode.BAD_REQUEST);
  }
  next();
};
