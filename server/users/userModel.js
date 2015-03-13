var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
});

UserSchema.methods.comparePasswords = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    callback(isMatch);
  });
};

UserSchema.pre('save', function (next) {
  var newUser = this;
  bcrypt.hash(this.password, null, null, function(err, hash){
    if (err){
      console.log(err);
    } else {
      newUser.password = hash;
      next();
    }
  });
});

module.exports = mongoose.model('users', UserSchema);
