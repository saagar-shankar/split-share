import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class SearchDto extends BaseDto {
  static schema = Joi.object({
    query: Joi.string().required().trim().min(2).max(100).messages({
      "any.required": "Search query is required",
      "string.empty": "Search query cannot be empty",
      "string.min": "Search query must contain at least 2 characters",
    }),
  });
}

export default SearchDto;
