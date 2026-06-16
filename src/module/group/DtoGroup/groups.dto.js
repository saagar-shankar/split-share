import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class GroupsDto extends BaseDto {
  static schema = Joi.object({
    groupName: Joi.string().required().min(3).max(50).messages({
      "any.required": "Name is required",
      "string.empty": "Name can't be empty",
      "string.min": "Minimum 3 characters required",
      "string.max": "Maximum 50 characters allowed from group name",
    }),
  });
}

export default GroupsDto;
