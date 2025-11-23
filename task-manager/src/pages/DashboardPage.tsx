import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../store/authSlice";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../store/tasksSlice";
import type { Task, TaskStatus } from "../store/tasksSlice";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { toggleDarkMode } from "../store/uiSlice";

type Filter = "all" | TaskStatus;

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username } = useAppSelector((s) => s.auth);
  const { items, loading, error } = useAppSelector((s) => s.tasks);
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = items.filter((t) => (filter === "all" ? true : t.status === filter));

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    if (editing) {
      await dispatch(updateTask({ id: editing.id, data }));
    } else {
      await dispatch(createTask(data));
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await dispatch(deleteTask(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleToggleDark = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Task Manager</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Welcome, {username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDark}
              className="px-3 py-1.5 rounded-lg border text-xs"
            >
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Tasks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage tasks with mocked API and persisted state.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
          >
            + New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {(["all", "todo", "in-progress", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full border ${
                filter === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              {f === "all" ? "All" : f.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm">Loading tasks...</p>}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-700 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <p>No tasks yet.</p>
            <p className="mt-1">Click “New Task” to create your first one.</p>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  setEditing(task);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-5">
              <h3 className="text-lg font-semibold mb-2">
                {editing ? "Edit Task" : "New Task"}
              </h3>
              <TaskForm
                initial={editing || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
