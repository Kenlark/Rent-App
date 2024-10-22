import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.API_KEY_RESEND);

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Utilisateur non trouvé" });
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30min",
  });

  console.log("Token de réinitialisation généré:", token);

  user.resetPasswordToken = token;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "kenzokerachi@hotmail.fr", // mettre le nom de domaine ici plus tard
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe: </p><a href="${resetLink}">Réinitiliser mon mot de passe</a>`,
    });

    res.status(StatusCodes.OK).json({
      msg: "E-mail de réinitialisation de l'e-mail",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Erreur lors de l'envoi de l'e-mail",
      error: error.message,
    });
  }
};

const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("Token de réinitialisation manquant");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token invalide ou expiré");
  }

  const user = await User.findById(decoded.userID);

  if (!user || user.resetPasswordToken !== token) {
    throw new Error("Token invalide ou expiré");
  }

  // Hachez le nouveau mot de passe
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Mettez à jour le mot de passe de l'utilisateur
  user.password = hashedPassword;

  user.resetPasswordToken = undefined; // Réinitialiser le token
  await user.save();

  return "Mot de passe réinitialiser avec succès";
};

export { requestPasswordReset, resetPassword };
