import { UnauthenticatedError } from "../errors/index.js";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token; // Récupère le token du cookie

  if (!token) {
    throw new UnauthenticatedError("Authentification invalide");
  }

  try {
    const decoded = verifyJWT(token); // Vérifie le token

    req.user = {
      userId: decoded.userID,
      role: decoded.role,
    };

    next(); // Passe au middleware suivant
  } catch (error) {
    throw new UnauthenticatedError("Authentification invalide");
  }
};

export default authenticateUser;
