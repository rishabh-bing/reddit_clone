const { Model } = require("objection");
const { redditCloneDB } = require("../../connections/postgres.init");
const nodemailer = require("nodemailer");

const {
    DoesNotExistError,
    AlreadyExistError,
} = require("../utils/errors.utils.js");
const UserModel = require("./user.model.js");

Model.knex(redditCloneDB);

class SubredditModel extends Model {
    static get tableName() {
        return "subreddit";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "description"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                name: { type: "string", minLength: 1, maxLength: 255 },
                description: { type: "string", minLength: 1, maxLength: 255 },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const User = require("./user.model");
        const Post = require("./post.model");
        const Subscription = require("./junction/Subscription.model");

        return {
            user: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: "subreddit._id",
                    through: {
                        from: "subscription.subredditId",
                        to: "subscription.userId",
                    },
                    to: "user._id",
                },
            },
            subscription: {
                relation: Model.HasManyRelation,
                modelClass: Subscription,
                join: {
                    from: "subreddit._id",
                    to: "subscription.subredditId",
                },
            },
            post: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: "subreddit._id",
                    to: "post.subredditId",
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

    static async createSubreddit(subreddit) {
        try {
            return await this.query().insertAndFetch({
                userId: subreddit.userId,
                name: subreddit.name,
                description: subreddit.description,
            });
        } catch (err) {
            throw err;
        }
    }

    static async updateSubreddit(subredditId, subreddit) {
        try {
            const existingSubreddit = await this.query().findById(subredditId);

            if (!existingSubreddit) {
                throw new DoesNotExistError("No subreddit found to update");
            }

            return await this.query().patchAndFetchById(subredditId, {
                userId: subreddit.userId,
                name: subreddit.name,
                description: subreddit.description,
            });
        } catch (err) {
            throw err;
        }
    }

    static async getSubreddit(filters) {
        return await this.query().findOne(filters);
    }

    static async getSubredditById(subredditId) {
        return await this.query().findById(subredditId);
    }

    static async getSubreddits(pageNo, pageSize, searchTag) {
        const query = this.query().orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getSubredditsByUserId({
        userId,
        pageNo,
        pageSize,
        searchTag,
    }) {
        const query = this.query()
            .where("userId", userId)
            .orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getSubredditPosts({ subredditId }) {
        return await this.query()
            .findById(subredditId)
            .withGraphFetched("post");
    }

    static async getSubredditWithUsers({ userId, subredditId }) {
        try {
            return await this.query()
                .findById(subredditId)
                .where("userId", userId)
                .withGraphFetched("user");
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteSubredditById({ userId, subredditId }) {
        try {
            return await this.query()
                .delete()
                .where("_id", subredditId)
                .where("userId", userId)
                .returning("*");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SubredditModel;
