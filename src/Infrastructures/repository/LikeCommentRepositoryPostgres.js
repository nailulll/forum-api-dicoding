const LikeCommentRepository = require("../../Domains/like_comments/LikeCommentRepository");

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async likeComment(commentId, userId) {
        const id = `like-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const query = {
            text: "INSERT INTO like_comments VALUES ($1, $2, $3, $4) RETURNING id",
            values: [id, commentId, userId, date],
        };
        const result = await this._pool.query(query);

        return result.rows[0];
    }

    async unlikeComment(commentId, userId) {
        const query = {
            text: "DELETE FROM like_comments WHERE comment_id = $1 AND owner = $2",
            values: [commentId, userId],
        };
        await this._pool.query(query);
    }

    async findLikeComment(commentId, userId) {
        const query = {
            text: "SELECT * FROM like_comments WHERE comment_id = $1 AND owner = $2",
            values: [commentId, userId],
        };
        const result = await this._pool.query(query);

        return result.rowCount > 0;
    }
}

module.exports = LikeCommentRepositoryPostgres;