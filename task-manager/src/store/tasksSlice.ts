import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

function authHeader(getState: () => RootState) {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  "tasks/fetchTasks",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get("/api/tasks", authHeader(getState));
      return res.data as Task[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tasks");
    }
  }
);

export const createTask = createAsyncThunk<
  Task,
  { title: string; description: string; status: TaskStatus },
  { state: RootState }
>("tasks/createTask", async (payload, { rejectWithValue, getState }) => {
  try {
    const res = await axios.post("/api/tasks", payload, authHeader(getState));
    return res.data as Task;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create task");
  }
});

export const updateTask = createAsyncThunk<
  Task,
  { id: string; data: Partial<Task> },
  { state: RootState }
>("tasks/updateTask", async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    const res = await axios.put(`/api/tasks/${id}`, data, authHeader(getState));
    return res.data as Task;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update task");
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("tasks/deleteTask", async (id, { rejectWithValue, getState }) => {
  try {
    await axios.delete(`/api/tasks/${id}`, authHeader(getState));
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete task");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items = state.items.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
