const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();

const {
  register,
  login,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("../controller/users");
const { getUserBooks } = require("../controller/books");

// /api/v1/users
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.use(protect);
router
  .route("/")
  .post(authorize("admin"), createUser)
  .get(authorize("admin", "operator"), getUsers);
router
  .route("/:id")
  .get(authorize("admin", "operator"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);
router
  .route("/:id/books")
  .get(authorize("admin", "operator", "user"), getUserBooks);

module.exports = router;
