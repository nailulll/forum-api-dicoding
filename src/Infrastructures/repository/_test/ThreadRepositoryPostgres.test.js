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
    it("should return add thread correctly", async () => {
      const createThread = new CreateThread({ title: "title", body: "body" });
      const fakeIdGenerator = () => "123";
      const fakeUserId = "user-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({ id: fakeUserId });
      const thread = await threadRepositoryPostgres.addThread(
        createThread,
        fakeUserId
      );

      expect(thread).toStrictEqual(
        new CreatedThread({
          id: "thread-123",
          title: createThread.title,
          username: fakeUserId,
        })
      );
    });

    it("should persist add thread", async () => {
      const createThread = new CreateThread({ title: "title", body: "body" });
      const fakeIdGenerator = () => "123";
      const fakeUserId = "user-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({ id: fakeUserId });
      const createdThread = await threadRepositoryPostgres.addThread(createThread, fakeUserId);

      const thread = await ThreadRepositoryTestHelper.findThreadById(createdThread.id);
      expect(thread).toHaveLength(1);

    });
  });

  describe("findThreadById function", () => {
    it("should throw NotFoundError when thread not available", () => {
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const thread = threadRepositoryPostgres.findThreadById("thread-123");
      return expect(thread).rejects.toThrowError("thread tidak ditemukan");
    });

    it("should return thread correctly", async () => {
      const createThread = new CreateThread({ title: "title", body: "body" });
      const fakeIdGenerator = () => "123";
      const fakeUserId = "user-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({ id: fakeUserId });
      const createdThread = await threadRepositoryPostgres.addThread(
        createThread,
        fakeUserId
      );

      const thread = await threadRepositoryPostgres.findThreadById(
        createdThread.id
      );

      expect(thread).toStrictEqual({
        id: createdThread.id,
        title: createThread.title,
        body: createThread.body,
        date: expect.any(String),
        username: fakeUserId,
      });
    });
  });
});
