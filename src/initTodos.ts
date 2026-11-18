import type { Todo } from "./types";
import { v4 as uuid } from "uuid"; // v4 を uuid という名前でインポート

export const initTodos: Todo[] = [
  {
    id: uuid(), // UUID v4 を生成してIDにセット
    name: "プログラミング3の課題1",
    description: "GitHubへPush",
    isDone: false,
    priority: 1,
    deadline: new Date(2026, 11, 2, 17, 30),
    category: "school",
  },
  {
    id: uuid(),
    name: "買い物",
    description: "イオンでグミを買う",
    isDone: false,
    priority: 3,
    deadline: new Date(2026, 11, 20, 10, 30), 
    category: "private",
  },
  {
    id: uuid(),
    name: "体育レポート提出",
    isDone: true,
    priority: 2,
    deadline: null, // このTodoには期限を設定しない
    category: "school",
  },
];