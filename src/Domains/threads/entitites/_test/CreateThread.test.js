const CreateThread = require("../CreateThread");

describe("CreateThread entity", () => {
    it("should throw error when payload does not contain needed property", () => {
        // Arrange
        const payload = {
            title: "title",
        };

        // Action & Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it("should throw error when payload not meet data type specification", () => {
        // Arrange
        const payload = {
            title: 123,
            body: "body",
        };

        // Action & Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');

    });

    it("should create CreateThread entities correctly", () => {
        // Arrange
        const payload = {
            title: "title",
            body: "body",
        };

        // Action
        const createThread = new CreateThread(payload);

        // Assert
        expect(createThread).toBeInstanceOf(CreateThread);
        expect(createThread.title).toStrictEqual(payload.title);
        expect(createThread.body).toStrictEqual(payload.body);
    });
});