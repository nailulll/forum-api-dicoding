const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const LikeCommentTableTestHelper = require("../../../../tests/LikeCommentTableTestHelper");

describe("like comment endpoint", () => {

    afterEach(async () => {
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await LikeCommentTableTestHelper.cleanTable();
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

        const {
            data: {accessToken},
        } = JSON.parse(loginResponse.payload);

        return accessToken;
    };


    describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
        it("should return 401 if not login", async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: "PUT",
                url: "/threads/thread-123/comments/comment-123/likes",
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual("Unauthorized");
            expect(responseJson.message).toEqual("Missing authentication");
        });

        it("should return 404 if thread not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const response = await server.inject({
                method: "PUT",
                url: "/threads/thread-123/comments/comment-123/likes",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("thread tidak ditemukan");
        });

        it("should return 404 if comment not found", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = 'user-123456';

            await UsersTableTestHelper.addUser({
                id: fakeUserId,
                username: "johndoe",
            });
            await ThreadRepositoryTestHelper.addThread({
                id: fakeThreadId,
                owner: fakeUserId,
            });

            const response = await server.inject({
                method: "PUT",
                url: `/threads/${fakeThreadId}/comments/comment-123/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("komentar tidak ditemukan");
        });

        it("should return 200 when like comment", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = 'user-123456';
            const fakeCommentId = 'comment-123456';

            await UsersTableTestHelper.addUser({
                id: fakeUserId,
                username: "johndoe",
            });
            await ThreadRepositoryTestHelper.addThread({
                id: fakeThreadId,
                owner: fakeUserId,
            });
            await CommentTableTestHelper.addComment({
                id: fakeCommentId,
                threadId: fakeThreadId,
                owner: fakeUserId,
            });

            const response = await server.inject({
                method: "PUT",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            const likedComment = await LikeCommentTableTestHelper.getAll();
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
            expect(likedComment).toHaveLength(1);
        });

        it("should return 200 when like comment and unlike comment", async () => {
            const server = await createServer(container);
            const accessToken = await addUserAndLogin(server);

            const fakeThreadId = "thread-123456";
            const fakeUserId = 'user-123456';
            const fakeCommentId = 'comment-123456';

            await UsersTableTestHelper.addUser({
                id: fakeUserId,
                username: "johndoe",
            });
            await ThreadRepositoryTestHelper.addThread({
                id: fakeThreadId,
                owner: fakeUserId,
            });
            await CommentTableTestHelper.addComment({
                id: fakeCommentId,
                threadId: fakeThreadId,
                owner: fakeUserId,
            });

            const responseLikeComment = await server.inject({
                method: "PUT",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseUnlikeComment = await server.inject({
                method: "PUT",
                url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseUnlikeCommentJson = JSON.parse(responseUnlikeComment.payload);
            const responseLikeCommentJson = JSON.parse(responseLikeComment.payload);
            const likedComment = await LikeCommentTableTestHelper.getAll();

            expect(responseUnlikeComment.statusCode).toEqual(200);
            expect(responseUnlikeCommentJson.status).toEqual("success");
            expect(responseLikeComment.statusCode).toEqual(200);
            expect(responseLikeCommentJson.status).toEqual("success");
            expect(likedComment).toHaveLength(0);
        });
    });
});