import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class SearchGroupDto extends BaseDto {
  static schema = Joi.object({
    query: Joi.string().required().min(2).max(50).trim().messages({
      "any.required": "Name is required",
      "string.min": "Minimum 2 characters are required to search",
      "string.max": "50 characters allowed to search",
    }),
  });
}

export default SearchGroupDto;
