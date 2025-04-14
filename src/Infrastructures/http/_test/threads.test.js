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

    describe("when POST /threads", () => {
        it("should response 201 and persisted thread", async () => {
            await UsersTableTestHelper.addUser({
                id: 'user-1234',
                username: 'dicoding4',
                password: 'secret4',
                fullname: 'Dicoding Indonesia 4',
            });

            const requestPayload = {
                title: "title",
                body: "body",
            };

            const server = await createServer(container);

            // add user
            const responseUser = await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                },
            });

            const {data: {accessToken}} = JSON.parse(loginResponse.payload);

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

            expect(1).toBe(1);
        });
    });

});