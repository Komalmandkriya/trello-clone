import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { workspaceApi } from "../../api/workspace.api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
} from "../../types/workspace.types";
import type { Avatar } from "../../types/auth.types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface WorkspaceState {
  items: Workspace[];
  listStatus: RequestStatus;
  selected: Workspace | null;
  selectedStatus: RequestStatus;
  error: string | null;
}

const initialState: WorkspaceState = {
  items: [],
  listStatus: "idle",
  selected: null,
  selectedStatus: "idle",
  error: null,
};

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchAll",
  async (_: void, { rejectWithValue }) => {
    try {
      return await workspaceApi.getMine();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load workspaces"));
    }
  },
);

export const createWorkspace = createAsyncThunk(
  "workspace/create",
  async (payload: CreateWorkspacePayload, { rejectWithValue }) => {
    try {
      return await workspaceApi.create(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create workspace"));
    }
  },
);

export const fetchWorkspaceById = createAsyncThunk(
  "workspace/fetchById",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      return await workspaceApi.getById(workspaceId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load workspace"));
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspace/update",
  async (
    { workspaceId, payload }: { workspaceId: string; payload: UpdateWorkspacePayload },
    { rejectWithValue },
  ) => {
    try {
      return await workspaceApi.update(workspaceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update workspace"));
    }
  },
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/delete",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      await workspaceApi.remove(workspaceId);
      return workspaceId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete workspace"));
    }
  },
);

export const uploadWorkspaceLogo = createAsyncThunk(
  "workspace/uploadLogo",
  async (
    { workspaceId, file }: { workspaceId: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const logo = await workspaceApi.uploadLogo(workspaceId, file);
      return { workspaceId, logo };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to upload logo"));
    }
  },
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    clearSelectedWorkspace(state) {
      state.selected = null;
      state.selectedStatus = "idle";
    },
    clearWorkspaceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action: PayloadAction<Workspace[]>) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(createWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.items.unshift(action.payload);
      })
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.selectedStatus = "loading";
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selected = null;
        state.error = action.payload as string;
      })
      .addCase(updateWorkspace.fulfilled, (state, action: PayloadAction<Workspace>) => {
        state.selected = action.payload;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteWorkspace.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selected?._id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(
        uploadWorkspaceLogo.fulfilled,
        (state, action: PayloadAction<{ workspaceId: string; logo: Avatar }>) => {
          const { workspaceId, logo } = action.payload;

          if (state.selected?._id === workspaceId) {
            state.selected.logo = logo;
          }

          const item = state.items.find((workspace) => workspace._id === workspaceId);
          if (item) {
            item.logo = logo;
          }
        },
      );
  },
});

export const { clearSelectedWorkspace, clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
