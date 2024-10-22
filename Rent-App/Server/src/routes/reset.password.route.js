import express from "express";
import {
  requestReset,
  resetPassword,
} from "../controllers/reset.password.controller.js";

const router = express.Router();

router.post("/request-reset", requestReset);

router.post("/reset", resetPassword);

export default router;
