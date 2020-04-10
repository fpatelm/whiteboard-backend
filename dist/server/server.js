"use strict";
exports.__esModule = true;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var port = 8080;
var App = (function () {
    function App(port) {
        this.port = port;
        this.server = new http_1["default"].Server();
        var io = socket_io_1["default"](this.server);
    }
    App.prototype.Start = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("Server listening on port " + _this.port + ".");
        });
    };
    return App;
}());
new App(port).Start();
