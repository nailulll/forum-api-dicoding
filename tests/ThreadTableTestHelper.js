/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {

    async addThread({id = 'thread-123', title = 'title', body = 'body', owner = 'user-123'}) {
        const date = new Date().toISOString();
        await pool.query('INSERT INTO threads VALUES($1, $2, $3, $4, $5)', [id, title, body, owner, date]);
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads');
    }
};

module.exports = ThreadTableTestHelper;