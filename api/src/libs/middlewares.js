const bodyParser = require("body-parser") 
const path = require("path") 
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const compression = require("compression")
const helmet = require("helmet")

module.exports = app => {
    "use strict";
    app.set("json spaces", 4);
    app.use(bodyParser.json());
    app.use(compression());
    app.use(helmet());
    app.use((req, res, next) => {
        // console.log(`header: ${JSON.stringify(req.headers)}`);
        if (req.body && req.body.id) {
            delete req.body.id;
        }
        next();
    });

    app.use(express.static(path.resolve(__dirname, "../../public/")));
};