const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд нэвтэрнэ үү. authorization header-ээ токеноо явуулна уу",
      401
    );
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд нэвтэрнэ үү.",
      400
    );
  }
  const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;

  next();
});
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError(
        "Таны эрх [" +
          req.userRole +
          "] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй байна.",
        403
      );
    }
    next();
  };
};
