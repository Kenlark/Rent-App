import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service.js";
import { UnauthenticatedError } from "../errors/index.js";
import { RegisterUserSchema } from "../auth/users.schema.js";
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: "strict",
    });

    res.status(StatusCodes.CREATED).json({
      user: {
        UserId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        birthDate: user.birthDate,
        address: user.address,
        postalCode: user.postalCode,
        city: user.city,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.errors });
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de l'inscription.", error: error.message });
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

  res.cookie("token", token, {
    httpOnly: true, // Sécurise le cookie (non accessible via JavaScript)
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    sameSite: "strict", // Protection contre les attaques CSRF
  });

  res.status(StatusCodes.OK).json({
    user: {
      UserId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
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

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userService.getSingleUser(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    res.status(StatusCodes.OK).json({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur du serveur", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token"); // Supprime le cookie
  res.status(StatusCodes.OK).json({ msg: "Deconnexion reussie" });
};

export { login, register, getAll, getMe, logout };
