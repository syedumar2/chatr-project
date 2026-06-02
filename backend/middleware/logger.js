const logger = (req, res, next) => {
  console.info(
    `${new Date()} :: ${req.method} :: ${req.path} :: ${JSON.stringify(
      req.query
    )} :: ${JSON.stringify(req.params)} :: ${JSON.stringify(req.body)} `
  );

  next();
};

module.exports =  logger ;
