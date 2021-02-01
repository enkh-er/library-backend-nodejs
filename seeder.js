const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

const Category = require("./models/Category");
const Book = require("./models/Book");
const User = require("./models/User");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // shine oorchilson uri parse hiij ashiglah
  useCreateIndex: true, //huuchirsan deprecated hiisen zuiliig ashiglahgvi shine huwilbariig ashiglana
  useFindAndModify: false, //deprecated boltson zuiliih ashiglahgvi
  useUnifiedTopology: true, // servervvdtei haritsah shine huwilbaruudiig hereglene
});

const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categories.json", "utf-8")
);

const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/book.json", "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/user.json", "utf-8")
);

const importData = async () => {
  try {
    await User.create(users);
    await Category.create(categories);
    await Book.create(books);
    console.log("Өгөгдлийг импортлолоо...".green.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();
    console.log("Өгөгдлийг устгалаа...".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
