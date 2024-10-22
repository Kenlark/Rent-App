import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token; // Récupère le token du cookie

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentification invalide" });
  }

  try {
    const decoded = verifyJWT(token); // Vérifie le token

    req.user = {
      userID: decoded.userID,
      role: decoded.role,
    };

    req.isLoggedIn = true;

    next(); // Passe au middleware suivant
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentification invalide" });
  }
};

export default authenticateUser;
