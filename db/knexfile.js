"use strict";

const path = require("path");

require("dotenv").config({ path: "../.env" });

const conf = require("../config");
console.log({ conn: conf.postgres.reddit_clone });
const migrationDirectories = [path.join(__dirname, "./migrations")];
module.exports = {
    client: "pg",
    connection: conf.postgres.reddit_clone,
    migrations: {
        directory: migrationDirectories,
    },
};
