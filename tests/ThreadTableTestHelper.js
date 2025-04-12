/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
        await pool.query('DELETE FROM users WHERE 1=1');
    }
};

module.exports = ThreadTableTestHelper;