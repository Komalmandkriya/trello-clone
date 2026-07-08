import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      minlength: [2, "Workspace name must be at least 2 characters"],
      maxlength: [100, "Workspace name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    logo: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
      },
    ],

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
  },
  {
    timestamps: true,
  },
);

workspaceSchema.index({ "members.user": 1 });

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
