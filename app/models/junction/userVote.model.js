const { Model } = require("objection");
const { redditCloneDB } = require("../../../connections/postgres.init");

Model.knex(redditCloneDB);

class UserVoteModel extends Model {
    static get tableName() {
        return "user_vote";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["userId", "voteId"],
            properties: {
                _id: { type: "number" },
                userId: { type: "string" },
                voteId: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const User = require("../user.model");
        const Vote = require("../vote.model");

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "user_vote.userId",
                    to: "user._id",
                },
            },
            vote: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vote,
                join: {
                    from: "user_vote.voteId",
                    to: "vote._id",
                },
            },
        };
    }

    async $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    async $beforeUpdate(opt) {
        this.updatedAt = new Date().toISOString();
        delete this.createdAt;
    }
}

module.exports = UserVoteModel;
