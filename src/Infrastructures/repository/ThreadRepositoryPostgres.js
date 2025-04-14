const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");

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
}

module.exports = ThreadRepositoryPostgres;