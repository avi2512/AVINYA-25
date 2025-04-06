import express, { Request, Response } from "express";
import { UserModel } from "../../db/db";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const router = express.Router();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ 
        email 
    });

    if (!user) {
       res.status(403).json({ message: "Invalid Credentials" });
       return ;
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(403).json({ message: "Erong Password" });
      return;
    }

    const userId = user._id;

    
    const token = jwt.sign(
        {
          userId,
        },
        JWT_SECRET
      );


    res.json({ token : token });

  } catch (e: any) {

    res.status(500).json({ 
        message: "Error", 
        error: e.message
     });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching lost user:', error);
    res.status(500).json({ error: 'Error fetching lost user' });
  }
});


export default router;

