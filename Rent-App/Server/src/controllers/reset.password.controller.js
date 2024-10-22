import {
  requestPasswordReset,
  resetPassword as resetPasswordService,
} from "../services/reset.password.service.js";
import { StatusCodes } from "http-status-codes";

const requestReset = async (req, res) => {
  try {
    console.log("Demande de réinitialisation reçue:", req.body);
    await requestPasswordReset(req, res);
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation:",
      error.message
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Erreur lors de la réinitialisation",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("Réinitialisation du mot de passe pour le token:", token);

  try {
    const message = await resetPasswordService(token, newPassword);
    res.status(StatusCodes.OK).json({ msg: message });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe:",
      error.message
    );
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

export { requestReset, resetPassword };
