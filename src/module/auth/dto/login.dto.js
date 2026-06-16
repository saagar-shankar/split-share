import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";

// Joi custom checks like 'string.empty
class LoginDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required()
      .lowercase()
      .trim()
      .messages({
        "string.email": "Invalid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });
}

export default LoginDto;
