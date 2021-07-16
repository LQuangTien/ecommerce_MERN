const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
exports.upload = multer({ storage });
exports.requireSignin = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(500).json({ message: "Signin required" });
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Token expired" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(400).json({ message: "Access denined" });
  next();
};