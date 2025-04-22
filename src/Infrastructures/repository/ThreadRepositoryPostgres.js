const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const Thread = require("../../Domains/threads/entities/Thread");
const Comment = require("../../Domains/comments/entities/Comment");
const Reply = require("../../Domains/replies/entities/Reply");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread, userId) {
        const {title, body} = thread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const query = {
            text: `INSERT INTO threads
                   VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner`,
            values: [id, title, body, userId, date],
        };


        const result = await this._pool.query(query);

        return new CreatedThread({...result.rows[0]});
    }

    async findThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }

    async detailThread(threadId) {
        const threadQuery = {
            text: `
                SELECT t.id, t.title, t.body, t.date, u.username
                FROM threads t
                         JOIN users u ON t.owner = u.id
                WHERE t.id = $1
            `,
            values: [threadId],
        };
        const threadResult = await this._pool.query(threadQuery);
        if (!threadResult.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }
        const thread = threadResult.rows[0];

        const commentsQuery = {
            text: `
                SELECT c.id, c.content, c.date, c.is_delete, u.username
                FROM comments c
                         JOIN users u ON c.owner = u.id
                WHERE c.thread_id = $1
                ORDER BY c.date
            `,
            values: [threadId],
        };
        const commentsResult = await this._pool.query(commentsQuery);
        const commentIds = commentsResult.rows.map(c => c.id);

        const repliesQuery = {
            text: `
                SELECT r.id, r.content, r.date, r.is_delete, r.comment_id, u.username
                FROM replies r
                         JOIN users u ON r.owner = u.id
                WHERE r.comment_id = ANY ($1::text[])
                ORDER BY r.date
            `,
            values: [commentIds],
        };
        const repliesResult = await this._pool.query(repliesQuery);

        const replies = repliesResult.rows.map(reply => ({
            ...reply,
            content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
        }));


        const comments = commentsResult.rows.map(comment => {
            const nestedReplies = replies
                .filter(reply => reply.comment_id === comment.id)
                .map(reply => new Reply({
                    id: reply.id,
                    content: reply.content,
                    date: reply.date,
                    username: reply.username,
                }));

            return new Comment({
                id: comment.id,
                content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
                date: comment.date,
                username: comment.username,
                replies: nestedReplies,
            });
        });

        return new Thread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments,
        });
    }

}

module.exports = ThreadRepositoryPostgres;