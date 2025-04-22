// const createServer = require("../createServer");
// const container = require("../../container");
// const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
// const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
// const pool = require("../../database/postgres/pool");
//
// describe("replies endpoint", () => {
//
//     afterEach(async () => {
//         await ThreadRepositoryTestHelper.cleanTable();
//         await UsersTableTestHelper.cleanTable();
//         await CommentTableTestHelper.cleanTable();
//     });
//
//     afterAll(async () => {
//         await pool.end();
//     });
//
//
//     const addUserAndLogin = async (server) => {
//         await server.inject({
//             method: 'POST',
//             url: '/users',
//             payload: {
//                 username: 'dicoding',
//                 password: 'secret',
//                 fullname: 'Dicoding Indonesia',
//             },
//         });
//
//         const loginResponse = await server.inject({
//             method: 'POST',
//             url: '/authentications',
//             payload: {
//                 username: 'dicoding',
//                 password: 'secret',
//             },
//         });
//
//         const {data: {accessToken}} = JSON.parse(loginResponse.payload);
//
//         return accessToken;
//     };
//
//     describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
//         it("should response 401 when request not contain access token", async () => {
//             const server = await createServer(container);
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: "/threads/thread-123456/comments/comment-123456/replies",
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(401);
//             expect(responseJson.error).toEqual('Unauthorized');
//             expect(responseJson.message).toEqual('Missing authentication');
//         });
//
//         it("should response 404 when thread not found", async () => {
//             const server = await createServer(container);
//             const accessToken = await addUserAndLogin(server);
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: "/threads/thread-123456/comments/comment-123456/replies",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 payload: {
//                     content: "content",
//                 },
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(404);
//             expect(responseJson.status).toEqual('fail');
//             expect(responseJson.message).toEqual('thread tidak ditemukan');
//         });
//
//         it("should response 404 when comment not found", async () => {
//             const server = await createServer(container);
//             const accessToken = await addUserAndLogin(server);
//
//             const fakeThreadId = "thread-123456";
//
//             await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
//             await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: `/threads/${fakeThreadId}/comments/comment-123456/replies`,
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 payload: {
//                     content: "content",
//                 },
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(404);
//             expect(responseJson.status).toEqual('fail');
//             expect(responseJson.message).toEqual('komentar tidak ditemukan');
//         });
//
//         it("should response 400 when payload not contain content", async () => {
//             const server = await createServer(container);
//             const accessToken = await addUserAndLogin(server);
//
//             const fakeThreadId = "thread-771";
//             const fakeCommentId = "comment-771";
//
//             await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
//             await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
//             await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 payload: {
//                     content: "",
//                 },
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(400);
//             expect(responseJson.status).toEqual('fail');
//             expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena properti yang dibutuhkan tidak ada');
//         });
//
//         it("should response 400 when content not meet data type specification", async () => {
//             const server = await createServer(container);
//             const accessToken = await addUserAndLogin(server);
//
//             const fakeThreadId = "thread-771";
//             const fakeCommentId = "comment-771";
//
//             await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
//             await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
//             await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 payload: {
//                     content: 123,
//                 },
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(400);
//             expect(responseJson.status).toEqual('fail');
//             expect(responseJson.message).toEqual('tidak dapat membuat balasan komentar karena tipe data tidak sesuai');
//         });
//
//         it("should response 201 and persisted reply", async () => {
//             const server = await createServer(container);
//             const accessToken = await addUserAndLogin(server);
//
//             const fakeThreadId = "thread-771";
//             const fakeCommentId = "comment-771";
//
//             await UsersTableTestHelper.addUser({id: "user-123", username: "johndoe"});
//             await ThreadRepositoryTestHelper.addThread({id: fakeThreadId, owner: "user-123"});
//             await CommentTableTestHelper.addComment({id: fakeCommentId, threadId: fakeThreadId, owner: "user-123"});
//
//             const response = await server.inject({
//                 method: "POST",
//                 url: `/threads/${fakeThreadId}/comments/${fakeCommentId}/replies`,
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 payload: {
//                     content: "content",
//                 },
//             });
//
//             const responseJson = JSON.parse(response.payload);
//             expect(response.statusCode).toEqual(201);
//             expect(responseJson.status).toEqual('success');
//             expect(responseJson.data).toBeDefined();
//             expect(responseJson.data.addedReply).toBeDefined();
//         });
//     });
// });