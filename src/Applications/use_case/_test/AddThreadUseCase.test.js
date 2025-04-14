const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
    it("should orchestrating the add thread action correctly", async () => {

        const userId = "user-123";

        const useCasePayload = {
            title: "title",
            body: "body",
            owner: userId,
        };

        const mockCreatedThread = new CreatedThread({
            id: "thread-123",
            title: useCasePayload.title,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });
        const createdThread = await addThreadUseCase.execute(useCasePayload, userId);

        expect(createdThread).toStrictEqual(mockCreatedThread);
    });
});