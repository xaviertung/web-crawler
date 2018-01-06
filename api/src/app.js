const express = require("express");
const consign = require("consign");


const app = express();

consign({ verbose: false, cwd: "src" })
    .then("routers")
    .then("libs/middlewares.js")
    .then("libs/bootstrap.js")
    .into(app);
module.exports = app;