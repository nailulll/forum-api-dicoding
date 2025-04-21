const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");

const pool = require("../../database/postgres/pool");
const createServer = require('../createServer');
const container = require("../../container");

describe("comments endpoint", () => {

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

        it("should response 401 when request not contain access token", async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123456/comments",
                payload: {
                    content: "content",
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

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

    describe("when POST /threads/{threadId}/comments/{commentId}", () => {

        it("should response 401 when request not contain access token", async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: "DELETE",
                url: "/threads/thread-123456/comments/comment-123456",
                payload: {
                    content: "content",
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it("should response 404 when thread not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const response = await server.inject({
                method: "DELETE",
                url: "/threads/thread-123456/comments/comment-123456",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it("should response 404 when thread found but comment not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${fakeThreadId}/comments/comment-123456`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it("should response 403 when comment not owned by user", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const fakeCommentId = "comment-123456";
            await CommentTableTestHelper.addComment({id: fakeCommentId, owner: fakeUserId, threadId: fakeThreadId});

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
        });

        it("should response 200 and deleted comment", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = "user-321";

            await UsersTableTestHelper.addUser({id: fakeUserId, username: "dicoding2"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: fakeUserId});

            const responseCreateComment = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: "content",
                },
            });
            const responseCreateCommentJson = JSON.parse(responseCreateComment.payload);
            const commentId = responseCreateCommentJson.data.addedComment.id;

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${fakeThreadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            const deletedComment = await CommentTableTestHelper.findCommentsById(commentId);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(deletedComment[0].is_delete).toEqual(true);
        });
    });

    describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
        it("should response 401 when request not contain access token", async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123456/comments/comment-123456/replies",
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it("should response 404 when thread not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123456/comments/comment-123456/replies",
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

        it("should response 404 when comment not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";

            await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments/comment-123456/replies`,
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
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it("should response 400 when payload not contain content", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-771";
            const fakeCommentId = "comment-771";

            await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
            await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: "",
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena properti yang dibutuhkan tidak ada');
        });

        it("should response 400 when content not meet data type specification", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-771";
            const fakeCommentId = "comment-771";

            await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
            await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
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
            expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena tipe data tidak sesuai');
        });

        it("should response 201 and persisted reply", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-771";
            const fakeCommentId = "comment-771";

            await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
            await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
            await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});

            const response = await server.inject({
                method: "POST",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
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
            expect(responseJson.data).toBeDefined();
            expect(responseJson.data.addedReply).toBeDefined();
        });
    });

});
