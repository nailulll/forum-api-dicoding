const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");

const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");

describe("CommentRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addComment function", () => {
        it("should add comment correctly", async () => {
            const fakeUserId = 'user-123';
            const fakeThreadId = 'thread-123';
            const payload = {
                content: 'content',
            };
            const fakeIdGenerator = () => '123';

            await UsersTableTestHelper.addUser({id: fakeUserId});
            await ThreadTableTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const comment = await commentRepositoryPostgres.addComment(payload, fakeThreadId, fakeUserId);
            expect(comment).toStrictEqual(new CreatedComment({
                id: 'comment-123',
                content: payload.content,
                owner: fakeUserId,
            }));
        });
    });
});