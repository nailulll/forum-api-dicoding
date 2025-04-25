const Comment = require("../Comment");
const Reply = require("../../../replies/entities/Reply");

describe("Comment entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Action & Assert
    expect(() => new Comment({})).toThrowError(
      "COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: 123,
      date: "2021-01-01",
      username: "user-123",
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload replies not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: "replies",
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.REPLIES_NOT_ARRAY"
    );
  });

  it("should throw error when payload replies not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: [{}],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.REPLIES_NOT_ARRAY_OF_REPLY"
    );
  });

  it("should create Comment entities correctly", () => {
    // Arrange
    const payloadReply = new Reply({
      id: "reply-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
    });
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: [payloadReply],
    };

    // Action & Assert
    const comment = new Comment(payload);
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.date);
    expect(comment.username).toEqual(payload.username);
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should create Comment entities correctly but reply is deleted", () => {
    // Arrange
    const payloadReply = new Reply({
      id: "reply-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
    });
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      is_delete: true,
      replies: [payloadReply],
    };

    // Action & Assert
    const comment = new Comment(payload);
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual("**komentar telah dihapus**");
    expect(comment.date).toEqual(payload.date);
    expect(comment.username).toEqual(payload.username);
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should create Comment entities with their replies correctly using createWithReplies", () => {
    const commentsRaw = [
      {
        id: "comment-1",
        content: "comment content",
        date: "2021-01-01",
        username: "user1",
        is_delete: false,
      },
    ];

    const repliesRaw = [
      {
        id: "reply-1",
        content: "reply content",
        date: "2021-01-02",
        username: "user2",
        is_delete: false,
        comment_id: "comment-1",
      },
    ];

    const result = Comment.createWithReplies(commentsRaw, repliesRaw);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Comment);
    expect(result[0].replies).toHaveLength(1);
    expect(result[0].replies[0]).toBeInstanceOf(Reply);

    // Assert all properties of the comment
    expect(result[0].id).toBe(commentsRaw[0].id);
    expect(result[0].content).toBe(commentsRaw[0].content);
    expect(result[0].date).toBe(commentsRaw[0].date);
    expect(result[0].username).toBe(commentsRaw[0].username);

    // Assert all properties of the reply
    expect(result[0].replies[0].id).toBe(repliesRaw[0].id);
    expect(result[0].replies[0].content).toBe(repliesRaw[0].content);
    expect(result[0].replies[0].date).toBe(repliesRaw[0].date);
    expect(result[0].replies[0].username).toBe(repliesRaw[0].username);
  });


});
