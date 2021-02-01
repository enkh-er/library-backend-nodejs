const crypto = require("crypto");
const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");

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
//login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check input data
  if (!email || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  //find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу.", 401);
  }

  //check password
  const ok = await user.checkPassword(password);
  if (!ok) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу.", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToke(),
    user: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + " дугаартай хэрэглэгч байхгүй байна.",
      400
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + " дугаартай хэрэглэгч байхгүй байна.",
      400
    );
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //update hiigeed herhen oorchilogdson utgiig butsaana
    runValidators: true, //model der bichsen hyzgaarlaltuudiig shalga gesen vg
  });

  if (!user) {
    throw new MyError(
      req.params.id + " дугаартай хэрэглэгч байхгүй байна.",
      400
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new MyError(
      "Та нууц үг сэргээх бүртгэлтэй имэйл хаягаа оруулна уу!",
      400
    );
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new MyError(req.body.email + " имэйлтй хэрэглэгч олдсонгүй.", 400);
  }

  const resetToken = user.generatePasswordChangeToken();
  await user.save();

  const link = `https://libraryshop.mn/changepassword/${resetToken}`;
  const message = `Сайн байна уу.<br><br>Та нууц үгээ солих хүсэлт илгээлээ.<br>
  Нууц үгээ доорх линк дээр дарж солино уу.<br><br><a target="_blanks" href="${link}">${link}</a><br><br><br><br>Өдрийг сайхан өнгөрүүлээрэй.`;

  //email ilgeene
  const info = await sendEmail({
    email: user.email,
    subject: "Нууц үг өөрчлөх хүсэлт",
  });
  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new MyError("Та нууц үг болон токеноо дамжуулна уу!", 400);
  }

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new MyError("Хүчингүй токен байна.", 400);
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    token: user.getJsonWebToke(),
    user: user,
  });
});
