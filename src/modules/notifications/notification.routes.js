import express from "express"
import { createNotification } from "./notification.controller.js"

const router = express.Router();

router.post("/",createNotification);

export default router;