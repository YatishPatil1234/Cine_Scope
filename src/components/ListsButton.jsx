"use client";

import { DEFAULT_LISTS, getItemLists, toggleListItem } from "@/lib/lists";
import { Check, ChevronDown, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ListsButton({ movie, mediaType = "movie" }) {
  const [open,    setOpen]   = useState(false);
  const [inLists, setInLists]= useState([]);
  const [toast,   setToast]  = useState(null);
  const panelRef = useRef(null);
  const timerRef = useRef(null);

  const id    = movie?.id;
  const title = movie?.title ?? movie?.name ?? "";

  const refresh = () => setInLists(getItemLists(id, mediaType));
  useEffect(() => { refresh(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (!panelRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleToggle = (listId) => {
    const listMeta = DEFAULT_LISTS.find((d) => d.id === listId);
    const item = {
      id, mediaType, title,
      poster_path:  movie?.poster_path  ?? null,
      vote_average: movie?.vote_average ?? 0,
      release_date: movie?.release_date ?? movie?.first_air_date ?? "",
    };
    const { added } = toggleListItem(listId, item);
    refresh();
    clearTimeout(timerRef.current);
    setToast({ added, listName: listMeta?.name ?? listId });
    timerRef.current = setTimeout(() => setToast(null), 2200);
  };

  const savedCount = inLists.length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
          savedCount > 0
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50"
            : "bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-200"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <List size={15} />
        {savedCount > 0 ? `Saved (${savedCount})` : "Add to list"}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-white/[0.1] shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-up"
          style={{ background: "#141414" }}
          role="listbox"
          aria-label="My Lists"
        >
          <div className="px-3 pt-3 pb-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">My Lists</p>
          </div>
          {DEFAULT_LISTS.map((list) => {
            const isIn = inLists.includes(list.id);
            return (
              <button
                key={list.id}
                type="button"
                role="option"
                aria-selected={isIn}
                onClick={() => handleToggle(list.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-base leading-none w-5 text-center">{list.icon}</span>
                <span className={`flex-1 text-left font-medium ${isIn ? "text-white" : "text-zinc-400"}`}>
                  {list.name}
                </span>
                {isIn && <Check size={14} style={{ color: list.color }} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xl animate-fade-up"
          style={{ background: toast.added ? "#4f46e5" : "#27272a", minWidth: "200px", textAlign: "center" }}
        >
          {toast.added ? `✓ Added to ${toast.listName}` : `Removed from ${toast.listName}`}
        </div>
      )}
    </div>
  );
}
