const pool = require("../../database/postgres/pool");
const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CreateThread = require("../../../Domains/threads/entitites/CreateThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const CreatedThread = require("../../../Domains/threads/entitites/CreatedThread");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
    afterEach(async () => {
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
            }))

        });
    });
});