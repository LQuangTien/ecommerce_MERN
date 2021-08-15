const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const statusCode = require("http-status-codes");

const User = require("../models/user");
const { ServerError, Response, BadRequest } = require("../ulti/response");

const ONE_SECCOND = 1000;
const ONE_HOUR = "1h";

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return ServerError(res, error);
    if (user) return BadRequest(res, "User already registered");
    const { firstName, lastName, email, password } = req.body;
    try {
      const hash_password = await bcrypt.hash(password, 10);
      const newUser = User({
        firstName,
        lastName,
        email,
        hash_password,
        username: Math.random().toString(),
      });
      newUser.save((error, user) => {
        if (error) return ServerError(res, error.message);
        if (user) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
              expiresIn: ONE_HOUR,
            }
          );
          const { firstName, lastName, email, fullName } = user;
          return Response(res, {
            token,
            user: { firstName, lastName, email, fullName },
          });
        }
      });
    } catch (error) {
      return ServerError(res, error.message);
    }
  });
};
exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return ServerError(res, error);
    if (!user) return BadRequest(res, "User does not exist");
    const isAuthen = await user.authenticate(req.body.password);
    if (!isAuthen) return BadRequest(res, "Wrong password");

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: ONE_HOUR,
      }
    );
    const { firstName, lastName, email, fullName } = user;
    return Response(res, {
      token,
      user: { firstName, lastName, email, fullName },
    });
  });
};
exports.signout = (req, res) => {
  return Response(res, { message: "Signout successfully ...!" });
};
