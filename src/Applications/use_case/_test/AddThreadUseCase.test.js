const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");

describe("AddThreadUseCase", () => {
    it("should orchestrating the add thread action correctly", async () => {

        const userId = "user-123";
        const useCasePayload = {
            title: "title",
            body: "body",
        };

        const mockCreatedThread = new CreatedThread({
            id: "thread-123",
            title: useCasePayload.title,
            username: userId,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const createdThread = await addThreadUseCase.execute(useCasePayload, userId);

        expect(mockThreadRepository.addThread).toBeCalledWith(
            new CreateThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
            }),
            userId,
        );

        expect(createdThread).toStrictEqual(
            new CreatedThread({
                id: "thread-123",
                title: useCasePayload.title,
                username: userId,
            })
        );
    });
});
