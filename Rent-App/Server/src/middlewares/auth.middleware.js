import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.isLoggedIn = false; // Utilisateur non connecté
    req.user = null; // Pas d'utilisateur
    return next(); // Continuez la requête
  }

  try {
    const decoded = verifyJWT(token); // Vérifiez le JWT

    req.user = {
      userID: decoded.userID,
      role: decoded.role,
    };
    req.isLoggedIn = true; // Utilisateur connecté
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    req.isLoggedIn = false;
    req.user = null;
    return next(); // Continuez la requête même en cas d'erreur
  }
};

export default authenticateUser;
