const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} = require("../controller/books");

router.route("/").get(getBooks).post(createBook);

router.route("/:id").get(getBook).delete(deleteBook).put(updateBook);
//   .put(updateCategory)
//   .delete(deleteCategory);

module.exports = router;
