const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

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
            text: `SELECT threads.*, users.username
                   FROM threads
                            JOIN users ON threads.owner = users.id
                   WHERE threads.id = $1`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("thread tidak ditemukan");
        }

        return result.rows[0];
    }

}

module.exports = ThreadRepositoryPostgres;
