import ApiError from "../utils/api_errors.js";

const validate = (DtoClass, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { errors, value } = DtoClass.validate(data);

    if (errors) {
      throw ApiError.badRequest(errors.join(";"));
    }

    if (source === "body") {
      req.body = value;
    }
    next();
    // latest express requires getters to set value and
    // req.query doesnt need to store any value as it already has it
    // req[source] = value;
  };
};

export default validate;

//----------------------------Commented this on 11-June-2026-- now used as reference
// as this method only worked for put,post, patch and not get req
// const validate = (DtoClass) => {
//   return (req, res, next) => {
//     const { errors, value } = DtoClass.validate(req.body);

//     if (errors) {
//       throw ApiError.badRequest(errors.join(";"));
//     }

//     req.body = value;
//     next();
//   };
// };

//----------------------------Updated this on 11-June-2026
// const validateQuery = (DtoClass) => {
//   return (req, res, next) => {
//     const { errors, value } = DtoClass.validate(req.query);

//     if (errors) {
//       throw ApiError.badRequest(errors.join(";"));
//     }

//     req.query = value;
//     next();
//   };
// };

// this method will act as our validation method
// from routes lets get register we will pass register dto class tot validate method

// BEFORE UPDATE OUR VALIDATE WORKS ONLY FOR
// POST /register
// POST /login
// POST /forgot-password
// PUT /reset-password
// AS those routes send data in: req.body

// But your search route will be:
// GET /search-user?query=aman AND NOT IN req.body
