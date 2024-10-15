import { UnauthenticatedError } from "../errors/index.js";
import { verifyJWT } from "../utils/token.utils.js";
import User from "../models/users.model.js";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentification invalide");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJWT(token);

    req.user = {
      userId: decoded.userID,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentification invalide");
  }
};

export default authenticateUser;
