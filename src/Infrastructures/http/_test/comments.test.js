const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");

const pool = require("../../database/postgres/pool");
const createServer = require('../createServer');
const container = require("../../container");

describe("/threads/{threadId}/comments endpoint", () => {

    afterEach(async () => {
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });


    const addUserAndLogin = async (server) => {
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            },
        });

        const loginResponse = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'dicoding',
                password: 'secret',
            },
        });

        const {data: {accessToken}} = JSON.parse(loginResponse.payload);

        return accessToken;
    };

    describe("when POST /threads/{threadId}/comments", () => {

        it("should response 404 when thread not found", async () => {
            const server = await createServer(container);

            const accessToken = await addUserAndLogin(server);

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123456/comments",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: "content",
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it("should response 400 when request payload not contain needed property", async () => {
            const server = await createServer(container);

            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {},
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada');
        });

        it("should response 400 when request payload wrong data type", async () => {
            const server = await createServer(container);

            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: 123,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar karena tipe data tidak sesuai');
        });

        it("should response 201 and persisted comment", async () => {
            const server = await createServer(container);

            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: "content",
                },
            });
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });

    });

});
