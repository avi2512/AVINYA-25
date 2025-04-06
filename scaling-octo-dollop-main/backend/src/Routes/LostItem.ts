
import express, { Request, Response } from "express";
import { LostItemModel } from "../db/db";
import { middleware } from "../Middlewares/Middleware";

const router = express.Router();

router.post("/",middleware, async (req: Request, res: Response): Promise<void> => {
  
  //@ts-ignore
  const userId = req.userId;

  const { title, description, location, status, imageUrl, coordinates } = req.body;

  if (!title || !location || !status ) {
    res.status(400).json({ message: "Title, location, and status are required" });
    return;
  }

  try {
    const lostItem = await LostItemModel.create({
      title,
      description,
      location,
      status,
      studentId : userId,
      imageUrl,
      coordinates
    });

    res.json({ message: "Lost item reported successfully", lostItem });
  } catch (error: any) {
    res.status(500).json({ message: "Error reporting lost item", error: error.message });
  }
});

{/*
  
  {
   "title":"Found a Wallet",
   "description":"found a wallet near smart block black leather wallet with 700 rs cash inside",
   "location":"near smart block",
   "status":"found"

   
} */}


router.get("/lost-items", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await LostItemModel.find({ status: 'lost' }).sort({ date: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ error: 'Error fetching lost items' });
  }
});




router.get("/found-items", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await LostItemModel.find({ status: 'found' }).sort({ date: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ error: 'Error fetching lost items' });
  }
});

router.get("/items", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await LostItemModel.find({}).sort({ date: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ error: 'Error fetching lost items' });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await LostItemModel.findById(req.params.id);
    res.json(item);
  } catch (error: any) {
    console.error('Error fetching lost item:', error);
    res.status(500).json({ error: 'Error fetching lost item' });
  }
});


export default router;


