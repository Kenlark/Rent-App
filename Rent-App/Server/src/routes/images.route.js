import express from "express";
import * as rentController from "../controllers/images.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(upload.array("image", 10), rentController.create)
  .get(rentController.getAll);

router.delete("/:id", rentController.remove);

export default router;
