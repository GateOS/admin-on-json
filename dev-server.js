const express = require('express')
const app = express()
var _package = require('./package');
var path = require('path');
//var fs = require('fs');


app.use(express.static('public'), function (req, res, next) {
    var file = path.join(__dirname, req.url);
    // if (fs.existsSync(file)) {
    //     next()
    // } else {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    //}
});
var reload = require('reload');
var http = require('http');

var server = http.createServer(app);
reload(server, app);

server.listen(_package.port, function () {
    console.log('App (dev) is now running on port ${1}!', _package.port);
});
