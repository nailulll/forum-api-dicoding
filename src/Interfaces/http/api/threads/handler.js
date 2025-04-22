const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, userId);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const detailThreadUseCase = this._container.getInstance(
      DetailThreadUseCase.name
    );
    const detailThread = await detailThreadUseCase.execute(
      request.params.threadId
    );
    return {
      status: "success",
      data: {
        thread: detailThread,
      },
    };
  }
}

module.exports = ThreadHandler;
