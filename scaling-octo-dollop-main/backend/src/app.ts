 
import express from "express";

import usersRouter from "./Routes/Auth/Signup";
import loginRouter from "./Routes/Auth/Login";
import lostItemRouter from "./Routes/LostItem";


const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/signup", usersRouter); 
app.use("/login", loginRouter);
app.use("/items", lostItemRouter);






export default app;
