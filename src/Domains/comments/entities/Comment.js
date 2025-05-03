const Reply = require("../../replies/entities/Reply");

class Comment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.content = payload.is_delete ? "**komentar telah dihapus**" : payload.content;
        this.date = payload.date;
        this.username = payload.username;
        this.replies = payload.replies || [];
        this.likeCount = payload.likeCount;
    }

    _verifyPayload(payload) {
        const {id, content, date, username, replies, likeCount} = payload;

        if (!id || !content || !date || !username || likeCount == null) {
            throw new Error("COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (
            typeof id !== "string" ||
            typeof content !== "string" ||
            typeof date !== "string" ||
            typeof username !== "string" ||
            typeof likeCount !== "number"
        ) {
            throw new Error("COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }

        if (replies && !Array.isArray(payload.replies)) {
            throw new Error("COMMENT.REPLIES_NOT_ARRAY");
        }

        if (replies && !replies.every((reply) => reply instanceof Reply)) {
            throw new Error("COMMENT.REPLIES_NOT_ARRAY_OF_REPLY");
        }
    }

    static createWithReplies(commentsRaw, repliesRaw, likedCommentsRaw) {
        return commentsRaw.map((comment) => {
            const replies = repliesRaw
                .filter((reply) => reply.comment_id === comment.id)
                .map((reply) => new Reply({
                    id: reply.id,
                    content: reply.content,
                    date: reply.date,
                    username: reply.username,
                    is_delete: reply.is_delete,
                }));

            const likeCount = likedCommentsRaw.filter((likedComment) => likedComment.comment_id === comment.id).length;
            return new Comment({
                id: comment.id,
                content: comment.content,
                date: comment.date,
                username: comment.username,
                is_delete: comment.is_delete,
                likeCount: likeCount,
                replies,
            });
        });
    }
}

module.exports = Comment;
