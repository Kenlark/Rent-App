import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.API_KEY_RESEND);

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  console.log("Tentative d'envoi d'e-mail à:", email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log("Utilisateur non trouvé pour l'e-mail:", email);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Utilisateur non trouvé" });
  }

  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30min",
  });

  console.log("Token de réinitialisation généré:", token);

  user.resetPasswordToken = token;
  console.log("Assignation du token:", token);
  await user.save();
  console.log("Token après sauvegarde:", user.resetPasswordToken);

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  console.log("Lien de réinitialisation envoyé:", resetLink);

  try {
    await resend.emails.send({
      from: "kenzokerachi@hotmail.fr", // mettre le nom de domaine ici plus tard
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe: </p><a href="${resetLink}">Réinitiliser mon mot de passe</a>`,
    });

    console.log("E-mail de réinitialisation envoyé avec succès à:", email);
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
    console.log("Token décodé:", decoded);
  } catch (error) {
    throw new Error("Token invalide ou expiré");
  }

  const user = await User.findById(decoded.userID);
  console.log("Utilisateur trouvé pour la réinitialisation:", user);
  console.log("Token de l'utilisateur:", user.resetPasswordToken); // Pour débogage

  if (!user || user.resetPasswordToken !== token) {
    throw new Error("Token invalide ou expiré");
  }

  // Ajoute un log pour voir le mot de passe avant le hachage
  console.log("Mot de passe avant le hachage:", newPassword);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  console.log("Mot de passe haché:", hashedPassword);

  user.password = hashedPassword; // Assurez-vous d'utiliser le bon mot de passe
  user.resetPasswordToken = undefined; // Réinitialiser le token
  await user.save();

  console.log(
    "Mot de passe réinitialisé avec succès pour l'utilisateur:",
    user.email
  );
  return "Mot de passe réinitialisé avec succès";
};

export { requestPasswordReset, resetPassword };
