const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red.underline);

  // const error = { ...err };

  console.log(err);
  if (err.name === "CastError") {
    err.message = "Энэ ID буруу бүтэцтэй ID байна!";
    err.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError" && err.message === "invalid token") {
    err.message = "Буруу токен дамжуулсан байна!";
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    err.message = " Энэ талбарын утгыг давхардуулж өгч болохгүй!";
    err.statusCode = 400;
  }
  // console.log(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
  });
};
module.exports = errorHandler;
