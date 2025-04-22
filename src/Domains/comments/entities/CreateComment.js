class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { content } = payload;

    if (!content) {
      throw new Error("CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error("CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateComment;
