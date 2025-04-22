const pool = require("../../database/postgres/pool");
const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
    afterEach(async () => {
        await ReplyTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();

    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addThread function", () => {
        it("should add thread correctly", async () => {
            const createThread = new CreateThread({title: "title", body: "body"});
            const fakeIdGenerator = () => '123';
            const fakeUserId = 'user-123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({id: fakeUserId});
            const thread = await threadRepositoryPostgres.addThread(createThread, fakeUserId);

            expect(thread).toStrictEqual(new CreatedThread({
                id: 'thread-123',
                title: createThread.title,
                owner: fakeUserId
            }));
        });
    });

    describe("findThreadById function", () => {
        it("should throw NotFoundError when thread not available", () => {
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const thread = threadRepositoryPostgres.findThreadById('thread-123');
            return expect(thread).rejects.toThrowError('thread tidak ditemukan');
        });

        it("should return thread correctly", async () => {
            const createThread = new CreateThread({title: "title", body: "body"});
            const fakeIdGenerator = () => '123';
            const fakeUserId = 'user-123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({id: fakeUserId});
            const createdThread = await threadRepositoryPostgres.addThread(createThread, fakeUserId);

            const thread = await threadRepositoryPostgres.findThreadById(createdThread.id);
            expect(thread).toBeDefined();
        });
    });

    describe("detailThread function", () => {
        it("should throw NotFoundError when thread not available", () => {
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const thread = threadRepositoryPostgres.detailThread('thread-123');
            return expect(thread).rejects.toThrowError('thread tidak ditemukan');
        });

        it("should return detail thread correctly", async () => {
            const userDicoding = {id: 'user-123', username: 'dicoding'};
            const userJohnDoe = {id: 'user-456', username: 'johndoe', fullname: "John Doe"};

            const thread = {id: 'thread-123', title: 'title', body: 'body', date: 'date', owner: userDicoding.id};

            const commentUserJohnDoe = {
                owner: userJohnDoe.id,
                threadId: thread.id,
                content: 'content',
                id: 'comment-123',
            };
            const commentUserDicoding = {
                owner: userDicoding.id,
                threadId: thread.id,
                content: 'content',
                id: 'comment-456',
            };

            await UsersTableTestHelper.addUser({
                ...userDicoding,
            });
            await UsersTableTestHelper.addUser({
                ...userJohnDoe,
            });

            await ThreadRepositoryTestHelper.addThread({
                ...thread,
            });

            await CommentsTableTestHelper.addComment(commentUserJohnDoe);
            await CommentsTableTestHelper.addComment(commentUserDicoding);

            await CommentsTableTestHelper.deleteCommentById(commentUserDicoding.id);

            const replyId1 = 'reply-123';
            const replyId2 = 'reply-456';

            await ReplyTableTestHelper.addReply({
                ...commentUserJohnDoe,
                commentId: commentUserJohnDoe.id,
                id: replyId1,
            });

            await ReplyTableTestHelper.addReply({
                ...commentUserJohnDoe,
                commentId: commentUserJohnDoe.id,
                id: replyId2,
            });

            await ReplyTableTestHelper.deleteReplyById(replyId2);

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const threadDetail = await threadRepositoryPostgres.detailThread(thread.id);

            expect(threadDetail).toBeDefined();
            expect(JSON.parse(JSON.stringify(threadDetail))).toMatchObject({
                id: thread.id,
                title: thread.title,
                body: thread.body,
                username: userDicoding.username,
                date: expect.any(String),
                comments: expect.arrayContaining([
                    expect.objectContaining({
                        id: commentUserJohnDoe.id,
                        content: commentUserJohnDoe.content,
                        username: userJohnDoe.username,
                        date: expect.any(String),
                        replies: [
                            expect.objectContaining({
                                id: replyId1,
                                content: commentUserJohnDoe.content,
                                username: userJohnDoe.username,
                                date: expect.any(String),
                            }),
                            expect.objectContaining({
                                id: replyId2,
                                content: "**balasan telah dihapus**",
                                username: userJohnDoe.username,
                                date: expect.any(String),
                            }),
                        ],
                    }),
                    expect.objectContaining({
                        id: commentUserDicoding.id,
                        content: "**komentar telah dihapus**",
                        username: userDicoding.username,
                        date: expect.any(String),
                    }),
                ]),
            });
            expect(threadDetail.comments).toHaveLength(2);

        });
    });
});