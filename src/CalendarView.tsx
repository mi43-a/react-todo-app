import { useState } from "react";
import dayjs from "dayjs";
import type { Todo } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  todos: Todo[];
};

const CalendarView = ({ todos }: Props) => {
  // 表示対象の年月を管理するState
  const [currentDate, setCurrentDate] = useState(dayjs());

  // 前月・次月への移動処理
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  // カレンダーの日付計算
  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startDayOfWeek = startOfMonth.day(); // 0(日) ～ 6(土)

  // 当月のマス目配列（先頭の空白マス + 日付マス）
  const daysArray = [
    ...Array(startDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => startOfMonth.add(i, "day")),
  ];

  // 特定の日付に対応するTodoを抽出
  const getTodosForDate = (date: dayjs.Dayjs) => {
    return todos.filter((todo) => {
      if (!todo.deadline) return false;
      return dayjs(todo.deadline).isSame(date, "day");
    });
  };

  return (
    <div className="rounded-md border border-slate-300 bg-white p-4 drop-shadow">
      {/* カレンダーヘッダー（年月 ＆ 移動ボタン） */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-700">
          {currentDate.format("YYYY年 MM月")}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="cursor-pointer rounded border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
            前月
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="cursor-pointer rounded border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100"
          >
            次月
            <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>

      {/* 曜日ラベル */}
      <div className="mb-1 grid grid-cols-7 text-center font-bold text-slate-600">
        <div className="text-rose-500">日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div className="text-sky-500">土</div>
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[80px] bg-slate-50/50"
              />
            );
          }

          const dayTodos = getTodosForDate(date);
          const isToday = date.isSame(dayjs(), "day");

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              className={`min-h-[80px] rounded border border-slate-200 p-1 ${
                isToday ? "bg-amber-50 border-amber-300" : "bg-white"
              }`}
            >
              <div
                className={`text-xs font-semibold ${
                  isToday ? "text-amber-700" : "text-slate-500"
                }`}
              >
                {date.date()}
              </div>
              <div className="mt-1 space-y-1">
                {dayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`truncate rounded px-1 py-0.5 text-xs font-medium ${
                      todo.isDone
                        ? "bg-slate-200 text-slate-500 line-through opacity-70"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                    title={todo.name}
                  >
                    {todo.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;