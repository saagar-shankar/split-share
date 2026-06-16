// this will only control the flow of service like which route will call which service

import ApiResponse from "../../common/utils/api_response.js";
import * as authService from "../auth/auth.service.js";
import cookie from "cookie-parser";

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  console.log("Register URL hit");
  return ApiResponse.created(res, "User created successfully!", user);
};

// pass the data to login service(OLDER LOGIN CONTROLLER)
// const login = async (req, res) => {
//   console.log("Login route hit...");
//   const user = await authService.loginUser(req.body);
//   return ApiResponse.created(res, "User logged in...", user);
// };

const login = async (req, res) => {
  console.log("*******Login Route Hit**********");
  const { user, accessToken, refreshToken } = await authService.loginUser(
    req.body,
  );

  // store the cookies and send as response
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  // store refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
  });

  ApiResponse.ok(res, "User Logged-in", { user, accessToken });
};

// LOGOUT
const logout = async (req, res) => {
  console.log("**********Logout Route hit**********\n");
  const user = await authService.logoutService(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "User Logged out", user);
};

// getMe controller
const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User Profile", user);
};

// verify email controller
const verifyEmail = async (req, res) => {
  const token = req.params.token;
  const user = await authService.verifyEmail(token);
  ApiResponse.ok(res, "Email-verified", user);
};

const forgotPassword = async (req, res) => {
  // since forgot password is used for user who are not logged in so we use body
  const user = await authService.forgetPasswordService(req.body.email);
  ApiResponse.ok(res, "Reset-password link send", user);
};

const resetPassword = async (req, res) => {
  const token = req.params.token;
  const user = await authService.resetPasswordService(token, req.body.password);
  ApiResponse.ok(res, "Password updated successfully", user);
};

// const refresh = async (req, res) => {
//   // const token = req.params?.refreshToken;
//   const token = req.cookies.refreshToken;
//   const user = await authService.refreshTokenService(token);
//   ApiResponse.ok(res, "Token Refreshed", user);
// };

const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  const { accessToken, refreshToken, userObj } =
    await authService.refreshTokenService(token);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.ok(res, "Token Refreshed", userObj);
};

// SEARCH USERS controller
const search = async (req, res) => {
  console.log("******SEARCH ROUTE HIT******\n");
  const { query } = req.query;
  const users = await authService.searchUserService(query);
  ApiResponse.ok(res, "User Found", users);
};

// get all user created 12-6-2026 later to be deleted for privacy
const getUsers = async (req, res) => {
  console.log("****** Get All user ROUTE HIT ******\n");
  const users = await authService.getAllUsers();
  ApiResponse.ok(res, "Users Exist in the System now", users);
};

export {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  search,
  getUsers,
};
