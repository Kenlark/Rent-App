import express from "express";
import * as rentController from "../controllers/rents.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, checkAdmin, rentController.create);

router.get("/", checkAdmin, rentController.getAll);

router.put("/:id", authenticateUser, checkAdmin, rentController.update);

router.delete("/:id", authenticateUser, checkAdmin, rentController.remove);

export default router;
