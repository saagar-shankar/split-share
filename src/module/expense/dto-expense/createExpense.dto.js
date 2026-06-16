import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateExpenseDto extends BaseDto {
  static schema = Joi.object({
    description: Joi.string().required().min(5).max(100).trim().messages({
      "string.min": "Minimum 5 Character required",
      "string.max": "Maximum 100 characters allowed for Description",
      "string.empty": "Description can't be empty",
      "any.required": "Description is required",
    }),
    totalExpenditure: Joi.number().required().min(1).max(99999999).messages({
      "any.required": "Expense is required",
      "number.base": "Expense must be a number",
    }),
    paidBy: Joi.string().required().length(24).messages({
      "string.length": "Invalid User Id",
      "any.required": "PaidBy is required",
    }),
  });
}

export default CreateExpenseDto;
