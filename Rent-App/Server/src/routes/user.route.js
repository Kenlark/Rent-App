import express from "express";
import * as userController from "../controllers/user.controller.js";
import { LoginUserSchema, RegisterUserSchema } from "../auth/users.schema.js";
import validate from "../middlewares/validation.middleware.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(RegisterUserSchema), userController.register);
router.post("/login", validate(LoginUserSchema), userController.login);

router.get("/me", authenticateUser, userController.getMe);

router.get("/", userController.getAll);
router.post("/logout", userController.logout);

router.post("/check-email", userController.checkEmail);

export default router;
