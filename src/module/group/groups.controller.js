import ApiResponse from "../../common/utils/api_response.js";
import * as groupService from "./groups.service.js";

const createGroup = async (req, res) => {
  console.log("*****Create Group Route Hit*****\n");
  const group = await groupService.createGroupService(req.body, req.user.id);
  ApiResponse.ok(res, "Group Created Successfully", group);
};

const addMembers = async (req, res) => {
  console.log("*****Add Member Route Hit*****\n");
  const member = await groupService.addMemberService(
    req.params.groupId,
    req.body.userId,
    req.user.id,
  );
  ApiResponse.ok(res, "Member Added Successfully", member);
};

const getGroups = async (req, res) => {
  console.log("***** GET ALL GROUP ROUTE HIT *****\n");
  const groups = await groupService.getAllGroupService(req.user.id);
  ApiResponse.ok(res, "Groups Found", groups);
};

const getGroupById = async (req, res) => {
  console.log("***** GET GROUP BY ID ROUTE HIT *****\n");
  const group = await groupService.getGroupByIdservice(
    req.params.groupId,
    req.user.id,
  );
  ApiResponse.ok(res, "Group found", group);
};

// delete a group by id controller
const deleteGroup = async (req, res) => {
  console.log("***** Delete GROUP ROUTE HIT *****\n");
  console.log("DELETE HIT");
  console.log("params:", req.params);
  console.log("user:", req.user);

  const group = await groupService.deleteGroupById(
    req.params.groupId,
    req.user.id,
  );
  ApiResponse.ok(res, "Group Deleted Successfully");
};

export { createGroup, addMembers, getGroups, getGroupById, deleteGroup };
