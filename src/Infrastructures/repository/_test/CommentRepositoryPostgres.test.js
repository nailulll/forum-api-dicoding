const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");

describe("CommentRepositoryPostgres", () => {
  const fakeIdGenerator = () => "123";
  const fakeUserId = "user-123";
  const fakeThreadId = "thread-123";
  const payload = { content: "content" };
  let commentRepositoryPostgres;

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: fakeUserId });
    await ThreadTableTestHelper.addThread({
      id: fakeThreadId,
      owner: fakeUserId,
    });
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should return add comment correctly", async () => {
      const comment = await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      expect(comment).toStrictEqual(
        new CreatedComment({
          id: "comment-123",
          content: payload.content,
          owner: fakeUserId,
        })
      );
    });
    it("should persist add comment", async () => {
      await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      const comment = await CommentTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly", async () => {
      const comment = await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      await commentRepositoryPostgres.deleteComment(comment.id);
      const deletedComment = await CommentTableTestHelper.findCommentsById(
        comment.id
      );
      expect(deletedComment[0].is_delete).toEqual(true);
    });
  });

  describe("findCommentById function", () => {
    it("should return comments correctly", async () => {
      const addComment = await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      const comment = await commentRepositoryPostgres.findCommentById(
        addComment.id
      );
      expect(comment).toStrictEqual({
        id: addComment.id,
        thread_id: fakeThreadId,
        content: payload.content,
        owner: fakeUserId,
        date: expect.any(String),
        is_delete: false,
      });
    });

    it("should throw NotFoundError when comment not found", async () => {
      await expect(
        commentRepositoryPostgres.findCommentById("comment-123")
      ).rejects.toThrowError("komentar tidak ditemukan");
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should return comment correctly", async () => {
      const addComment = await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      const comment = await commentRepositoryPostgres.verifyCommentOwner(
        addComment.id,
        fakeUserId
      );
      await expect(comment).toStrictEqual({
        id: addComment.id,
        thread_id: fakeThreadId,
        content: payload.content,
        owner: fakeUserId,
        date: expect.any(String),
        is_delete: false,
      });
    });

    it("should throw AuthorizationError when comment not owner", async () => {
      const fakeSecondUserId = "user-456";
      await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      await UsersTableTestHelper.addUser({
        id: fakeSecondUserId,
        username: "dicoding456",
      });
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          "comment-123",
          fakeSecondUserId
        )
      ).rejects.toThrowError("anda tidak berhak mengakses resource ini");
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments correctly", async () => {
      await commentRepositoryPostgres.addComment(
        payload,
        fakeThreadId,
        fakeUserId
      );
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        fakeThreadId
      );

      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual({
        id: expect.any(String),
        content: payload.content,
        username: "dicoding",
        date: expect.any(String),
        is_delete: false,
      })
    });

    it("should return empty array when thread has no comments", async () => {
      const comments = await commentRepositoryPostgres.getCommentsByThreadId("thread-xyz");
      expect(comments).toHaveLength(0);
      expect(comments).toStrictEqual([]);
    })
  });
});
