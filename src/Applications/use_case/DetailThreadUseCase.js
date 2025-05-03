const Comment = require("../../Domains/comments/entities/Comment");
const Thread = require("../../Domains/threads/entities/Thread");

class DetailThreadUseCase {
    constructor({threadRepository, commentRepository, replyRepository, likeCommentRepository}) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeCommentRepository = likeCommentRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.findThreadById(threadId);
        const commentsRaw = await this._commentRepository.getCommentsByThreadId(threadId);
        const commentIds = commentsRaw.map((c) => c.id);
        const repliesRaw = await this._replyRepository.getRepliesByCommentIds(commentIds);
        const likedCommentsRaw = await this._likeCommentRepository.getLikesByCommentIds(commentIds);

        const comments = Comment.createWithReplies(commentsRaw, repliesRaw, likedCommentsRaw);

        const newthread = new Thread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments,
        });
        return newthread;
    }
}

module.exports = DetailThreadUseCase;
