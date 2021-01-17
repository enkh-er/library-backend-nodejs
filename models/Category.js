const mongoose = require("mongoose");
const { transliteration, slugify } = require("transliteration");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Категорийн нэрийг оруулна уу "],
    unique: true,
    trim: true, //hooson geh met zuilsiig automataar tsewerlej ogno
    maxlength: [50, "Категорийн нэр дээд тал нь 50 тэмдэгт байх ёстой"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Категорийн тайлбарыг заавал оруулна уу."],
    maxlength: [500, "Категорийн тайлбар дээд тал нь 500 тэмдэгт байх ёстой"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  averageRating: {
    type: Number,
    min: [1, "Үнэлгээ нь хамгийн багадаа 1 байх ёстой."],
    max: [10, "Үнэлгээ хамгийн ихдээ 10 байх ёстой."],
  },
  averagePrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.pre("save", function (next) {
  //slug name kiril to latin
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  this.averagePrice= Math.floor(Math.random() * 100000) + 3000;
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
