
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}




export function middleware(req: Request, res: Response, next: NextFunction) {
const token = req.headers["authorization"] || "";

   const decoded = jwt.verify(token , JWT_SECRET)

   if(decoded) {
    // @ts-ignore
    req.userId = decoded.userId;

   }else {
    res.status(403).json({
        message : "unauthorized"
    })
   }


  next()
}