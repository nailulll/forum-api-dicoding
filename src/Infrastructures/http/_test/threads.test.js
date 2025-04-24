const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const CommentsTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/ReplyTableTestHelper");

describe("/threads endpoint", () => {
    afterEach(async () => {
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    const addUserAndLogin = async (server) => {
        await server.inject({
            method: "POST",
            url: "/users",
            payload: {
                username: "dicoding",
                password: "secret",
                fullname: "Dicoding Indonesia",
            },
        });

        const loginResponse = await server.inject({
            method: "POST",
            url: "/authentications",
            payload: {
                username: "dicoding",
                password: "secret",
            },
        });

        return JSON.parse(loginResponse.payload).data.accessToken;
    };

    describe("when POST /threads", () => {
        let server;

        beforeEach(async () => {
            server = await createServer(container);
        });

        it("should response 401 when request not contain access token", async () => {
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "title",
                    body: "body",
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual("Unauthorized");
            expect(responseJson.message).toEqual("Missing authentication");
        });

        it("should response 400 when request payload not contain needed property", async () => {
            const accessToken = await addUserAndLogin(server);

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread karena properti yang dibutuhkan tidak ada"
            );
        });

        it("should response 400 when request payload not meet data type specification", async () => {
            const accessToken = await addUserAndLogin(server);
            const requestPayload = {
                title: "title",
                body: 123,
            };

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread karena tipe data tidak sesuai"
            );
        });

        it("should response 201 and persisted thread", async () => {
            const accessToken = await addUserAndLogin(server);
            const requestPayload = {
                title: "title",
                body: "body",
            };

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });

    describe("when GET /threads/{threadId}", () => {
        let server;

        beforeEach(async () => {
            server = await createServer(container);
        });

        it("should response 404 when thread not found", async () => {
            const response = await server.inject({
                method: "GET",
                url: "/threads/thread-123",
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("thread tidak ditemukan");
        });

        it("should response 200 and thread detail", async () => {
            const userDicoding = {id: "user-123", username: "dicoding"};
            const userJohnDoe = {
                id: "user-456",
                username: "johndoe",
                fullname: "John Doe",
            };

            const thread = {
                id: "thread-123",
                title: "title",
                body: "body",
                date: "date",
                owner: userDicoding.id,
            };

            const commentUserJohnDoe = {
                owner: userJohnDoe.id,
                threadId: thread.id,
                content: "content",
                id: "comment-123",
            };
            const commentUserDicoding = {
                owner: userDicoding.id,
                threadId: thread.id,
                content: "content",
                id: "comment-456",
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

            await RepliesTableTestHelper.addReply({
                id: "reply-123",
                threadId: thread.id,
                commentId: commentUserJohnDoe.id,
                content: "content",
                owner: userJohnDoe.id,
            });
            await RepliesTableTestHelper.addReply({
                id: "reply-456",
                threadId: thread.id,
                commentId: commentUserJohnDoe.id,
                content: "content",
                owner: userJohnDoe.id,
            });
            await RepliesTableTestHelper.deleteReplyById("reply-456");


            const response = await server.inject({
                method: "GET",
                url: `/threads/${thread.id}`,
            });
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread).toMatchObject({
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
                        replies: expect.arrayContaining([
                            expect.objectContaining({
                                id: "reply-456",
                                content: "**balasan telah dihapus**",
                                username: userJohnDoe.username,
                                date: expect.any(String),
                            }),
                            expect.objectContaining({
                                id: "reply-123",
                                content: commentUserJohnDoe.content,
                                username: userJohnDoe.username,
                                date: expect.any(String),
                            }),
                        ])
                    }),
                    expect.objectContaining({
                        id: commentUserDicoding.id,
                        content: "**komentar telah dihapus**",
                        username: userDicoding.username,
                        date: expect.any(String),
                    }),
                ]),
            });
        });
    });
});
