import ApiError from "../../common/utils/api_errors.js";
import Group from "./group.model.js";
import User from "../../module/auth/auth.model.js";
import Expense from "../expense/expense.model.js";

// create group
const createGroupService = async (data, userId) => {
  if (!data.groupName) throw ApiError.badRequest("Name is required");

  const group = await Group.create({
    groupName: data.groupName,
    ownerId: userId,
    members: [userId],
  });

  return group;
};

// Add members to the group
const addMemberService = async (groupId, userIdToAdd, currentUserId) => {
  // check if group exist or not
  const group = await Group.findById(groupId);
  if (!group) {
    throw ApiError.notFound("Group doesn't exist");
  }

  // check if expense exist or not cause if exist then dont add members
  const expenseExists = await Expense.findOne({
    groupId,
  });

  if (expenseExists) {
    throw ApiError.badRequest("Cannot add members after expense creation");
  }

  // check if user exist in db
  const user = await User.findById(userIdToAdd);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  // check ownership (who is making request to add member as only owner is allowed to add members)
  if (group.ownerId.toString() !== currentUserId)
    throw ApiError.forbidden("Only group owner is allowed to add members");

  // check if user already in the group
  const isMember = group.members.some((memberId) => {
    return memberId.toString() === userIdToAdd;
  });

  if (isMember) throw ApiError.badRequest("User already exists in group");
  // add member
  group.members.push(userIdToAdd);
  await group.save();
  return group;
};

// get all the group associated with the  user
const getAllGroupService = async (userId) => {
  const groups = await Group.find({
    members: userId,
  })
    .populate("ownerId", "name email")
    .populate("members", "name email")
    .populate({
      path: "expenseId",
      populate: [
        {
          path: "paidBy",
          select: "name email",
        },
        {
          path: "settlements.userId",
          select: "name email",
        },
      ],
    });

  // return group even if user is not part of a group
  return groups;
};

// get a particular group
const getGroupByIdservice = async (groupId, userId) => {
  // check if groupId is a valid document
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    throw ApiError.notFound("Group Not Found");
  }
  const group = await Group.findOne({
    _id: groupId,
    members: userId,
  })
    .populate("ownerId", "name email")
    .populate("members", "name email")
    .populate({
      path: "expenseId",
      populate: [
        {
          path: "paidBy",
          select: "name email",
        },
        {
          path: "settlements.userId",
          select: "name email",
        },
      ],
    });

  if (!group) throw ApiError.notFound("Group Not found/not a member");

  return group;
};

// delete a group
const deleteGroupById = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw ApiError.notFound("Group Not found. Please check Id");

  // check if user id and owner id is same
  if (group.ownerId.toString() !== userId)
    throw ApiError.forbidden("Only Owner can delete group");

  return await Group.findByIdAndDelete(groupId);
};

// // FETCH ALL GROUPS
// const findAllGroups = async () => {
//   // find all the groups
//   const groups = await Group.find({})
//     .populate("ownerId", "name email")
//     .populate("members", "name email")
//     .populate({
//       path: "expenseId",
//       populate: [
//         {
//           path: "paidBy",
//           select: "name email",
//         },
//         {
//           path: "settlements.userId",
//           select: "name email",
//         },
//       ],
//     });

//   return groups;
// };

export {
  createGroupService,
  addMemberService,
  getAllGroupService,
  getGroupByIdservice,
  deleteGroupById,
  // findAllGroups,
};
