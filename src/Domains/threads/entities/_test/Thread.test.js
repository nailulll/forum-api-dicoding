const Thread = require("../Thread");
const Comment = require("../../../comments/entities/Comment");

describe("Thread entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Action & Assert
    expect(() => new Thread({})).toThrowError(
      "THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      title: "title",
      body: "body",
      date: "date",
      username: "username",
      comments: "comments",
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload comments not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "123",
      title: "title",
      body: "body",
      date: "date",
      username: "username",
      comments: ["comments"],
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.COMMENTS_NOT_ARRAY_OF_COMMENT"
    );
  });

  it("should create Thread entities correctly", () => {
    const comment = new Comment({
      id: "comment-123",
      content: "content",
      date: "date",
      username: "username",
    });

    // Arrange
    const payload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: "date",
      username: "username",
      comments: [comment],
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toHaveLength(1);
    expect(thread.comments[0]).toBeInstanceOf(Comment);
    expect(thread.comments[0].id).toEqual(comment.id);
    expect(thread.comments[0].content).toEqual(comment.content);
    expect(thread.comments[0].date).toEqual(comment.date);
    expect(thread.comments[0].username).toEqual(comment.username);
  });
});
