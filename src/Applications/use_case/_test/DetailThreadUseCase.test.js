const Thread = require("../../../Domains/threads/entities/Thread");
const Comment = require("../../../Domains/comments/entities/Comment");
const Reply = require("../../../Domains/replies/entities/Reply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("DetailThreadUseCase", () => {
    it("should orchestrating the add thread action correctly", async () => {
        const replies = [{
            id: "reply-123",
            content: "content",
            date: "date",
            username: "owner",
        }];

        const comments = [{
            id: "comment-123",
            content: "content",
            date: "date",
            username: "username",
            replies: replies,
        }];

        const thread = {
            id: "thread-123",
            title: "title",
            body: "body",
            date: "date",
            username: "username",
            comments: comments,
        };

        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.findThreadById = jest
            .fn()
            .mockImplementation(() => Promise.resolve({
                id: thread.id,
                title: thread.title,
                body: thread.body,
                username: thread.username,
                date: thread.date,
            }));

        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve([{
                id: comments[0].id,
                content: comments[0].content,
                date: comments[0].date,
                username: comments[0].username,
                is_delete: false,
            }]));

        mockReplyRepository.getRepliesByCommentIds = jest
            .fn()
            .mockImplementation(() => Promise.resolve([{
                id: replies[0].id,
                content: replies[0].content,
                date: replies[0].date,
                username: replies[0].username,
                is_delete: false,
                comment_id: comments[0].id,
            }]));


        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });
        const detailThread = await detailThreadUseCase.execute(thread.id);

        expect(mockThreadRepository.findThreadById).toBeCalledWith(thread.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(thread.id);
        expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([comments[0].id]);
        expect(detailThread).toStrictEqual(new Thread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments: comments.map((comment) => new Comment({
                ...comment,
                replies: replies.map((reply) => new Reply(reply)),
            })),
        }));
    });
});
