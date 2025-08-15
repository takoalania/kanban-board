import { useState, useEffect } from "react";
import { Layout } from "antd";
import { Header } from "./components/Header/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { mockWebSocket, WebSocketEventType } from "./services/mockWebSocket";
import { Task } from "./types/task";
import styles from "./App.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setTasks, setLoading, setError, syncTaskFromWebSocket } from "./store/taskSlice";
import { fetchTasks } from "./services/taskService";
import Board from "./components/Board/Board";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { getPendingUpdates, clearPendingUpdates } from "./utils/offlineQueue";
import { saveTask } from "./services/taskService";

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const isOnline = useNetworkStatus();

  const isLoading = useSelector((state: RootState) => state.tasks.isLoading);

  useEffect(() => {
    mockWebSocket.connect();

    const unsubscribe = mockWebSocket.subscribe((message) => {
      if (message.type === WebSocketEventType.TASK_UPDATE) {
        const updatedTask = message.payload as Task;

        dispatch(syncTaskFromWebSocket(updatedTask));
      }
    });

    return () => {
      unsubscribe();
      mockWebSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        dispatch(setLoading(true));
        const tasks = await fetchTasks();
        dispatch(setTasks(tasks));
        dispatch(setError(null));
      } catch (error) {
        dispatch(setError((error as Error).message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadTasks();
  }, [dispatch]);

  useEffect(() => {
    const syncPending = async () => {
      if (isOnline) {
        const pending = getPendingUpdates();
        for (const update of pending) {
          await saveTask(update.id, update);
        }
        clearPendingUpdates();
      }
    };

    syncPending();
  }, [isOnline]);

  return (
    <Layout className={styles.root}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header isOnline={isOnline} />
        <Content className={styles.main}>
          {!isLoading && <Board />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
