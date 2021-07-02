const jwt = require("jsonwebtoken");
exports.requireSignin = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).json({ message: "Signin required" });
  const token = req.headers.authorization;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(400).json({ message: "Access denined" });
  next();
};
