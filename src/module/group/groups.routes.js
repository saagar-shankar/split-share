import express from "express";
import authenticate from "../auth/auth.middleware.js";
import GroupsDto from "./DtoGroup/groups.dto.js";
import AddMembersDto from "./DtoGroup/addMembers.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import * as groupController from "./groups.controller.js";

const router = express.Router();

// get all groups associated with the member
router.get("/", authenticate, groupController.getGroups);

// fetch all the groups
// router.get("/fetch-groups", authenticate, groupController.fetchGroups);

// get groupBy Id
router.get("/:groupId", authenticate, groupController.getGroupById);

// create group
router.post(
  "/create-group",
  authenticate,
  validate(GroupsDto),
  groupController.createGroup,
);

// add members to group
router.post(
  "/:groupId/members",
  authenticate,
  validate(AddMembersDto),
  groupController.addMembers,
);

// delete group by id
router.delete("/delete/:groupId", authenticate, groupController.deleteGroup);

export default router;
