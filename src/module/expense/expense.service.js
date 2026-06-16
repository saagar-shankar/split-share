import Group from "../group/group.model.js";
import ApiError from "../../common/utils/api_errors.js";
import User from "../auth/auth.model.js";
import Expense from "./expense.model.js";

// ------------------------
// create expense service  |
// ------------------------
const createExpense = async (groupId, data, userId) => {
  // find group
  const group = await Group.findById(groupId);
  if (!group) {
    throw ApiError.notFound("Group does not exist");
  }
  // check if userId is owner or not?
  if (userId !== group.ownerId.toString())
    throw ApiError.forbidden("Only group owner can create expense");

  // destructure the object to obtain these fields
  const { description, totalExpenditure, paidBy } = data;
  // check whether paidBy id is a member of group or not

  const isMember = group.members.some((memberId) => {
    return memberId.toString() === paidBy;
  });

  // if paidBy id is a member then only he can pay
  if (!isMember) throw ApiError.notFound("Member who paid isn't part of Group");

  // check if user exist or not
  const payer = await User.findById(paidBy);

  if (!payer) throw ApiError.notFound("Payer Doesn't exist");

  // check if expense already exist for same id
  const isExpenseExisting = await Expense.findOne({ groupId });
  if (isExpenseExisting) throw ApiError.badRequest("Expense Already Exist");

  // find out who actually didnt paid(for expense group)
  const membersToSettle = group.members.filter((memberId) => {
    return memberId.toString() !== paidBy;
  });

  // total members in group so we can split money
  // const totalMembers = group.members.length;
  const shareAmount = Number(
    (totalExpenditure / group.members.length).toFixed(2),
  );
  // mark them unpaid with their share
  const settlements = membersToSettle.map((membersId) => {
    return {
      userId: membersId,
      amount: shareAmount,
      status: "PENDING",
      paidAt: null,
    };
  });
  // const settlements = membersToSettle.map((membersId) => {
  //   return {
  //     userId: membersId,
  //     status: "PENDING",
  //   };
  // });

  const expense = await Expense.create({
    groupId,
    description,
    totalExpenditure,
    paidBy,
    settlements,
  });

  // give refernce of expense id to group schema
  console.log("Assigned expense:", expense._id);

  group.expenseId = expense._id;
  await group.save();
  console.log("Group after save:", group);

  await expense.populate([
    {
      path: "paidBy",
      select: "name email",
    },
    {
      path: "settlements.userId",
      select: "name email",
    },
  ]);

  return expense;
};

// -----------------
// get the expense  |
// -----------------

const getExpenseService = async (groupId) => {
  const expense = await Expense.findOne({ groupId });
  if (!expense) throw ApiError.notFound("Expense not found");

  return expense;
};

// ---------------------
// settlement service   |
// ---------------------

const settlementService = async (groupId, userId) => {
  // check if group exist by checking groupId
  const group = await Group.findById(groupId);
  if (!group) {
    throw ApiError.notFound("Group Not found");
  }
  // if it exist check if the settlement status is active or paid
  if (group.status === "SETTLED") {
    throw ApiError.badRequest("Group's Expense already Settled");
  }
  // check if userId part of group or not
  const user = await Group.findOne({
    _id: groupId,
    members: userId,
  });

  if (!user) {
    throw ApiError.notFound("You must be part of group to access group");
  }

  // find expense (cause if expense didnt exust then whats the point of paying)
  const expense = await Expense.findOne({ groupId });
  if (!expense) {
    throw ApiError.badRequest("No expense exist yet. come back later");
  }

  // check if user has paid already cause we dont want duplicate payment
  const settlement = expense.settlements.find((settlement) => {
    return settlement.userId.toString() === userId;
  });

  if (!settlement) {
    throw ApiError.notFound("No settlement found for this user");
  }

  // if paid
  if (settlement.status === "PAID") {
    throw ApiError.forbidden("You have already Paid!");
  }
  // store the paid status
  settlement.status = "PAID";
  settlement.paidAt = new Date();
  // save
  await expense.save();
  // check if all dues paid. if yes then mark group as settled
  const allPaid = expense.settlements.every((settlement) => {
    return settlement.status === "PAID";
  });
  // if everyone paid
  if (allPaid) {
    group.status = "SETTLED";
    await group.save();
  }

  // populate name to make it more appealing
  await expense.populate([
    {
      path: "paidBy",
      select: "name email",
    },
    {
      path: "settlements.userId",
      select: "name email",
    },
  ]);
  // return
  // return {
  //   expense,
  //   groupStatus: group.status,
  // };
  return {
    settledBy: settlement.userId,
    amountPaid: settlement.amount,
    paidTo: expense.paidBy,
    expense,
    groupStatus: group.status,
  };
};

export { createExpense, getExpenseService, settlementService };
