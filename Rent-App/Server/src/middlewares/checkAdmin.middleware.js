import { StatusCodes } from "http-status-codes";

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "Accès refusé, action réservée aux administrateurs" });
  }
};

export default checkAdmin;
