"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  text: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tasks");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((t) => t && typeof t.id === "string" && typeof t.text === "string");
        setTasks(valid);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

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
      if (editingId === id) {
        setEditingId(null);
        setEditText("");
      }
    }, 180);
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const value = editText.trim();
    if (!value) {
      setEditingId(null);
      setEditText("");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, text: value } : t)));
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
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
            const isEditing = editingId === task.id;
            return (
              <li
                key={task.id}
                className={
                  "flex items-center gap-3 select-none " +
                  (isRemoving ? "animate-[out_.18s_ease-in_forwards]" : "animate-[in_.18s_ease-out]")
                }
              >
                <input
                  type="checkbox"
                  onChange={() => removeTask(task.id)}
                  className="size-5 shrink-0 rounded-full border-2 border-neutral-400/70 dark:border-neutral-600/70 bg-transparent appearance-none cursor-pointer transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-500 checked:bg-transparent checked:border-neutral-900 dark:checked:border-neutral-200"
                  aria-label={task.text}
                />
                {isEditing ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="flex-1 min-w-0 bg-transparent outline-none text-lg py-1"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(task.id, task.text)}
                    className="flex-1 min-w-0 text-left bg-transparent outline-none cursor-text truncate"
                  >
                    {task.text}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
