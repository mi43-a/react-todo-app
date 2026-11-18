import type { Todo } from "./types";
import { v4 as uuid } from "uuid"; // v4 を uuid という名前でインポート

export const initTodos: Todo[] = [
  {
    id: uuid(), // UUID v4 を生成してIDにセット
    name: "プログラミング3の課題1",
    isDone: false,
    priority: 1,
    deadline: new Date(2026, 10, 2, 17, 30),
    category: "school",
  },
  {
    id: uuid(),
    name: "買い物",
    isDone: true,
    priority: 3,
    deadline: null, // このTodoには期限を設定しない
    category: "private",
  },
];