const path = require("path");
const Book = require("../models/Book");
const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

//api/v1/books
//api/v1/categories/:catId/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId });
  } else {
    query = Book.find().populate({
      path: "category",
      select: "name averagePrice",
    });
  }

  const books = await query;
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + " дугаартай ном байхгүй байна.", 404);
  }

  // const avg = await Book.computeCategoryAveragePrice(book.category);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new MyError(
      req.body.category + " дугаартай категори байхгүй байна.",
      400
    );
  }

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + " дугаартай ном байхгүй байна.", 404);
  }

  book.remove();

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //update hiigeed herhen oorchilogdson utgiig butsaana
    runValidators: true, //model der bichsen hyzgaarlaltuudiig shalga gesen vg
  });

  if (!book) {
    throw new MyError(req.params.id + " дугаартай ном байхгүй байна.", 400);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

//PUT: api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + " дугаартай ном байхгүй байна.", 400);
  }

  //image upload
  //pexels.com
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  if (file.size > process.env.MAX_PHOTO_UPLOAD_SIZE) {
    throw new MyError("Таны зургийн хэмжээ хэтэрсэн байна", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
  // console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа:" + err.message,
        500
      );
    }
    book.photo = file.name;
    book.save();
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
