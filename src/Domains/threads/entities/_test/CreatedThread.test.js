const CreatedThread = require("../CreatedThread");
describe("CreatedThread entity", () => {
    it("should throw error when payload does not contain needed property", () => {
        // Arrange
        const payload = {
            title: "title",
            owner: "owner",
        };

        // Action & Assert
        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it("should throw error when payload not meet data type specification", () => {
        // Arrange
        const payload = {
            id: 123,
            title: "title",
            owner: "owner",
        };

        // Action & Assert
        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it("should create CreatedThread entities correctly", () => {
        // Arrange
        const payload = {
            id: "thread-123",
            title: "title",
            owner: "owner",
        };

        // Action
        const createdThread = new CreatedThread(payload);

        // Assert
        expect(createdThread).toBeInstanceOf(CreatedThread);
        expect(createdThread.id).toEqual(payload.id);
        expect(createdThread.title).toEqual(payload.title);
        expect(createdThread.owner).toEqual(payload.owner);
    })
})