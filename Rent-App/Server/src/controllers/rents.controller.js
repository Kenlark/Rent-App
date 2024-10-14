import mongoose from "mongoose";

import { formatImage } from "../middlewares/multer.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import * as rentService from "../services/rent.service.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const create = (req, res) => {};
