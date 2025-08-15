import { mockApi } from "./mockApi";
import { Task } from "../types/task";

// Wrapper around mockApi.getTasks
export const fetchTasks = (): Promise<Task[]> => {
  return mockApi.getTasks();
};

// Wrapper around mockApi.updateTask
export const saveTask = (
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  return mockApi.updateTask(taskId, updates);
};
