import cloudinary from "../config/cloudinary.js";
import Board from "./board.model.js";

const BOARD_POPULATE = [
  {
    path: "owner",
    select: "name email avatar",
  },
  {
    path: "workspace",
    select: "name description logo visibility",
  },
];

class BoardService {
  async createBoard(userId, workspace, data) {
    const board = await Board.create({
      ...data,
      owner: userId,
      workspace: workspace._id,
    });

    return board.populate(BOARD_POPULATE);
  }

  getWorkspaceBoards(workspace) {
    return Board.find({
      workspace: workspace._id,
      isArchived: false,
    })
      .populate(BOARD_POPULATE)
      .sort({ createdAt: -1 });
  }

  async archiveBoard(board) {
    board.isArchived = !board.isArchived;
    await board.save();

    return board.populate(BOARD_POPULATE);
  }
  async getBoardById(board) {
    return board.populate(BOARD_POPULATE);
  }
  async updateBoard(board, data) {
    board.set(data);
    await board.save();
    return board.populate(BOARD_POPULATE);
  }
  async updateBoardArchiveStatus(board, isArchived) {
    board.isArchived = isArchived;
    await board.save();

    return board.populate(BOARD_POPULATE);
  }
  async deleteBoard(board) {
    await board.deleteOne();
  }
  async uploadBackground(board, filePath) {
    if (board.background?.publicId) {
      await cloudinary.uploader.destroy(board.background.publicId);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "trello-clone/boards",
    });

    board.background = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await board.save();

    return board.background;
  }
}

export default new BoardService();
