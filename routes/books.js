const express = require("express");
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

router.route("/").get(getBooks).post(createBook);
router.route("/:id").get(getBook).delete(deleteBook).put(updateBook);
router.route("/:id/photo").put(uploadBookPhoto);

module.exports = router;
