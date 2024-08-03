/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .dropTableIfExists("subscription")
        .createTable("subscription", function (table) {
            table.increments("_id").primary();
            table.integer("userId").unsigned().notNullable();
            table.integer("subredditId").unsigned().notNullable();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());

            table.unique(["userId", "subredditId"]);
            table.foreign("userId").references("user._id").onDelete("CASCADE");
            table
                .foreign("subredditId")
                .references("subreddit._id")
                .onDelete("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("subscription");
};
