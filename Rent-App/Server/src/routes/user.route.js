import express from "express";
import * as userController from "../controllers/user.controller.js";
import { LoginUserSchema, RegisterUserSchema } from "../auth/users.schema.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", validate(LoginUserSchema), userController.login);
router.get("/", userController.getAll);

export default router;
