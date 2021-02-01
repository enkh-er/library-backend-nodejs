const path = require("path");
const Book = require("../models/Book");
const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

//api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);

  req.query.createUser = req.userId;
  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

//api/v1/categories/:catId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Book);
  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
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

  req.body.createUser = req.userId;
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
  if (book.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийн оруулсан номыг устгах эрхтэй!", 403);
  }
  book.remove();

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + " дугаартай ном байхгүй байна.", 400);
  }

  if (book.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийн оруулсан номыг засварлах эрхтэй!", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    book[attr] = req.body[attr];
  }
  book.save();

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
