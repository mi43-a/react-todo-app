export type TodoCategory = "school" | "private";

export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null; // 注意
  description?: string; //Todoの詳細
  category?: TodoCategory; //学校かプライベート
};