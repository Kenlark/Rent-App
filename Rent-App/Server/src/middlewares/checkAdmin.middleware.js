import { StatusCodes } from "http-status-codes";

const checkAdmin = (req, res, next) => {
  // Permettre l'accès public pour les méthodes GET
  if (req.method === "GET") {
    return next();
  }

  // Vérifie si l'utilisateur est connecté
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message:
        "Accès refusé : vous devez être connecté pour effectuer cette action.",
    });
  }

  // Vérifie si l'utilisateur est admin pour les autres méthodes
  if (req.user.role !== "admin") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message:
        "Accès interdit : seuls les administrateurs peuvent effectuer cette action.",
    });
  }

  next();
};

export default checkAdmin;
