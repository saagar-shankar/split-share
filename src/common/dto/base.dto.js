import Joi from "joi";
// its a template
class BaseDto {
  // empty schema so it can be over-ridden by anyone
  static schema = Joi.object({});

  static validate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    // if error occured then return error with message
    if (error) {
      const errors = error.details.map((d) => d.message);
      return { errors, value: null };
    }

    // no error encountered
    return { errors: null, value };
  }
}

export default BaseDto;
