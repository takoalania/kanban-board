import { TaskUpdate } from "../types/task";

const STORAGE_KEY = "pendingUpdates";

export function addPendingUpdate(update: TaskUpdate) {
  const current = getPendingUpdates();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, update]));
}

export function getPendingUpdates(): TaskUpdate[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearPendingUpdates() {
  localStorage.removeItem(STORAGE_KEY);
}
