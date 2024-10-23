import jwt from "jsonwebtoken";

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { verifyJWT };
