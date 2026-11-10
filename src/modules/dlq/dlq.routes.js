import express from "express"

import { replayDLController } from "./dlq.controller.js"

const router = express.Router();

router.post("/:dlqId/replay",replayDLController);

export default router;