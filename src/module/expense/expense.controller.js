import ApiResponse from "../../common/utils/api_response.js";
import User from "../auth/auth.model.js";
import Group from "../group/group.model.js";
import Expense from "./expense.model.js";
import * as expenseService from "./expense.service.js";

// create expense controller
const expenseCreation = async (req, res) => {
  const groupId = req.params.groupId;
  const expense = await expenseService.createExpense(
    groupId,
    req.body,
    req.user.id,
  );
  ApiResponse.created(res, "Expense Created Successfully", expense);
};

// find the expense
const findExpense = async (req, res) => {
  const expense = await expenseService.getExpenseService(req.params.groupId);
  ApiResponse.ok(res, "Expense Found", expense);
};

// controller for settlement
const settlements = async (req, res) => {
  // console.log("****************Settlement Route Hit****************\n");
  const settledGroup = await expenseService.settlementService(
    req.params.groupId,
    req.user.id,
  );

  // ApiResponse.ok(res, "Pending dues Settled", settledGroup);
  ApiResponse.ok(
    res,
    `Successfully paid ₹${settledGroup.amountPaid} to ${settledGroup.paidTo.name}`,
    settledGroup,
  );
};

export { expenseCreation, findExpense, settlements };
