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
        const comments = Comment.createWithReplies(commentsRaw, repliesRaw);

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
