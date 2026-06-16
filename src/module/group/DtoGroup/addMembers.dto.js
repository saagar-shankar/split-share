import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class AddMembersDto extends BaseDto {
  static schema = Joi.object({
    userId: Joi.string().required(),
  });
}

export default AddMembersDto;
