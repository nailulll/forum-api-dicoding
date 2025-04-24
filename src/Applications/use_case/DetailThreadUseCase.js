const Reply = require("../../Domains/replies/entities/Reply");
const Comment = require("../../Domains/comments/entities/Comment");
const Thread = require("../../Domains/threads/entities/Thread");

class DetailThreadUseCase {
    constructor({threadRepository, commentRepository, replyRepository}) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.findThreadById(threadId);
        const commentsRaw = await this._commentRepository.getCommentsByThreadId(threadId);
        const commentIds = commentsRaw.map((c) => c.id);
        const repliesRaw = await this._replyRepository.getRepliesByCommentIds(commentIds);

        const comments = commentsRaw.map((comment) => {
            const replies = repliesRaw
                .filter((reply) => reply.comment_id === comment.id)
                .map((reply) => new Reply({
                    id: reply.id,
                    content: reply.content,
                    date: reply.date,
                    username: reply.username,
                    is_delete: reply.is_delete
                }));

            return new Comment({
                id: comment.id,
                content: comment.content,
                date: comment.date,
                username: comment.username,
                is_delete: comment.is_delete,
                replies,
            });
        });


        return new Thread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments,
        });
    }
}

module.exports = DetailThreadUseCase;
