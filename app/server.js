const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const constants = require("../constants");
const conf = require("../config");
const routeUtils = require("./utils/route.utils");

function getAppServer() {
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());

    require(`./routes`)(app);

    app.use((req, res, next) => {
        next(createError(404));
    });

    app.use((error, req, res, next) => {
        const errorResponse = routeUtils.formatErrorResponse(error, req);
        !res.headersSent && res.type("application/json");
        res.status(errorResponse.status).json(errorResponse);
        console.log(errorResponse);
    });

    return app;
}

exports.getAppServer = getAppServer;
exports.shutdown = async (cb) => {
    cb();
};
