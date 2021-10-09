const { check, validationResult } = require("express-validator");
const { BadRequest } = require("../ulti/Response");
exports.validateSignup = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 character long"),
]; 
exports.validateSignin = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 character long"),
];
exports.isAuthValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length <= 0) return next();
  return BadRequest(res, errors.array()[0].msg);
};
