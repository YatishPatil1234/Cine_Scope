"use client";

import { getRating, removeRating, setRating } from "@/lib/ratings";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function RatingWidget({ id, mediaType = "movie" }) {
  const [saved,   setSaved]   = useState(null);
  const [editing, setEditing] = useState(false);
  const [hover,   setHover]   = useState(0);
  const [pending, setPending] = useState(0);
  const [note,    setNote]    = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const r = getRating(id, mediaType);
    setSaved(r);
    if (r) { setPending(r.rating); setNote(r.note ?? ""); }
  }, [id, mediaType]);

  useEffect(() => {
    if (editing && textareaRef.current) textareaRef.current.focus();
  }, [editing]);

  const save = () => {
    if (!pending) return;
    setRating(id, mediaType, pending, note);
    setSaved({ rating: pending, note });
    setEditing(false);
  };

  const remove = () => {
    removeRating(id, mediaType);
    setSaved(null); setPending(0); setNote(""); setEditing(false);
  };

  const stars = [1, 2, 3, 4, 5];
  const display = hover || pending;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Rating</p>
        <div className="flex items-center gap-2">
          {saved && !editing && (
            <>
              <button type="button" onClick={() => setEditing(true)} className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Edit"><Pencil size={13} /></button>
              <button type="button" onClick={remove} className="text-zinc-500 hover:text-red-400 transition-colors" aria-label="Remove"><Trash2 size={13} /></button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => { setPending(star); if (!editing && !saved) setEditing(true); }}
            onMouseEnter={() => setHover(star)}
            className="text-2xl transition-transform duration-100 hover:scale-125 focus:outline-none"
          >
            <span className={display >= star ? "text-yellow-400" : "text-zinc-700"}>★</span>
          </button>
        ))}
        {display > 0 && <span className="text-sm font-bold text-zinc-400 ml-1">{display}/5</span>}
      </div>

      {saved && !editing && (
        <div className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-1 mb-1">
            {stars.map((s) => (
              <span key={s} className={`text-sm ${saved.rating >= s ? "text-yellow-400" : "text-zinc-700"}`}>★</span>
            ))}
            <span className="text-xs font-semibold text-zinc-400 ml-1">{saved.rating}/5</span>
          </div>
          {saved.note && <p className="text-sm text-zinc-400 italic leading-relaxed">&ldquo;{saved.note}&rdquo;</p>}
        </div>
      )}

      {editing && (
        <div className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.06] space-y-3 animate-fade-up">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note (optional)…"
            rows={2}
            maxLength={280}
            className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-600">{note.length}/280</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setEditing(false); if (saved) { setPending(saved.rating); setNote(saved.note ?? ""); } }} className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
              <button type="button" onClick={save} disabled={!pending} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white transition-all">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
