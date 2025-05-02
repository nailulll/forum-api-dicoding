const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikeCommentTableTestHelper = require("../../../../tests/LikeCommentTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeCommentRepositoryPostgres = require("../LikeCommentRepositoryPostgres");

describe("LikeCommentRepositoryPostgres", () => {
    const fakeIdGenerator = () => "123";
    const fakeUserId = "user-123";
    const fakeThreadId = "thread-123";
    const fakeCommentId = "comment-123";
    let likeCommentRepositoryPostgres;

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({id: fakeUserId});
        await ThreadTableTestHelper.addThread({
            id: fakeThreadId, owner: fakeUserId,
        });
        await CommentTableTestHelper.addComment({
            id: fakeCommentId, threadId: fakeThreadId, owner: fakeUserId,
        });
        likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);
    });

    afterEach(async () => {
        await ReplyTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await LikeCommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("likeComment function", () => {
        it("should return like comment correctly", async () => {
            const likeComment = await likeCommentRepositoryPostgres.likeComment(fakeCommentId, fakeUserId);
            expect(likeComment).toStrictEqual({id: likeComment.id});
        });

        it("should persist add comment", async () => {
            const likeComment = await likeCommentRepositoryPostgres.likeComment(fakeCommentId, fakeUserId);
            const liked = await LikeCommentTableTestHelper.findLikeCommentById(likeComment.id);
            expect(liked).toHaveLength(1);
        });
    });

    describe("unlikeComment function", () => {
        it("should delete like comment correctly", async () => {
            const likedComment = await likeCommentRepositoryPostgres.likeComment(fakeCommentId, fakeUserId);
            await likeCommentRepositoryPostgres.unlikeComment(fakeCommentId, fakeUserId);
            const liked = await LikeCommentTableTestHelper.findLikeCommentById(likedComment.id);
            expect(liked).toHaveLength(0);
        });
    });

    describe("findLikeComment function", () => {
        it("should return true when there is a comment", async () => {
            const likeId = "like-123";
            await LikeCommentTableTestHelper.addLikeComment({
                id: likeId,
                commentId: fakeCommentId,
                userId: fakeUserId
            });
            const liked = await likeCommentRepositoryPostgres.findLikeComment(fakeCommentId, fakeUserId);
            const likedComment = await LikeCommentTableTestHelper.findLikeCommentById(likeId);
            expect(liked).toBe(true);
            expect(likedComment).toHaveLength(1);
        });

        it("should return false when there is no comment", async () => {
            const liked = await likeCommentRepositoryPostgres.findLikeComment(fakeCommentId, fakeUserId);
            const likedComment = await LikeCommentTableTestHelper.findLikeCommentById("123");
            expect(liked).toBe(false);
            expect(likedComment).toHaveLength(0);
        });
    });

});