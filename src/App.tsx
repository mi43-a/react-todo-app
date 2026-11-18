import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Todo, TodoCategory } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import CalendarView from "./CalendarView";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const localStorageKey = "TodoApp";

type StoredTodo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: string | null;
  description?: string;
  category?: TodoCategory;
};

const loadTodos = (): Todo[] => {
  const todoJsonStr = localStorage.getItem(localStorageKey);
  if (todoJsonStr === null) {
    return initTodos.map((t) => ({ ...t, category: t.category || "school" }));
  }
  const storedTodos: StoredTodo[] = JSON.parse(todoJsonStr);
  return storedTodos.map((todo) => ({
    ...todo,
    deadline: todo.deadline === null ? null : new Date(todo.deadline),
    category: todo.category || "school",
  }));
};

const getTodoNameError = (name: string): string => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 32) {
    return "前後の空白を除いて、2文字以上、32文字以内で入力してください";
  }
  return "";
};

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory>("school");
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [isNameTouched, setIsNameTouched] = useState(false);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;
  const completedCount = todos.length - uncompletedCount;

  const newTodoNameError = getTodoNameError(newTodoName);
  const isNewTodoNameInvalid = newTodoNameError !== "";
  const showNewTodoNameError = isNameTouched && isNewTodoNameInvalid;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(todos));
  }, [todos]);

  const updateNewTodoName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoName(e.target.value);
    setIsNameTouched(true);
  };

  const updateNewTodoDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoDescription(e.target.value);
  };

  const updateNewTodoPriority = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateNewTodoCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoCategory(e.target.value as TodoCategory);
  };

  const updateDeadline = (e: ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    if (isNewTodoNameInvalid) {
      setIsNameTouched(true);
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName.trim(),
      description: newTodoDescription.trim(),
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
      category: newTodoCategory,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDescription("");
    setNewTodoCategory("school");
    setNewTodoDeadline(null);
    setIsNameTouched(false);
  };

  const updateIsDone = (id: string, value: boolean) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isDone: value };
        } else {
          return todo;
        }
      }),
    );
  };

  const removeCompletedTodos = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.isDone));
  };

  const remove = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mx-4 my-10 max-w-5xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-6">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 左側カラム: Todoリスト & 追加フォーム */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-700">Todoリスト</h2>
          <TodoList
            todos={todos}
            updateIsDone={updateIsDone}
            remove={remove}
          />
          <button
            type="button"
            onClick={removeCompletedTodos}
            disabled={completedCount === 0}
            className={twMerge(
              "mt-2 cursor-pointer rounded-md px-3 py-1 font-medium",
              "bg-rose-500 text-white hover:bg-rose-600",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-500",
            )}
          >
            完了済みのタスクを削除
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewTodo();
            }}
            aria-labelledby="newTodoHeading"
            className="mt-6 space-y-3 rounded-md border border-slate-300 bg-white p-4 drop-shadow"
          >
            <h3 id="newTodoHeading" className="text-lg font-bold">
              新しいタスクの追加
            </h3>

            <div>
              <div className="flex items-center space-x-2">
                <label className="font-bold" htmlFor="newTodoName">
                  名前
                </label>
                <input
                  id="newTodoName"
                  name="todoName"
                  type="text"
                  required
                  value={newTodoName}
                  onChange={updateNewTodoName}
                  aria-invalid={showNewTodoNameError}
                  aria-describedby={
                    showNewTodoNameError ? "newTodoNameError" : undefined
                  }
                  className={twMerge(
                    "min-w-0 grow rounded-md border border-gray-300 p-2",
                    showNewTodoNameError && "border-red-500 outline-red-500",
                  )}
                  placeholder="2文字以上、32文字以内で入力してください"
                />
              </div>
              {showNewTodoNameError && (
                <div
                  id="newTodoNameError"
                  aria-live="polite"
                  className="ml-10 flex items-center space-x-1 text-sm font-medium text-red-500"
                >
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="mr-0.5"
                  />
                  <div>{newTodoNameError}</div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <label className="font-bold w-16 shrink-0" htmlFor="newTodoDescription">
                詳細
              </label>
              <input
                id="newTodoDescription"
                name="todoDescription"
                type="text"
                value={newTodoDescription}
                onChange={updateNewTodoDescription}
                placeholder="Todoの詳細（任意）"
                className="min-w-0 grow rounded-md border border-gray-300 p-2 text-sm"
              />
            </div>

            <fieldset>
              <legend className="mb-1 font-bold">優先度</legend>
              <div className="flex gap-5">
                  <label  className="flex items-center space-x-1 cursor-pointer">
                    <input
                      id="priority-1" 
                      name="priorityGroup"
                      type="radio"
                      value={1}
                      checked={newTodoPriority === 1}
                      onChange={updateNewTodoPriority}
                    />
                    <span className="font-bold text-orange-400">★★★</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      id="priority-2"
                      name="priorityGroup"
                      type="radio"
                      value={2}
                      checked={newTodoPriority === 2}
                      onChange={updateNewTodoPriority}
                    />
                    <span className="font-bold text-orange-400">★★</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      id="priority-3"
                      name="priorityGroup"
                      type="radio"
                      value={3}
                      checked={newTodoPriority === 3}
                      onChange={updateNewTodoPriority}
                    />

                    <span className="font-bold text-orange-400">★</span>
                  </label> 
              </div>
            </fieldset>

            <fieldset className="flex items-center space-x-2">
              <legend className="font-bold w-16 shrink-0">分類</legend>
              <div className="flex gap-5">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="categoryGroup"
                    value="school"
                    checked={newTodoCategory === "school"}
                    onChange={updateNewTodoCategory}
                  />
                  <span className="font-medium text-blue-600">🏫 学校</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="categoryGroup"
                    value="private"
                    checked={newTodoCategory === "private"}
                    onChange={updateNewTodoCategory}
                  />
                  <span className="font-medium text-pink-600">🌸 プライベート</span>
                </label>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-2">
              <label className="font-bold" htmlFor="deadline">
                期限
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={
                  newTodoDeadline
                    ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                    : ""
                }
                onChange={updateDeadline}
                className="max-w-full min-w-0 rounded-md border border-gray-300 px-2 py-0.5"
              />
            </div>

            <button
              type="submit"
              disabled={isNewTodoNameInvalid}
              className={twMerge(
                "cursor-pointer rounded-md px-3 py-1",
                "bg-indigo-500 font-bold text-white hover:bg-indigo-600",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-500",
              )}
            >
              追加
            </button>
          </form>
        </div>

        {/* 右側カラム: カレンダー表示 */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-700">カレンダー</h2>
          <CalendarView todos={todos} />
        </div>
      </div>
    </div>
  );
};

export default App;