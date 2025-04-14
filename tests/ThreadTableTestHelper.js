/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM threads');
    }
};

module.exports = ThreadTableTestHelper;