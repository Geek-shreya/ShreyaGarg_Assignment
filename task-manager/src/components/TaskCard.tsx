import type { Task } from "../store/tasksSlice";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColor: Record<Task["status"], string> = {
  "todo": "bg-gray-200 text-gray-800",
  "in-progress": "bg-yellow-200 text-yellow-800",
  "done": "bg-green-200 text-green-800",
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {task.title}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[task.status]}`}
          >
            {task.status.replace("-", " ")}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {task.description}
        </p>
      </div>
      <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
        <span>{new Date(task.createdAt).toLocaleString()}</span>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-2 py-1 rounded border border-indigo-500 text-indigo-600 text-xs"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 rounded border border-red-500 text-red-600 text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
