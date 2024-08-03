const { validationResult } = require("express-validator");

const conf = require("../../config");
const constants = require("../../constants");

const routeUtils = {
    validate: (req, res, next) => {
        const errors = validationResult(req).formatWith(({ msg }) => msg);

        if (errors.isEmpty()) {
            next();
        } else {
            throw routeUtils.formatValidateError(errors);
        }
    },

    formatValidateError: (errors) => {
        const error = new Error("Unexpected input value");
        error.errorCode = "SR-0422";
        error.status = 422;
        error.meta = { errors: errors.mapped() };
        error.name = "ValidationError";
        return error;
    },

    formatErrorResponse: (error, req) => {
        error = error || {};
        const status = error.status || 500;

        const errorCode = error.errorCode || `SR-${status}`;

        const errorResponse = {
            message:
                status === 500
                    ? "We're unable to process your request at the moment"
                    : error.customMessage ||
                      error.message ||
                      constants.DEFAULT_ERROR_MESSAGE,
            status,
            code: errorCode,
            exception: error.name,
        };

        if (conf.get("env") === "development") {
            errorResponse.stackTrace = error.stack || "";
        }
        if (error.meta) {
            errorResponse.meta = error.meta;
        }

        return errorResponse;
    },
};

module.exports = routeUtils;
