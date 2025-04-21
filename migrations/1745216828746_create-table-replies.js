/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
        },
    });
    pgm.addConstraint('replies', 'fk_replies.comment_id_threads.id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('replies', 'fk_replies.owner_users.id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('replies');
};
