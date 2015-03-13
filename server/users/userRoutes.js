var User = require('./userModel.js');
var jwt = require('jwt-simple');

module.exports = function (app) {

  app.post('/login', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function(err, data){
      if (data){
        data.comparePasswords(password, function(isMatch){
          if (isMatch){
            var token = jwt.encode(username, 'secret');
            res.json({token: token});
            console.log(username, 'logged in');
          } else {
            console.log(username, 'incorrect password');
          }
        });
      } else {
        console.log(username, 'isnt a user');
      }
    });
  });

  app.post('/signup', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function(err, data){
      if (data){
        console.log('User already exists!');
        next();
      } else {
        var newUser = {
          username: username,
          password: password
        };
        User.create(newUser, function(err){
          if (err){
            console.log(err);
          }
          var token = jwt.encode(username, 'secret');
          res.json({token: token});
        });
      }
    });
  });

  app.get('/signedin', function(req, res, next){
    next();
  });
};