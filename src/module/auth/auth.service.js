import ApiError from "../../common/utils/api_errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "../../module/auth/auth.model.js";
import crypto from "crypto";

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";

// ------------------------
// hash the token utility  |
// ------------------------

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// -----------------
// REGISTER SERVICE |
// -----------------
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  // if user already exist the throw error
  if (existingUser)
    throw ApiError.conflict("User with this email already exists.");

  // get verification token
  const { rawToken, hashedToken } = generateResetToken();
  // if user is new then store their data in db
  // here rawToken will be send in email for email verification
  // rawToken will be compared to hashed token for verification
  const user = await User.create({
    name,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  // TODO : send an email to user with rawToken
  try {
    await sendVerificationEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }
  // we will verify email later as we learn and move forward

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.verificationTokenExpires;

  return userObj;
};

// lets create login service
const loginUser = async ({ email, password }) => {
  // console.log("Login route hit...");
  const userExists = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  // if user dont exist
  if (!userExists) {
    throw ApiError.unauthorize("Invalid email or password");
  }

  // we will uncomment it once we have done email verification in our register service
  if (!userExists.isVerified) {
    throw ApiError.forbidden("Please verify email before login");
  }

  // verify password
  const passwordVerified = await userExists.comparePassword(password);
  if (!passwordVerified) {
    throw ApiError.unauthorize("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    id: userExists._id,
    email: userExists.email,
  });
  const refreshToken = generateRefreshToken({
    id: userExists._id,
    email: userExists.email,
  });

  // BEFORE SAVING REFRESH TOKEN WE HASH IT
  userExists.refreshToken = hashToken(refreshToken);

  // now save in DB but we dont want mongoose to restart all the checks so we will do validateBeforeSave
  await userExists.save({ validateBeforeSave: false });

  // we will add refreshToken and accessToken later
  // const user = userExists.toObject();
  // delete user.password;
  // delete user.refreshToken;

  const user = userExists.toObject();
  delete user.password;
  delete user.refreshToken;

  // here we can write code to store tokens incookies
  return { user, accessToken, refreshToken };
};

// LETS WRITE REFRESH SERVICE

const refreshTokenService = async (token) => {
  if (!token) throw ApiError.unauthorize("Refresh Token Missing");
  // now verify refresh token from our secret token
  const verifiedToken = verifyRefreshToken(token);

  // check if token is associated with user or not
  const user = await User.findById(verifiedToken.id).select("+refreshToken");
  if (!user) {
    throw ApiError.unauthorize("User not found");
  }
  // LOGS FOR REFERENCE
  // console.log("Incoming Refresh Token:\n", token);
  // console.log("Incoming Hash:\n", hashToken(token));
  // console.log("DB Hash:\n", user.refreshToken);
  // check if refresh token matches our hashed refreshToken(in DB)
  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorize("Invalid Refresh Token");
  }

  // now return new accessToken and refreshToken
  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  // hash the token before save
  user.refreshToken = hashToken(refreshToken);

  // save it in db before re-running all the check by mongoose
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.accessToken;

  return { accessToken, refreshToken, userObj };
};

// lets write logout service
const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// LETS WRITE FORGOT PASSWORD SERVICE
const forgetPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("Accound not found");

  // else user email is valid so send them some token to verify that they are legitimate user
  const { rawToken, hashedToken } = generateResetToken();

  // inside resetPassword token store hashed Token in that field in DB
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};

// LETS write reset Password service
const resetPasswordService = async (token, newPassword) => {
  const resetPassword = hashToken(token);

  // const user = await User.findOne({ resetPasswordToken: resetPassword });
  const user = await User.findOne({
    resetPasswordToken: resetPassword,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw ApiError.unauthorize("Invalid or Expired Reset Token");

  // else token is authorized
  user.password = newPassword;

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.refreshToken = null;
  // const accessToken = generateAccessToken({ id: user._id });
  // const refreshToken = generateRefreshToken({ id: user._id });

  // user.refreshToken = hashToken(refreshToken);
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  // delete userObj.refreshToken;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;

  return { user: userObj };
};

// get user Profile
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User Not Found");
  return user;
};

// verify Email
// verify token k behalf pe hoga
const verifyEmail = async (token) => {
  // console.log("Verify email route hit");
  const hashedToken = hashToken(token);
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: {
      $gt: Date.now(),
    },
  }).select("+verificationToken +verificationTokenExpires");
  // this means token invalid
  if (!user) throw ApiError.notFound("Invalid token/user");

  // if token is valid
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.verificationToken;
  delete userObj.verificationTokenExpires;

  return userObj;
};

const searchUserService = async (query) => {
  // this will only return those fields that matches and only return id,name, email
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).select("_id name email");

  // find query never returns null, it returns [] if not found
  if (users.length == 0) throw ApiError.notFound("User not found");
  return users;
};

// get all the user service later to be deleted to maintain privacy
const getAllUsers = async (userId) => {
  // console.log("***** GET ALL USERS ROUTE HIT *****\n");
  const users = await User.find({}).select("name email");
  return users;
};

export {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutService,
  resetPasswordService,
  getMe,
  verifyEmail,
  forgetPasswordService,
  searchUserService,
  getAllUsers,
};
