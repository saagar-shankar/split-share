import express from "express";
import * as expenseController from "./expense.controller.js";
import CreateExpenseDto from "../expense/dto-expense/createExpense.dto.js";
import authenticate from "../../module/auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";

const router = express.Router();
// create expense route
router.post(
  "/create-expense/:groupId",
  authenticate,
  validate(CreateExpenseDto),
  expenseController.expenseCreation,
);

// fetch  expense route
router.get(
  "/fetch-expense/:groupId",
  authenticate,
  expenseController.findExpense,
);

// settlement route
router.patch(
  "/settlements/:groupId",
  authenticate,
  expenseController.settlements,
);

export default router;
