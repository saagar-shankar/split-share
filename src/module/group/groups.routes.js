import express from "express";
import authenticate from "../auth/auth.middleware.js";
import GroupsDto from "./DtoGroup/groups.dto.js";
import AddMembersDto from "./DtoGroup/addMembers.dto.js";
import validate from "../../common/middleware/validate.middleware.js";
import * as groupController from "./groups.controller.js";

const router = express.Router();

// get all groups Associated with mthe user SWAGGER-DOCS 19-JUNE-2026
/**
 * @swagger
 * /api/group/:
 *    get:
 *      summary: Fetch groups associated with the authenticated user
 *      tags: [Groups]
 *      responses:
 *        200:
 *          description: Groups fetched successfully
 *        401:
 *          description: User not authenticated. Please Login
 *
 */

// get all groups associated with the member
router.get("/", authenticate, groupController.getGroups);

// GET GROUP BY ID SWAGGER DOCS 19-JUNE-2026
/**
 * @swagger
 * /api/group/{groupId}:
 *   get:
 *     summary: Fetch a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID for finding group
 *     responses:
 *       200:
 *         description: Group Found
 *       401:
 *         description: User Not Authenticated
 *       404:
 *         description: Group Not Found or User is not a member
 */

// get groupBy Id
router.get("/:groupId", authenticate, groupController.getGroupById);

// SWAGGER DOCS 19-JUNE-2026 CREATE GROUP
/**
 * @swagger
 * /api/group/create-group:
 *   post:
 *     summary: Create a group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupName
 *             properties:
 *               groupName:
 *                 type: string
 *                 example: Banaras Bike Rental
 *     responses:
 *       201:
 *         description: Group Created Successfully
 *       400:
 *         description: Group Name is required
 *       401:
 *         description: Not Authenticated. Please login to create a group
 */

// ----------------
// create group   |
// ----------------
router.post(
  "/create-group",
  authenticate,
  validate(GroupsDto),
  groupController.createGroup,
);

/**
 * @swagger
 * /api/group/{groupId}/members:
 *   post:
 *     summary: Add a member to a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6z4444e290ee6967fff1e222
 *     responses:
 *       200:
 *         description: User added successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User or group not found
 *       412:
 *         description: Only owner can add members
 */

// add members to group
router.post(
  "/:groupId/members",
  authenticate,
  validate(AddMembersDto),
  groupController.addMembers,
);

// DELETE A GROUP SWAGGER DOCS 19-JUNE-2026
/**
 * @swagger
 * /api/group/delete/{groupId}:
 *   delete:
 *     summary: Delete a group by group ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID to delete a group
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       401:
 *         description: Not authenticated. Please login to perform this action
 *       404:
 *         description: Group not found
 *       412:
 *         description: Only owner can delete the group
 */

// delete group by id
router.delete("/delete/:groupId", authenticate, groupController.deleteGroup);

export default router;
