const Category = require("../models/Category");
const MyError = require("../utils/myError");
const path = require("path");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Category);

  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  // const category = await Category.findById(req.params.id);
  const category = await Category.findById(req.params.id).populate("books");

  if (!category) {
    throw new MyError(
      req.params.id + " дугаартай категори байхгүй байна.",
      400
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log("data:", req.body);

  const category = await Category.create(req.body);
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //update hiigeed herhen oorchilogdson utgiig butsaana
    runValidators: true, //model der bichsen hyzgaarlaltuudiig shalga gesen vg
  });

  if (!category) {
    throw new MyError(
      req.params.id + " дугаартай категори байхгүй байна.",
      400
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new MyError(
      req.params.id + " дугаартай категори байхгүй байна.",
      400
    );
  }
  category.remove();
  res.status(200).json({
    success: true,
    data: category,
  });
});

//PUT: api/v1/categories/:id/photo
exports.uploadCategoryPhoto = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new MyError(
      req.params.id + " дугаартай категори байхгүй байна.",
      400
    );
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
    category.photo = file.name;
    category.save();
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
