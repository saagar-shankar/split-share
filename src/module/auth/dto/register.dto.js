import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().required().min(2).max(50).trim().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 50 characters",
    }),
    email: Joi.string().email().trim().required().lowercase().messages({
      "string.email": "Invalid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).max(20).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be atleast 8 characters",
      "string.max": "Password must not exceed 20 characters",
      "any.required": "Password is required",
    }),
  });
}

export default RegisterDto;
