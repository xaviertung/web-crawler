const http = require("http");

module.exports = app => {
    console.log("haha")
    http.createServer(app).listen(3000, function() {
        console.log("Hello, World!")
    });
};