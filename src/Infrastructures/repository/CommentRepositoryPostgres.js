const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment, threadId, userId) {
        const {content} = comment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: `INSERT INTO comments
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
            values: [id, threadId, content, userId, date, false],
        };
        const result = await this._pool.query(query);

        return new CreatedComment({...result.rows[0]});
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async findCommentById(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('komentar tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }

        return result.rows[0];
    }

}

module.exports = CommentRepositoryPostgres;