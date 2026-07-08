import cloudinary from "../config/cloudinary.js";
import Workspace from "./workspace.model.js";

const MEMBER_POPULATE = [
  { path: "owner", select: "name email avatar" },
  { path: "members.user", select: "name email avatar" },
];

class WorkspaceService {
  async createWorkspace(userId, data) {
    const workspace = await Workspace.create({
      ...data,
      owner: userId,
      members: [{ user: userId, role: "owner" }],
    });

    return workspace.populate(MEMBER_POPULATE);
  }

  async getMyWorkspaces(userId) {
    return Workspace.find({ "members.user": userId })
      .sort({ createdAt: -1 })
      .populate(MEMBER_POPULATE);
  }

  async getWorkspaceById(workspace) {
    return workspace.populate(MEMBER_POPULATE);
  }

  async updateWorkspace(workspace, data) {
    workspace.set(data);
    await workspace.save();

    return workspace.populate(MEMBER_POPULATE);
  }

  async deleteWorkspace(workspace) {
    await workspace.deleteOne();
  }

  async uploadLogo(workspace, filePath) {
    if (workspace.logo?.publicId) {
      await cloudinary.uploader.destroy(workspace.logo.publicId);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "trello-clone/workspaces",
    });

    workspace.logo = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await workspace.save();

    return workspace.logo;
  }
}

export default new WorkspaceService();
