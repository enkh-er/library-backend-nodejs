const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  //pagination
  const total = await Category.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  if (end > total) {
    end = total;
  }
  const pagination = {
    total,
    pageCount,
    start,
    end,
    limit,
  };

  if (page < pageCount) {
    pagination.nextPage = page + 1;
  }
  if (page > 1) {
    pagination.prevPage = page - 1;
  }

  console.log(req.query, sort, select);
  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(start - 1)
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
