import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service.js";
import { UnauthenticatedError } from "../errors/index.js";
import usersModel from "../models/users.model.js";

const register = async (req, res) => {
  const { email } = req.body;

  const existingUser = await userService.get({ email });
  if (existingUser) {
    throw new UnauthenticatedError("L'email est déjà associé à un compte");
  }

  // Créez un nouvel utilisateur
  const user = await userService.create(req.body);
  const token = user.createAccessToken();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const user = await userService.get({ email: req.body.email });

  if (!user) {
    throw new UnauthenticatedError("Identifiants invalides");
  }

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Identifiants invalides");
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
