const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const { firstName, lastName, email, password } = req.body;
    const newUser = User({
      firstName,
      lastName,
      email,
      password,
      username: Math.random().toString(),
    });
    newUser.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        return res.status(201).json({
          id: data.id,
          firstName,
          lastName,
          email,
          username: data.username,
        });
      }
    });
  });
};
exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (!user) return res.status(400).json({ messages: "User not exist" });
    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({ messages: "Wrong password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { _id, firstName, lastName, email, role, fullName } = user;
    return res.status(200).json({
      token,
      user: { _id, firstName, lastName, email, role, fullName },
    });
  });
};
// exports.requireSignin = (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   const user = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = user;
//   next();
// };
