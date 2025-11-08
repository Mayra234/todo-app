import Image from "next/image";
import styles from "./page.module.css";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className={styles.page}>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}>
        <TodoList />
      </main>
    </div>
  );
}
