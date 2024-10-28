import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentification invalide" });
  }

  try {
    const decoded = verifyJWT(token);

    req.car = {
      car: decoded._id,
      userID: decoded.userID,
    };

    req.user = {
      userID: decoded.userID,
      role: decoded.role,
    };

    req.isLoggedIn = true;
    next();
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentification invalide" });
  }
};

export default authenticateUser;
