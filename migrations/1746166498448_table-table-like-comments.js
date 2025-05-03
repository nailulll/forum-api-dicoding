/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('like_comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
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
    });
    pgm.addConstraint('like_comments', 'fk_like_comments.comment_id_comments.id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('like_comments', 'fk_like_comments.owner_users.id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('like_comments');
};
