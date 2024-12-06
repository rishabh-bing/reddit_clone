const { Model } = require("objection");
const { redditCloneDB } = require("../../connections/postgres.init");
const nodemailer = require("nodemailer");

const { DoesNotExistError } = require("../utils/errors.utils.js");

Model.knex(redditCloneDB);

class VoteModel extends Model {
    static get tableName() {
        return "vote";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                postId: { type: "number" },
                vote: { type: "number", default: 0 },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const User = require("./user.model");

        const UserVote = require("./junction/userVote.model");

        return {
            user: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "vote._id",
                    through: {
                        from: "user_vote.voteId",
                        to: "user_vote.userId",
                    },
                    to: "user._id",
                },
            },
            user_vote: {
                relation: Model.HasManyRelation,
                modelClass: UserVote,
                join: {
                    from: "user._id",
                    to: "user_vote.userId",
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

    static async votePost({ userId, postId, vote }) {
        const existingVote = await this.query()
            .where({ userId, postId })
            .first();

        if (existingVote) {
            return await this.query().patch({ vote }).where({ userId, postId });
        } else {
            return await this.query().insert({ userId, postId, vote });
        }
    }
}

module.exports = VoteModel;
