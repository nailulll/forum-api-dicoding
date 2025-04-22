const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

describe("ReplyRepositoryPostgres", () => {
  const fakeIdGenerator = () => "123";
  const fakeUserId = "user-123";
  const fakeThreadId = "thread-123";
  const fakeCommentId = "comment-123";
  const payload = { content: "content" };
  let replyRepositoryPostgres;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: fakeUserId });
    await ThreadTableTestHelper.addThread({
      id: fakeThreadId,
      owner: fakeUserId,
    });
    await CommentTableTestHelper.addComment({
      id: fakeCommentId,
      threadId: fakeThreadId,
      owner: fakeUserId,
    });
    replyRepositoryPostgres = new ReplyRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
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
      const reply = await replyRepositoryPostgres.addReply(
        payload,
        fakeCommentId,
        fakeUserId
      );
      expect(reply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: payload.content,
          owner: fakeUserId,
        })
      );
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError when reply not owner", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "johndoe",
      });
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
        commentId: fakeCommentId,
        content: payload.content,
        owner: "user-456",
      });
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", fakeUserId)
      ).rejects.toThrowError("anda tidak berhak mengakses resource ini");
    });

    it("should verify reply correctly", async () => {
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
        commentId: fakeCommentId,
        content: payload.content,
        owner: fakeUserId,
      });
      const reply = await replyRepositoryPostgres.verifyReplyOwner(
        "reply-123",
        fakeUserId
      );
      const replyById = await ReplyTableTestHelper.findRepliesById("reply-123");
      expect(reply).toStrictEqual(replyById[0]);
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply correctly", async () => {
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
        commentId: fakeCommentId,
        content: payload.content,
        owner: fakeUserId,
      });
      await replyRepositoryPostgres.deleteReply("reply-123");
      const replies = await ReplyTableTestHelper.findRepliesById("reply-123");
      expect(replies[0].is_delete).toBe(true);
    });
  });

  describe("findReplyById function", () => {
    it("should return replies correctly", async () => {
      await ReplyTableTestHelper.addReply({
        id: "reply-123",
        commentId: fakeCommentId,
        content: payload.content,
        owner: fakeUserId,
      });
      const reply = await replyRepositoryPostgres.findReplyById("reply-123");
      const replyById = await ReplyTableTestHelper.findRepliesById("reply-123");
      await expect(reply).toStrictEqual(replyById[0]);
    });

    it("should throw NotFoundError when reply not found", async () => {
      await expect(
        replyRepositoryPostgres.findReplyById("reply-123")
      ).rejects.toThrowError("balasan tidak ditemukan");
    });
  });
});
