import { Router } from "express";
import RegisterDto from "./dto/register.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import LoginDto from "./dto/login.dto.js";
import ForgotPasswordDto from "./dto/forgot-password.dto.js";
import ResetPasswordDto from "./dto/reset-password.dto.js";
import * as controller from "../auth/auth.controller.js";
import authenticate from "../auth/auth.middleware.js";
import SearchDto from "./dto/search-user.dto.js";

const router = Router();

// register route
router.post("/register", validate(RegisterDto), controller.register);
// login route
router.post("/login", validate(LoginDto), controller.login);
//LOGOUT
router.post("/logout", authenticate, controller.logout);
// forgot password
router.post(
  "/forgot-password",
  validate(ForgotPasswordDto),
  controller.forgotPassword,
);
// reset password
router.put(
  "/reset-password/:token",
  validate(ResetPasswordDto),
  controller.resetPassword,
);
// get testing route
// router.get("/testing", (req, res) => {
//   console.log("Testing routed hit...");
//   return res.status(200).json({ message: "Route is working" });
// });

// verify email
router.get("/verify-email/:token", controller.verifyEmail);
// get profile route
router.get("/me", authenticate, controller.getMe);
// refreshToken
router.post("/refresh-token", controller.refresh);

// SEARCH USER
router.get(
  "/search-user",
  validate(SearchDto, "query"),
  authenticate,
  controller.search,
);

// get all users
router.get("/", authenticate, controller.getUsers);

export default router;
