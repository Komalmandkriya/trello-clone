import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { boardApi } from "../../api/board.api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  Board,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../../types/board.types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface BoardState {
  items: Board[];
  listStatus: RequestStatus;
  selected: Board | null;
  selectedStatus: RequestStatus;
  error: string | null;
}

const initialState: BoardState = {
  items: [],
  listStatus: "idle",
  selected: null,
  selectedStatus: "idle",
  error: null,
};

export const fetchBoardsByWorkspace = createAsyncThunk(
  "board/fetchByWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      return await boardApi.getByWorkspace(workspaceId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load boards"));
    }
  },
);

export const createBoard = createAsyncThunk(
  "board/create",
  async (payload: CreateBoardPayload, { rejectWithValue }) => {
    try {
      return await boardApi.create(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create board"));
    }
  },
);

export const fetchBoardById = createAsyncThunk(
  "board/fetchById",
  async (boardId: string, { rejectWithValue }) => {
    try {
      return await boardApi.getById(boardId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load board"));
    }
  },
);

export const updateBoard = createAsyncThunk(
  "board/update",
  async (
    { boardId, payload }: { boardId: string; payload: UpdateBoardPayload },
    { rejectWithValue },
  ) => {
    try {
      return await boardApi.update(boardId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update board"));
    }
  },
);

export const archiveBoard = createAsyncThunk(
  "board/archive",
  async (boardId: string, { rejectWithValue }) => {
    try {
      return await boardApi.archive(boardId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to archive board"));
    }
  },
);

export const deleteBoard = createAsyncThunk(
  "board/delete",
  async (boardId: string, { rejectWithValue }) => {
    try {
      await boardApi.remove(boardId);
      return boardId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete board"));
    }
  },
);

export const uploadBoardBackground = createAsyncThunk(
  "board/uploadBackground",
  async (
    { boardId, file }: { boardId: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const background = await boardApi.uploadBackground(boardId, file);
      return { boardId, background };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to upload background"),
      );
    }
  },
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    clearSelectedBoard(state) {
      state.selected = null;
      state.selectedStatus = "idle";
    },
    clearBoardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardsByWorkspace.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchBoardsByWorkspace.fulfilled,
        (state, action: PayloadAction<Board[]>) => {
          state.listStatus = "succeeded";
          state.items = action.payload;
        },
      )
      .addCase(fetchBoardsByWorkspace.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.items.unshift(action.payload);
      })
      .addCase(fetchBoardById.pending, (state) => {
        state.selectedStatus = "loading";
      })
      .addCase(
        fetchBoardById.fulfilled,
        (state, action: PayloadAction<Board>) => {
          state.selectedStatus = "succeeded";
          state.selected = action.payload;
        },
      )
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selected = null;
        state.error = action.payload as string;
      })
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.selected = action.payload;
        state.items = state.items.map((board) =>
          board._id === action.payload._id ? action.payload : board,
        );
      })
      .addCase(
        archiveBoard.fulfilled,
        (state, action: PayloadAction<Board>) => {
          state.selected = action.payload;
          state.items = state.items.map((board) =>
            board._id === action.payload._id ? action.payload : board,
          );
        },
      )
      .addCase(
        deleteBoard.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (board) => board._id !== action.payload,
          );
          if (state.selected?._id === action.payload) {
            state.selected = null;
          }
        },
      )
      .addCase(
        uploadBoardBackground.fulfilled,
        (
          state,
          action: PayloadAction<{
            boardId: string;
            background: { url: string; publicId: string };
          }>,
        ) => {
          const { boardId, background } = action.payload;

          if (state.selected?._id === boardId) {
            state.selected.background = background;
          }

          const board = state.items.find((item) => item._id === boardId);
          if (board) {
            board.background = background;
          }
        },
      );
  },
});

export const { clearSelectedBoard, clearBoardError } = boardSlice.actions;
export default boardSlice.reducer;
