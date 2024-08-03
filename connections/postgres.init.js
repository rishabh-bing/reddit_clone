"use strict";

const conf = require("../config");
const knex_configuration = require("../db/knexfile");

const redditCloneDB = require("knex")(knex_configuration);

if (conf.env === "development") {
    redditCloneDB.on("query", (data) => {
        let query = data.sql;
        if (data.bindings) {
            data.bindings.forEach((binding, i) => {
                query = query.replace("$" + (i + 1), binding);
            });
            console.log(`[QUERY] ${query}`);
        }
    });
}

function disconnect() {
    redditCloneDB.destroy((err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    redditCloneDB,
    disconnect,
};
