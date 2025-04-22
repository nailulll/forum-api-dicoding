const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

describe("ReplyRepositoryPostgres", () => {
    const fakeIdGenerator = () => '123';
    const fakeUserId = 'user-123';
    const fakeThreadId = 'thread-123';
    const fakeCommentId = 'comment-123';
    const payload = {content: 'content'};
    let replyRepositoryPostgres;

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({id: fakeUserId});
        await ThreadTableTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});
        await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: fakeUserId});
        replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
    });

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await ReplyTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addReply function", () => {
        it("should add reply correctly", async () => {
            const reply = await replyRepositoryPostgres.addReply(payload, fakeCommentId, fakeUserId);
            expect(reply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: payload.content,
                owner: fakeUserId,
            }));
        });
    });
})