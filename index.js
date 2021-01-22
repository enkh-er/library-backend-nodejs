const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const morgan = require("morgan");
const rfs = require("rotating-file-stream"); // version 2.x
const colors = require("colors");
const fileupload = require('express-fileupload');

const logger = require("./middleware/logger"); //middleware oruulj ireh
const categoriesRoutes = require("./routes/categories"); //route oruulj ireh
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" }); //app-iin tohirgoog process.env-d achaalah

connectDB();

const app = express();

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(fileupload());
app.use(logger); // setup the logger
app.use(express.json()); //body parser
app.use("/api/v1/categories", categoriesRoutes); //route connect app
app.use("/api/v1/books", bookRoutes); //route connect app
app.use("/api/v1/users", userRoutes); //route connect app
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(`server ${process.env.PORT} port der aslaa`.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`ERROR: ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
