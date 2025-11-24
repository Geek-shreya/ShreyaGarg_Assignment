import { useState, useEffect} from "react";
import type { FormEvent } from "react";
import type { Task, TaskStatus } from "../store/tasksSlice";

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => void;
  onCancel: () => void;
}

const TaskForm = ({ initial, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState<TaskStatus>(
    (initial?.status as TaskStatus) || "todo"
  );
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setStatus((initial?.status as TaskStatus) || "todo");
  }, [initial]);

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
