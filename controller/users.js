const User = require("../models/User");
const MyError = require("../utils/myError");
const path = require("path");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

//register User
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const jwt = user.getJsonWebToke();
  res.status(200).json({
    success: true,
    token: jwt,
    user: user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  const jwt = user.getJsonWebToke();
  res.status(200).json({
    success: true,
    token: jwt,
    user: user,
  });
});
