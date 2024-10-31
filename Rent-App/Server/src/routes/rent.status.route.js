import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";
import getRentStatus from "../controllers/rent.status.controller.js";

const router = express.Router();

router.get("/", authenticateUser, checkAdmin, getRentStatus);

export default router;
