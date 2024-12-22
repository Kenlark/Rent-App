import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("Token manquant dans les cookies.");
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Non autorisé. Token manquant." });
  }

  try {
    const decoded = verifyJWT(token);
    console.log("Token décodé :", decoded);
    req.user = { userID: decoded.userID, role: decoded.role };
    next();
  } catch (error) {
    console.log("Erreur lors de la vérification du token :", error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Non autorisé. Token invalide." });
  }
};

export default authenticateUser;
