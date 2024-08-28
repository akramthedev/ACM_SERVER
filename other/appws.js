var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', function (req, res, next) {
    console.log('get route', req.testing);
    res.send("done");
});

app.ws('/', function (ws, req) {
    console.log("ws ready ......")
    ws.on('message', function (msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

// app.listen(3000);
var PORT = 3000;
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});