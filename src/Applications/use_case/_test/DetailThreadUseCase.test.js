const Thread = require("../../../Domains/threads/entities/Thread");
const Comment = require("../../../Domains/comments/entities/Comment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
    it("should orchestrating the add thread action correctly", async () => {

        const mockComment = [{
            id: "comment-123",
            content: "content",
            date: "date",
            username: "username",
        }];

        const mockThread = {
            id: "thread-123",
            title: "title",
            body: "body",
            date: "date",
            username: "username",
            comments: mockComment,
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.detailThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve(new Thread({
                ...mockThread,
                comments: mockComment.map((comment) => new Comment(comment)),
            })));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
        });
        const thread = await detailThreadUseCase.execute("thread-123");

        expect(mockThreadRepository.detailThread).toBeCalledWith("thread-123");
        expect(thread).toStrictEqual(new Thread({
            ...mockThread,
            comments: mockComment.map((comment) => new Comment(comment)),
        }));
    });
});
