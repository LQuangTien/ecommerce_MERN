const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const newUser = User({
      firstName,
      lastName,
      email,
      hash_password,
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

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1000h",
      }
    );
    const { _id, firstName, lastName, email, role, fullName } = user;
    return res.status(200).json({
      token,
      user: { _id, firstName, lastName, email, role, fullName },
    });
  });
};
