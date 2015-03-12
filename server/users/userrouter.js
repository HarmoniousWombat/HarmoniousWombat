module.exports = function (app) {
  app.post('/signin', function(req, res, next){
    console.log(req, res);
    next();
  });
  app.post('/signup', function(req, res, next){
    console.log(req, res);
    next();
  });
};