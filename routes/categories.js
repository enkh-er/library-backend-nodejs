const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryPhoto,
} = require("../controller/categories");

// /api/./books/categories/:id/books
const { getCategoryBooks } = require("../controller/books");
router.route("/:categoryId/books").get(getCategoryBooks);

// const booksRouter = require("./books");
// router.use("/:categoryId/books", booksRouter);

// /api/v1/categories
router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin", "operator"), createCategory);

// /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin", "operator"), deleteCategory);

router
  .route("/:id/photo")
  .put(protect, authorize("admin", "operator"), uploadCategoryPhoto);

module.exports = router;
