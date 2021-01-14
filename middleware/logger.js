const logger = (req, res, next) => {
    console.log(
      `method: ${req.method}, protocol:${req.protocol}://, host:${req.host}, originalURL:${req.originalUrl}`
    );
    next();
  };

  module.exports=logger;