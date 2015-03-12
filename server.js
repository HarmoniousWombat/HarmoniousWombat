// Grabs express setup
var app = require('./server/config.js');
// Sets port according to setup
var port = process.env.PORT || 9000;
// Starts server
app.listen(port);