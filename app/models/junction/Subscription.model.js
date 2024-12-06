const { Model } = require("objection");
const { redditCloneDB } = require("../../../connections/postgres.init");

Model.knex(redditCloneDB);

class SubscriptionModel extends Model {
    static get tableName() {
        return "subscription";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["userId", "subredditId"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                subredditId: { type: "number" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const User = require("../user.model");
        const Subreddit = require("../subreddit.model");

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "subscription.userId",
                    to: "user._id",
                },
            },
            subreddit: {
                relation: Model.BelongsToOneRelation,
                modelClass: Subreddit,
                join: {
                    from: "subscription.subredditId",
                    to: "subreddit._id",
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

    static async subscribeToSubreddit({ userId, subredditId }) {
        return await this.query().insertAndFetch({ userId, subredditId });
    }

    static async getUserSubscriptions(userId) {
        return await this.query()
            .where("userId", userId)
            .withGraphFetched("subreddit");
    }
}

module.exports = SubscriptionModel;
