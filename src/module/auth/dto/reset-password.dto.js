import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ResetPasswordDto extends BaseDto {
  static schema = Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[A-Z])(?=.*\d)/)
      .max(18)
      .required()
      .messages({
        "any.required":
          "Password must contain at least one uppercase letter and one digit",
        "string.base":
          "Password must contain at least one uppercase letter and one digit",
        "string.min":
          "Password must contain at least one uppercase letter and one digit",
        "string.max":
          "Password must contain at least one uppercase letter and one digit",
        "string.pattern.base":
          "Password must contain at least one uppercase letter and one digit",
      }),
  });
}

export default ResetPasswordDto;
