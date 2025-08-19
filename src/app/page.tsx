"use client";

import { useState } from "react";

type Task = {
  id: string;
  text: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const addTask = () => {
    const value = input.trim();
    if (!value) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), text: value }, ...prev]);
    setInput("");
  };

  const removeTask = (id: string) => {
    if (removing.has(id)) return;
    const next = new Set(removing);
    next.add(id);
    setRemoving(next);
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRemoving((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, 180);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl flex flex-col items-stretch gap-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task…"
          className="w-full bg-transparent border-b border-neutral-400/70 hover:border-neutral-500 focus:border-neutral-800 dark:border-neutral-700/70 dark:hover:border-neutral-600 dark:focus:border-neutral-300 outline-none caret-neutral-800 dark:caret-neutral-200 text-lg py-2 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors duration-150"
          autoFocus
        />
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => {
            const isRemoving = removing.has(task.id);
            return (
              <li
                key={task.id}
                className={
                  "flex items-center gap-3 select-none " +
                  (isRemoving ? "animate-[out_.18s_ease-in_forwards]" : "animate-[in_.18s_ease-out]")
                }
              >
                <input
                  id={task.id}
                  type="checkbox"
                  onChange={() => removeTask(task.id)}
                  className="size-5 rounded-sm border border-neutral-400/70 dark:border-neutral-600/70 bg-white dark:bg-neutral-800 accent-neutral-900 dark:accent-neutral-200 cursor-pointer transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-600"
                  aria-label={task.text}
                />
                <label htmlFor={task.id} className="cursor-pointer">
                  {task.text}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
