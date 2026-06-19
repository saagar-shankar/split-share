import express from "express";
import * as expenseController from "./expense.controller.js";
import CreateExpenseDto from "../expense/dto-expense/createExpense.dto.js";
import authenticate from "../../module/auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/expense/create-expense/{groupId}:
 *   post:
 *     summary: Create expense for a group
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID for creating expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - totalExpenditure
 *               - paidBy
 *             properties:
 *               description:
 *                 type: string
 *                 example: Bali Bike Expense
 *               totalExpenditure:
 *                 type: number
 *                 example: 15000
 *               paidBy:
 *                 type: string
 *                 example: 9b9a5555ac5a777cf3333a6a
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Expense already exists for this group
 *       401:
 *         description: Not authenticated. Please login
 *       404:
 *         description: Group not found, payer not found, or payer is not a group member
 *       412:
 *         description: Only group owner can create an expense
 */

// create expense route
router.post(
  "/create-expense/:groupId",
  authenticate,
  validate(CreateExpenseDto),
  expenseController.expenseCreation,
);

// FIND EXPENSE OF A GROUP-- SWAGGER DOCS -- 19-JUNE-2026

/**
 * @swagger
 * /api/expense/fetch-expense/{groupId}:
 *    get:
 *      summary: Fetch the expense using groupId
 *      tags: [Expenses]
 *      parameters:
 *        - in: path
 *          name: groupId
 *          required: true
 *          schema:
 *             type: string
 *          description: Group Id to fetch the expense
 *      responses:
 *        200:
 *          description: Expense found successfully.
 *        404:
 *          description: Expense not found
 *        401:
 *          description: Not authenticated. please login first
 *
 */

// fetch  expense route
router.get(
  "/fetch-expense/:groupId",
  authenticate,
  expenseController.findExpense,
);

// SETTLEMENT ROUTE SWAGGER DOCS -- 19-JUNE-2026
/**
 * @swagger
 * /api/expense/settlements/{groupId}:
 *   patch:
 *     summary: Settle expense dues for the authenticated user
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID for settlement
 *     responses:
 *       200:
 *         description: Expense settled successfully
 *       400:
 *         description: Expense already settled or no expense exists for this group
 *       401:
 *         description: Not authenticated. Please login
 *       404:
 *         description: Group not found, user not a member, or no settlement found
 *       412:
 *         description: User has already paid the settlement
 */

// settlement route
router.patch(
  "/settlements/:groupId",
  authenticate,
  expenseController.settlements,
);

export default router;
