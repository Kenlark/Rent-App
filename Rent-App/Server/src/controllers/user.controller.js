import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service.js";
import { UnauthenticatedError } from "../errors/index.js";
import z from "zod";

const register = async (req, res) => {
  try {
    const userData = RegisterUserSchema.parse(req.body);

    const existingUser = await userService.get({ email: userData.email });
    if (existingUser) {
      throw new UnauthenticatedError("L'email est déjà associé à un compte");
    }

    const user = await userService.create(userData);
    const token = user.createAccessToken();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.errors });
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de l'inscription." });
  }
};

const login = async (req, res) => {
  const user = await userService.get({ email: req.body.email });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Votre Email ou votre mot de passe ne correspond pas" });
  }

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Votre Email ou votre mot de passe ne correspond pas" });
  }

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { UserId: user._id }, token });
};

const getAll = async (req, res) => {
  try {
    const allUsers = await userService.getAll();
    res.status(StatusCodes.OK).json({ allUsers });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Erreur lors de la récupération de tous les utilisateurs",
    });
  }
};

export { login, register, getAll };
