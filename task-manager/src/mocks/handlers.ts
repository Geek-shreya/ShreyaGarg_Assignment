import { http, HttpResponse } from "msw";
import { loadTasks, saveTasks} from "./mockData";
import type { Task } from "./mockData";

const API_URL = "/api";

const USER = {
  username: "test",
  password: "test123",
  token: "fake-jwt-token",
};

function isAuthenticated(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${USER.token}`;
}

export const handlers = [
  // POST /login
  http.post(`${API_URL}/login`, async ({ request }) => {
    const body = await request.json() as {
    username: string;
    password: string;
    };

    const { username, password } = body;

    if (username === USER.username && password === USER.password) {
      return HttpResponse.json(
        { token: USER.token, username: USER.username },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }),

  // GET /tasks
  http.get(`${API_URL}/tasks`, ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tasks = loadTasks();
    return HttpResponse.json(tasks, { status: 200 });
  }),

  // POST /tasks
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Omit<Task, "id" | "createdAt">;

    const tasks = loadTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    saveTasks([...tasks, newTask]);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PUT /tasks/:id
  http.put(`${API_URL}/tasks/:id`, async ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id as string;
    const update = (await request.json()) as Partial<Task>;

    const tasks = loadTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...update } : t));

    saveTasks(updated);

    const updatedTask = updated.find((t) => t.id === id);
    return HttpResponse.json(updatedTask, { status: 200 });
  }),

  // DELETE /tasks/:id
  http.delete(`${API_URL}/tasks/:id`, ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id as string;

    const tasks = loadTasks();
    const updated = tasks.filter((t) => t.id !== id);

    saveTasks(updated);

    return new HttpResponse(null, { status: 204 });
  }),
];
