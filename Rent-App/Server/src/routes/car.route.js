import express from "express";
import * as carsController from "../controllers/cars.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  checkAdmin,
  upload.array("images"),
  carsController.create
);

router.get("/", carsController.getAll);
router.get("/:id", carsController.getById);

router.put("/:id", authenticateUser, checkAdmin, carsController.update);

router.delete("/:id", authenticateUser, checkAdmin, carsController.remove);

export default router;
