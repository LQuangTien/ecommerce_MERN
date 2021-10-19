const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const { Unauthenticated, Unauthorized } = require("../ulti/response");
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
  if (!req.headers.authorization) return Unauthenticated(res, "Signin required");
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.exp < Math.floor(Date.now() / 1000)) return Unauthenticated(res, "Token expired");
    
    req.user = user;
    return next();
  } catch (error) {
    return Unauthenticated(res, error.message);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return Unauthorized(res);
  return next();
};

