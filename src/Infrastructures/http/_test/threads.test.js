const ThreadRepositoryTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require('../createServer');
const container = require("../../container");

describe("/threads endpoint", () => {
    afterEach(async () => {
        await ThreadRepositoryTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
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

        return JSON.parse(loginResponse.payload).data.accessToken;
    };

    describe("when POST /threads", () => {
        let server;

        beforeEach(async () => {
            server = await createServer(container);
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
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada');
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
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data tidak sesuai');
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
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });
});