import { StatusCodes } from "http-status-codes";
import { RENT_STATUS } from "../utils/constants.js";

const getRentStatus = (req, res) => {
  try {
    res.status(StatusCodes.OK).json(RENT_STATUS);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Erreur lors de la récupération des status" });
  }
};

export default getRentStatus;
