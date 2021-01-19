const mongoose = require("mongoose");
const { transliteration, slugify } = require("transliteration");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Номын нэрийг оруулна уу "],
      unique: true,
      trim: true, //hooson geh met zuilsiig automataar tsewerlej ogno
      maxlength: [250, "Номын нэр дээд тал нь 250 тэмдэгт байх ёстой"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    author: {
      type: String,
      required: [true, "Зохиогчийн нэрийг оруулна уу "],
      trim: true, //hooson geh met zuilsiig automataar tsewerlej ogno
      maxlength: [50, "Зохиогчийн нэр дээд тал нь 50 тэмдэгт байх ёстой"],
    },
    rating: {
      type: Number,
      min: [1, "Үнэлгээ нь хамгийн багадаа 1 байх ёстой."],
      max: [10, "Үнэлгээ хамгийн ихдээ 10 байх ёстой."],
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулна уу."],
      min: [500, "Номын үнэ нь хамгийн багадаа 500 байх ёстой."],
    },
    balance: Number,
    content: {
      type: String,
      required: [true, "Номын тайлбарыг оруулна уу."],
      trim: true, //hooson geh met zuilsiig automataar tsewerlej ogno
      maxlength: [5000, "Зохиогчийн нэр дээд тал нь 50 тэмдэгт байх ёстой"],
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    available: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Book", BookSchema);
