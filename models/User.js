const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { nextTick } = require("process");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Хэрэглэгчийн нэрийг оруулна уу."],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн имэйлийг оруулна уу."],
    unique: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Имэйл хаяг буруу байна.",
    ],
  },
  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийг оруулна уу."],
    enum: ["user", "operator", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, "Нууц үгээ оруулна уу."],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  //нууц үг өөрчлөгдөөгүй бол дараагийн middleware-рүү шилжинэ
  if (!this.isModified("password")) next();

  //нууц үг өөрчлөгдсөн бол нууц үгийг давслана
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJsonWebToke = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
