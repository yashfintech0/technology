import asyncHandler from "@utils/asynHandler";
import { Request, Response } from "express";

export const user = asyncHandler((req: Request, res: Response) => {
  return res.status(200).json("Server is running");
});
