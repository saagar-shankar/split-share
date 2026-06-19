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

// register swagger docs
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Negan Smith
 *               email:
 *                 type: string
 *                 example: smithnegan@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */

// register route
router.post("/register", validate(RegisterDto), controller.register);

//Login swagger docs 18-june-2026
/**
 * @swagger
 * /api/auth/login:
 *    post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: smithnegan@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User Logged successfully
 *       401:
 *         description: Invalid Email or Password
 */

// login route
router.post("/login", validate(LoginDto), controller.login);

// LOGOUT SWAGGER DOCS
/**
 * @swagger
 * /api/auth/logout:
 *    post:
 *      summary: Logout a user
 *      tags: [Authentication]
 *      responses:
 *        200:
 *          description: User Logged Out Successfully!
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: User is not logged in.
 */

//LOGOUT
router.post("/logout", authenticate, controller.logout);

// forgot-password SWAGGER DOCS 18-june-2026
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: User not found
 */

// forgot password
router.post(
  "/forgot-password",
  validate(ForgotPasswordDto),
  controller.forgotPassword,
);

// RESET PASSWORD SWAGGER DOCS 18-June-2026

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *    put:
 *      summary: Reset User Password
 *      tags: [Authentication]
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            schema:
 *              type: string
 *            description: Password Reset Token
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - password
 *              properties:
 *                password:
 *                  type: string
 *                  minLength: 8
 *                  example: password12345
 *      responses:
 *        200:
 *          description: Password updated successfully
 *        401:
 *          description: Reset Token Expired
 */

// reset password
router.put(
  "/reset-password/:token",
  validate(ResetPasswordDto),
  controller.resetPassword,
);

// VERIFY-EMAIL SWAGGER DOCS 18-june-2026
/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *    get:
 *      summary: Verify user's email address
 *      tags: [Authentication]
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: Verify User email token
 *      responses:
 *        200:
 *          description: Email Verified Successfully
 *        400:
 *          description: Invalid or expired verification token
 */

// verify email
router.get("/verify-email/:token", controller.verifyEmail);

// GET PROFILE SWAGGER DOCS 18-JUNE-2026
/**
 * @swagger
 * /api/auth/me:
 *    get:
 *      summary: Get User Profile
 *      tags: [Authentication]
 *      responses:
 *        200:
 *          description: User profile
 *        401:
 *          description: User not authenticated
 *
 */

// get profile route
router.get("/me", authenticate, controller.getMe);

// REFRESH-TOKEN SWAGGER UI 18-JUNE-2026
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token stored in cookie
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */

// refreshToken
router.post("/refresh-token", controller.refresh);

// SEARCH USER SWAGGER DOCS 19-june-2026
/**
 * @swagger
 * /api/auth/search-user:
 *    get:
 *      summary: Search User by Name or Email
 *      tags: [Authentication]
 *      parameters:
 *        - in: query
 *          name: query
 *          required: true
 *          schema:
 *            type: string
 *          description: Name or Email to Search
 *          example: negan
 *      responses:
 *        200:
 *          description: User Found Successfully
 *        404:
 *          description: User Not Found
 *
 */

// SEARCH USER
router.get(
  "/search-user",
  validate(SearchDto, "query"),
  authenticate,
  controller.search,
);

// get all users SWAGGER DOCS 19-JUNE-2026
/**
 * @swagger
 * /api/auth/:
 *    get:
 *      summary: Fetch All Users
 *      tags: [Authentication]
 *      responses:
 *        200:
 *          description: Users Found Successfully
 *
 */

// get all users
router.get("/", authenticate, controller.getUsers);

export default router;
