import ApiError from "../../common/utils/api_errors.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

// lets authenticate
const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.includes("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  console.log("Authorization----------->:", req.headers.authorization);
  // console.log("Cookies-------->:", req.cookies);
  if (!token) throw ApiError.notFound("Not Authenticated. Please Login");

  // now verify the token

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);

  if (!user) throw ApiError.notFound("User no longer exists");

  // now if we reached here this means token is valid and user exists

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  next();
};

export default authenticate;
