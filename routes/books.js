const express = require("express");
const { protect, authorize } = require("../middleware/protect");
// const router = express.Router({ mergeParams: true });  //categoriin route-ees hvselt orj irwel mergeparams true bolno
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  uploadBookPhoto,
} = require("../controller/books");

router
  .route("/")
  .get(getBooks)
  .post(protect, authorize("admin", "operator"), createBook);

router
  .route("/:id")
  .get(getBook)
  .delete(protect, authorize("admin", "operator"), deleteBook)
  .put(protect, authorize("admin", "operator"), updateBook);
router
  .route("/:id/photo")
  .put(protect, authorize("admin", "operator"), uploadBookPhoto);

module.exports = router;
