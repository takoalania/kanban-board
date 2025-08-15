import { useState } from "react";
import { Task } from "../../types/task";
import { Draggable } from "react-beautiful-dnd";
import { OptimizedImage } from "../OptimizedImage/OptimizedImage";
import styles from "./TaskCard.module.scss";
import { useDispatch } from "react-redux";
import { updateTask } from "../../store/taskSlice";
import { saveTask } from "../../services/taskService";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { addPendingUpdate } from "../../utils/offlineQueue";

interface TaskCardProps {
  task: Task;
  index: number;
}

function TaskCard({ task, index }: TaskCardProps) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const isOnline = useNetworkStatus();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updated = { ...task, title, description };
    dispatch(updateTask(updated));

    if (isOnline) {
      await saveTask(task.id, updated);
    } else {
      addPendingUpdate({ id: task.id, title, description });
    }

    setIsEditing(false);
  };

  const handleBlur = async (e: React.FocusEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related && e.currentTarget.contains(related)) return;
    await handleSave();
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={styles.card}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          tabIndex={0}
        >
          {isEditing ? (
            <div className={styles.editContainer}>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className={styles.saveButton} onClick={handleSave}>
                Save
              </button>
            </div>
          ) : (
            <div className={styles.content}>
              <h3 className={styles.title}>{task.title}</h3>
              <p className={styles.description}>{task.description}</p>
            </div>
          )}

          {task.image && (
            <div className={styles.image}>
              <OptimizedImage
                key={task.image.url}
                src={task.image.url}
                alt={task.image.alt || "Task image"}
                size="medium"
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
