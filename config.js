"use strict";

require("dotenv").config({ path: "./.env" });

const _ = require("lodash");
const convict = require("convict");

const conf = convict({
    env: {
        doc: "node env",
        format: String,
        default: "development",
        env: "NODE_ENV",
        arg: "node_env",
    },
    serverType: {
        doc: "server type",
        format: String,
        default: "",
        env: "SERVER_TYPE",
        arg: "server_type",
    },
    port: {
        doc: "The port to bind",
        format: "port",
        default: "",
        env: "PORT",
        arg: "port",
    },

    postgres: {
        reddit_clone: {
            doc: "postgresql url of reddit_clone DB",
            format: String,
            default: null,
            env: "POSTGRES_REDDIT_CLONE_READ_WRITE",
            arg: "postgres_reddit_clone_read_write",
        },
    },

    email: {
        emailType: {
            doc: "Email TYPE",
            format: String,
            default: "test",
            env: "EMAIL_TYPE",
            arg: "email_type",
        },
        id: {
            doc: "Email Id",
            format: String,
            default: "",
            env: "EMAIL_ID",
            arg: "email_id",
        },
        token: {
            doc: "Email Password",
            format: String,
            default: "",
            env: "EMAIL_TOKEN",
            arg: "email_token",
        },
    },
    jwtSecret: {
        doc: "JWT_SECRET",
        format: String,
        default: "",
        env: "JWT_SECRET",
    },
});

// Perform validation
conf.validate({
    allowed: "strict",
});
_.extend(conf, conf.get());

module.exports = conf;
