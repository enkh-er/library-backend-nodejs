const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categories");

// const {getBooks}=require("../controller/books");
// /api/./books/categories/:id/books
// router.route("/:categoryId/books").get(getBooks);

const booksRouter = require("./books");
router.use("/:categoryId/books", booksRouter);

// /api/v1/categories
router.route("/").get(getCategories).post(createCategory);

// /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
