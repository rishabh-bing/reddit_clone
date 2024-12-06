/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .dropTableIfExists("user_vote")
        .createTable("user_vote", function (table) {
            table.increments("_id").primary();
            table.integer("userId").unsigned().notNullable();
            table.integer("voteId").unsigned().notNullable();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());

            table.unique(["userId", "voteId"]);
            table.foreign("userId").references("user._id").onDelete("CASCADE");
            table.foreign("voteId").references("vote._id").onDelete("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user_vote");
};
