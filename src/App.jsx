import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
// ─── GENRES ───────────────────────────────────────────────────────────────────
const GENRES = {
  hiphop:     { label: "Hip-Hop",           color: "#f87171" },
  rap:        { label: "Rap",               color: "#fb923c" },
  alternative:{ label: "Alternative Rock",  color: "#a78bfa" },
  indie:      { label: "Indie Rock",        color: "#c084fc" },
  rock:       { label: "Classic Rock",      color: "#60a5fa" },
  pop:        { label: "Pop",               color: "#f9a8d4" },
  jazz:       { label: "Jazz / Soul",       color: "#fbbf24" },
  folk:       { label: "Folk / Singer-Songwriter", color: "#34d399" },
  electronic: { label: "Electronic",        color: "#38bdf8" },
  rnb:        { label: "R&B / Soul",        color: "#f472b6" },
  country:    { label: "Country / Americana", color: "#a3e635" },
  classical:  { label: "Classical",         color: "#94a3b8" },
};
const GENRE_KEYS = Object.keys(GENRES);


// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_LISTENED = [
  { id:"l1",  artist:"Kendrick Lamar", album:"Overly Dedicated",                  year:2010, genre:"hiphop",  rating:null },
  { id:"l2",  artist:"Kendrick Lamar", album:"Section.80",                        year:2011, genre:"hiphop",  rating:null },
  { id:"l3",  artist:"Kendrick Lamar", album:"good kid, m.A.A.d city",            year:2012, genre:"hiphop",  rating:null },
  { id:"l4",  artist:"Kendrick Lamar", album:"To Pimp a Butterfly",               year:2015, genre:"hiphop",  rating:null },
  { id:"l5",  artist:"Kendrick Lamar", album:"untitled unmastered.",              year:2016, genre:"hiphop",  rating:null },
  { id:"l6",  artist:"Kendrick Lamar", album:"DAMN.",                             year:2017, genre:"hiphop",  rating:null },
  { id:"l7",  artist:"Kendrick Lamar", album:"Mr. Morale & the Big Steppers",     year:2022, genre:"hiphop",  rating:null },
  { id:"l8",  artist:"Kendrick Lamar", album:"GNX",                               year:2024, genre:"hiphop",  rating:null },
  { id:"l9",  artist:"Kanye West",     album:"The College Dropout",               year:2004, genre:"hiphop",  rating:null },
  { id:"l10", artist:"Kanye West",     album:"Late Registration",                 year:2005, genre:"hiphop",  rating:null },
  { id:"l11", artist:"Kanye West",     album:"Graduation",                        year:2007, genre:"hiphop",  rating:null },
  { id:"l12", artist:"Kanye West",     album:"My Beautiful Dark Twisted Fantasy", year:2010, genre:"hiphop",  rating:null },
  { id:"l13", artist:"J. Cole",        album:"2014 Forest Hills Drive",           year:2014, genre:"hiphop",  rating:null },
  { id:"l14", artist:"J. Cole",        album:"For Your Eyez Only",                year:2016, genre:"hiphop",  rating:null },
  { id:"l15", artist:"J. Cole",        album:"KOD",                               year:2018, genre:"hiphop",  rating:null },
  { id:"l16", artist:"J. Cole",        album:"The Off-Season",                    year:2021, genre:"hiphop",  rating:null },
  { id:"l17", artist:"J. Cole",        album:"The Fall Off",                      year:2025, genre:"hiphop",  rating:null },
  { id:"l18", artist:"Freddie Gibbs & Madlib",        album:"Piñata",             year:2014, genre:"hiphop",  rating:null },
  { id:"l19", artist:"Freddie Gibbs & The Alchemist", album:"Alfredo",            year:2020, genre:"hiphop",  rating:null },
  { id:"l20", artist:"Freddie Gibbs & The Alchemist", album:"Alfredo 2",          year:2024, genre:"hiphop",  rating:null },
  { id:"l21", artist:"Baby Keem",      album:"Ca$ino",                            year:2026, genre:"hiphop",  rating:null },
  { id:"l22", artist:"Clipse",         album:"Let God Sort Em Out",               year:2025, genre:"hiphop",  rating:null },
  { id:"l23", artist:"Fleetwood Mac",  album:"Rumours",                           year:1977, genre:"rock",    rating:null },
  { id:"l24", artist:"Pink Floyd",     album:"The Dark Side of the Moon",         year:1973, genre:"rock",    rating:null },
  { id:"l25", artist:"Radiohead",      album:"In Rainbows",                       year:2007, genre:"alternative", rating:null },
  { id:"l26", artist:"Steely Dan",     album:"Aja",                               year:1977, genre:"jazz",    rating:null },
  { id:"l27", artist:"The Strokes",    album:"Is This It",                        year:2001, genre:"indie",   rating:null },
  { id:"l28", artist:"Jeff Buckley",   album:"Grace",                             year:1994, genre:"alternative", rating:null },
  { id:"l29", artist:"JID",            album:"The Never Story",                   year:2017, genre:"hiphop",  rating:null },
  { id:"l30", artist:"JID",            album:"DiCaprio 2",                        year:2018, genre:"hiphop",  rating:null },
  { id:"l31", artist:"JID",            album:"The Forever Story",                 year:2022, genre:"hiphop",  rating:null },
  { id:"l32", artist:"JID",            album:"Luv Is 4Ever",                      year:2024, genre:"hiphop",  rating:null },
  { id:"l33", artist:"Joey Bada$$",    album:"1999",                              year:2012, genre:"hiphop",  rating:null },
  { id:"l34", artist:"Common",         album:"Like Water for Chocolate",          year:2000, genre:"hiphop",  rating:null },
];

const SEED_WANT = [
  { id:"w1",  artist:"The Strokes",    album:"Room on Fire",                          year:2003, genre:"indie",    done:false, priority:1 },
  { id:"w2",  artist:"The Strokes",    album:"First Impressions of Earth",            year:2006, genre:"indie",    done:false, priority:2 },
  { id:"w3",  artist:"The Strokes",    album:"The New Abnormal",                      year:2020, genre:"indie",    done:false, priority:3 },
  { id:"w4",  artist:"Fleetwood Mac",  album:"Fleetwood Mac",                         year:1975, genre:"rock",     done:false, priority:1 },
  { id:"w5",  artist:"Fleetwood Mac",  album:"Tusk",                                  year:1979, genre:"rock",     done:false, priority:2 },
  { id:"w6",  artist:"Fleetwood Mac",  album:"Tango in the Night",                    year:1987, genre:"rock",     done:false, priority:3 },
  { id:"w7",  artist:"Fleetwood Mac",  album:"Mirage",                                year:1982, genre:"rock",     done:false, priority:4 },
  { id:"w8",  artist:"Pink Floyd",     album:"The Wall",                              year:1979, genre:"rock",     done:false, start:true },
  { id:"w9",  artist:"Pink Floyd",     album:"Wish You Were Here",                    year:1975, genre:"rock",     done:false },
  { id:"w10", artist:"Pink Floyd",     album:"Animals",                               year:1977, genre:"rock",     done:false },
  { id:"w11", artist:"The Smiths",     album:"The Queen Is Dead",                     year:1986, genre:"alternative", done:false },
  { id:"w12", artist:"Wu-Tang Clan",   album:"Enter the Wu-Tang (36 Chambers)",       year:1993, genre:"hiphop",   done:false },
  { id:"w13", artist:"The Cure",       album:"Disintegration",                        year:1989, genre:"alternative", done:false },
  { id:"w14", artist:"Billy Joel",     album:"The Stranger",                          year:1977, genre:"pop",      done:false },
  { id:"w15", artist:"Oasis",          album:"(What's the Story) Morning Glory?",     year:1995, genre:"rock",     done:false },
  { id:"w16", artist:"Bob Dylan",      album:"Highway 61 Revisited",                  year:1965, genre:"folk",     done:false },
  { id:"w17", artist:"Christopher Cross", album:"Christopher Cross",                  year:1980, genre:"pop",      done:false },
  { id:"w18", artist:"Common",         album:"Be",                                    year:2005, genre:"hiphop",   done:false },
  { id:"w19", artist:"Eagles",         album:"Hotel California",                      year:1976, genre:"rock",     done:false },
  { id:"w20", artist:"ASAP Rocky",     album:"Long.Live.ASAP",                        year:2013, genre:"hiphop",   done:false, note:"Start here (chronological)" },
  { id:"w21", artist:"ASAP Rocky",     album:"AT.LONG.LAST.ASAP",                     year:2015, genre:"hiphop",   done:false, start:true, note:"Fan favourite" },
  { id:"w22", artist:"ASAP Rocky",     album:"Testing",                               year:2018, genre:"hiphop",   done:false },
  { id:"w23", artist:"ASAP Rocky",     album:"Don't Be Dumb",                         year:2024, genre:"hiphop",   done:false },
  { id:"w24", artist:"Radiohead",      album:"OK Computer",                           year:1997, genre:"alternative", done:false },
  { id:"w25", artist:"Radiohead",      album:"Kid A",                                 year:2000, genre:"electronic", done:false },
  { id:"w26", artist:"Radiohead",      album:"The Bends",                             year:1995, genre:"alternative", done:false },
  { id:"w27", artist:"Steely Dan",     album:"Can't Buy a Thrill",                    year:1972, genre:"jazz",     done:false, start:true },
  { id:"w28", artist:"Steely Dan",     album:"Countdown to Ecstasy",                  year:1973, genre:"jazz",     done:false },
  { id:"w29", artist:"Steely Dan",     album:"Pretzel Logic",                         year:1974, genre:"jazz",     done:false },
  { id:"w30", artist:"Steely Dan",     album:"Gaucho",                                year:1980, genre:"jazz",     done:false },
  { id:"w31", artist:"Eagles",         album:"Desperado",                             year:1973, genre:"rock",     done:false },
  { id:"w32", artist:"Eagles",         album:"Eagles",                                year:1972, genre:"rock",     done:false },
  { id:"w33", artist:"Eagles",         album:"One of These Nights",                   year:1975, genre:"rock",     done:false },
  { id:"w34", artist:"Eagles",         album:"The Long Run",                          year:1979, genre:"rock",     done:false },
  { id:"w35", artist:"Tyler, the Creator", album:"IGOR",                              year:2019, genre:"hiphop",   done:false, start:true },
  { id:"w36", artist:"Tyler, the Creator", album:"Flower Boy",                        year:2017, genre:"hiphop",   done:false },
  { id:"w37", artist:"Tyler, the Creator", album:"Call Me If You Get Lost",           year:2021, genre:"hiphop",   done:false },
  { id:"w38", artist:"Tyler, the Creator", album:"Chromakopia",                       year:2024, genre:"hiphop",   done:false },
  { id:"w39", artist:"Tyler, the Creator", album:"Wolf",                              year:2013, genre:"hiphop",   done:false },
  { id:"w40", artist:"The Beatles",    album:"Abbey Road",                            year:1969, genre:"rock",     done:false },
  { id:"w41", artist:"The Beatles",    album:"Revolver",                              year:1966, genre:"rock",     done:false },
  { id:"w42", artist:"The Beatles",    album:"Sgt. Pepper's Lonely Hearts Club Band", year:1967, genre:"rock",     done:false },
];

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  midnight: {
    label: "Midnight", bg: "#0d0d0d", surface: "#161616", card: "#1a1a1a",
    border: "#222", text: "#e5e5e5", muted: "#555", accent: "#a78bfa",
  },
  slate: {
    label: "Slate", bg: "#0f1117", surface: "#161b27", card: "#1c2232",
    border: "#243044", text: "#e2e8f0", muted: "#4a5568", accent: "#60a5fa",
  },
  forest: {
    label: "Forest", bg: "#0a0f0a", surface: "#111a11", card: "#162016",
    border: "#1e2e1e", text: "#d4e8d4", muted: "#4a664a", accent: "#34d399",
  },
  crimson: {
    label: "Crimson", bg: "#0f0a0a", surface: "#1a1010", card: "#201414",
    border: "#2e1a1a", text: "#f0e0e0", muted: "#664444", accent: "#f87171",
  },
  gold: {
    label: "Gold", bg: "#0d0b00", surface: "#1a1600", card: "#221c00",
    border: "#332800", text: "#f5ead0", muted: "#665522", accent: "#fbbf24",
  },
  vapor: {
    label: "Vapor", bg: "#07050f", surface: "#100d1f", card: "#161228",
    border: "#221a3a", text: "#e8e0ff", muted: "#5a4a7a", accent: "#f472b6",
  },
};
const THEME_KEYS = Object.keys(THEMES);

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const SK = {
  want: "wantlist-v4", listened: "listened-v4",
  tracks: "trackcache-v2", notes: "songnotes-v2",
  songRatings: "songratings-v1", settings: "settings-v1",
  albumOrder: "albumorder-v1", songOrder: "songorder-v1",
  // NEW: store set of IDs permanently deleted by the user
  deletedWant: "deleted-want-v1", deletedListened: "deleted-listened-v1",
};
const persist = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const loadLS = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };

// Merge seed into saved, but skip any IDs the user has permanently deleted
function mergeWithSeed(seed, saved, deletedIds) {
  const deleted = new Set(deletedIds || []);
  if (!saved || !saved.length) return seed.filter(a => !deleted.has(a.id));
  const savedIds = new Set(saved.map(a => a.id));
  const newFromSeed = seed.filter(a => !savedIds.has(a.id) && !deleted.has(a.id));
  return [...saved, ...newFromSeed];
}

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── FETCH TRACKLIST ─────────────────────────────────────────────────────────
async function fetchTracklist(artist, album) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000,
      messages: [{ role: "user", content: `List every track on the album "${album}" by ${artist} in order. Reply with ONLY a valid JSON array of strings, no markdown, no commentary. Example: ["Track One","Track Two"]` }]
    })
  });
  const data = await res.json();
  const text = (data.content || []).map(b => b.text || "").join("");
  const clean = text.replace(/```[a-z]*\n?|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── COLOUR HELPERS ───────────────────────────────────────────────────────────
const ratingColor = r => {
  if (r == null) return "#444";
  if (r >= 9)   return "#fbbf24";
  if (r >= 7)   return "#34d399";
  if (r >= 5)   return "#60a5fa";
  return "#f87171";
};

// ─── ORDERING HELPERS ─────────────────────────────────────────────────────────
function applyTieOrder(sorted, order, keyOf) {
  if (!order || !order.length) return sorted;
  const rank = new Map(order.map((k, i) => [k, i]));
  const groups = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i + 1;
    while (j < sorted.length && sorted[j].__rating === sorted[i].__rating) j++;
    const group = sorted.slice(i, j);
    if (group.length > 1) {
      group.sort((a, b) => {
        const ra = rank.has(keyOf(a)) ? rank.get(keyOf(a)) : Infinity;
        const rb = rank.has(keyOf(b)) ? rank.get(keyOf(b)) : Infinity;
        if (ra !== rb) return ra - rb;
        return 0;
      });
    }
    groups.push(...group);
    i = j;
  }
  return groups;
}

function reorderWithinTieGroup(sorted, order, keyOf, key, dir) {
  const idx = sorted.findIndex(item => keyOf(item) === key);
  if (idx < 0) return order;
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= sorted.length) return order;
  if (sorted[swapIdx].__rating !== sorted[idx].__rating) return order;
  const newOrderKeys = sorted.map(keyOf);
  const a = newOrderKeys[idx], b = newOrderKeys[swapIdx];
  newOrderKeys[idx] = b; newOrderKeys[swapIdx] = a;
  return newOrderKeys;
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────
function Modal({ onClose, children, theme, wide }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.8)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px 16px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.surface, border:`1px solid ${theme.border}`,
        borderRadius:14, width:"100%", maxWidth: wide ? 760 : 560,
        maxHeight:"100%", display:"flex", flexDirection:"column",
        position:"relative", boxSizing:"border-box",
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:14, right:14, background:theme.card,
          border:`1px solid ${theme.border}`, color:theme.muted, borderRadius:7,
          width:28, height:28, cursor:"pointer", fontSize:16, lineHeight:1, zIndex:1,
        }}>×</button>
        <div style={{ overflowY:"auto", padding:"24px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FilterBar({ items, active, onSelect, field="genre", extra }) {
  const present = new Set(items.map(a => a[field]));
  const keys = ["all", ...GENRE_KEYS.filter(g => present.has(g))];
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
      {keys.map(g => {
        const on = active === g;
        const color = g === "all" ? "#888" : GENRES[g].color;
        return (
          <button key={g} onClick={() => onSelect(g)} style={{
            padding:"3px 10px", borderRadius:20,
            border:`1px solid ${on ? color : "#2a2a2a"}`,
            background: on ? color+"22" : "transparent",
            color: on ? color : "#666", cursor:"pointer", fontSize:11, fontWeight:600,
          }}>
            {g === "all" ? "All" : GENRES[g].label}
          </button>
        );
      })}
      {extra}
    </div>
  );
}

function ReorderArrows({ canUp, canDown, onUp, onDown, theme }) {
  if (!canUp && !canDown) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:1, flexShrink:0 }}>
      <button onClick={onUp} disabled={!canUp} title="Move up (same rating)" style={{
        background:"none", border:"none", cursor: canUp ? "pointer" : "default",
        color: canUp ? theme.muted : theme.border, fontSize:11, padding:"0 2px", lineHeight:1,
      }}>▲</button>
      <button onClick={onDown} disabled={!canDown} title="Move down (same rating)" style={{
        background:"none", border:"none", cursor: canDown ? "pointer" : "default",
        color: canDown ? theme.muted : theme.border, fontSize:11, padding:"0 2px", lineHeight:1,
      }}>▼</button>
    </div>
  );
}

// ─── ALBUM FORM ──────────────────────────────────────────────────────────────
function AlbumFormModal({ initial, onSave, onClose, mode, theme }) {
  const [form, setForm] = useState(initial || { artist:"", album:"", year: new Date().getFullYear(), genre:"hiphop" });
  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  return (
    <Modal onClose={onClose} theme={theme}>
      <h2 style={{ margin:"0 0 18px", fontSize:16, color:theme.text, fontWeight:700 }}>
        {mode === "edit" ? "Edit album" : "Add album"}
      </h2>
      {[["Artist","artist","text"],["Album title","album","text"],["Year","year","number"]].map(([label,key,type]) => (
        <div key={key} style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, color:theme.muted, marginBottom:4 }}>{label}</div>
          <input type={type} value={form[key]}
            onChange={e => set(key, type==="number" ? parseInt(e.target.value)||"" : e.target.value)}
            style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
              borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:13, outline:"none", boxSizing:"border-box" }}
          />
        </div>
      ))}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:4 }}>Genre</div>
        <select value={form.genre} onChange={e => set("genre", e.target.value)}
          style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:13, outline:"none" }}>
          {GENRE_KEYS.map(g => <option key={g} value={g}>{GENRES[g].label}</option>)}
        </select>
      </div>
      <button onClick={() => { if (form.artist && form.album) onSave(form); }}
        style={{ width:"100%", padding:"10px", background:theme.accent, border:"none",
          borderRadius:8, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
        {mode === "edit" ? "Save changes" : "Add album"}
      </button>
    </Modal>
  );
}

// ─── SONG RATING INPUT ───────────────────────────────────────────────────────
function SongRatingInput({ value, onChange, theme }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const rc = ratingColor(value);

  const commit = () => {
    const num = parseFloat(draft);
    if (!isNaN(num) && num >= 0 && num <= 10) onChange(Math.round(num * 10) / 10);
    else if (draft === "") onChange(null);
    setEditing(false);
  };

  if (editing) return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        placeholder="0–10"
        style={{ width:70, padding:"7px 10px", borderRadius:7, border:`1px solid ${rc}`,
          background:theme.card, color:theme.text, fontSize:16, fontWeight:700,
          textAlign:"center", outline:"none" }}
      />
      <span style={{ fontSize:11, color:theme.muted }}>e.g. 8.5 · press Enter</span>
    </div>
  );

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div onClick={() => { setDraft(value != null ? String(value) : ""); setEditing(true); }} style={{
        padding:"7px 16px", borderRadius:8, cursor:"pointer", minWidth:60, textAlign:"center",
        background: value != null ? rc+"22" : theme.card,
        border:`1px solid ${value != null ? rc+"66" : theme.border}`,
        color: value != null ? rc : theme.muted,
        fontSize: value != null ? 20 : 13, fontWeight:800,
      }}>
        {value != null ? value.toFixed(1) : "Rate it"}
      </div>
      {value != null && (
        <button onClick={() => onChange(null)} style={{
          background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:12,
        }}>clear</button>
      )}
    </div>
  );
}

// ─── NOTE SECTION ─────────────────────────────────────────────────────────────
function NoteSection({ value, onChange, theme }) {
  const [editing, setEditing] = useState(!value);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
    setEditing(!value);
  }, [value]);

  const save = () => {
    const trimmed = draft.trim();
    onChange(trimmed === "" ? "" : draft);
    setEditing(false);
  };

  if (editing || !value) return (
    <div>
      <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        placeholder="Write your thoughts on this track…" rows={6}
        style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
          borderRadius:8, padding:"10px", color:theme.text, fontSize:13, outline:"none",
          resize:"vertical", boxSizing:"border-box", fontFamily:"inherit", lineHeight:1.5 }}
      />
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <button onClick={save} style={{
          flex:1, padding:"9px", background:theme.accent, border:"none",
          borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
        }}>Save</button>
        {!!value && (
          <button onClick={() => { setDraft(value); setEditing(false); }} style={{
            padding:"9px 14px", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:8, color:theme.muted, fontSize:13, cursor:"pointer",
          }}>Cancel</button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ background:theme.card, border:`1px solid ${theme.border}`, borderRadius:10, padding:"18px 20px" }}>
        <p style={{ margin:0, color:theme.text, fontSize:16, lineHeight:1.7,
          fontFamily:"Georgia, 'Iowan Old Style', 'Times New Roman', serif",
          whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{value}</p>
      </div>
      <button onClick={() => setEditing(true)} style={{
        marginTop:8, padding:"6px 12px", background:"none",
        border:`1px solid ${theme.border}`, borderRadius:8,
        color:theme.muted, fontSize:12, cursor:"pointer",
      }}>✏️ Edit</button>
    </div>
  );
}

// ─── SONG DETAIL MODAL ───────────────────────────────────────────────────────
function SongDetailModal({ song, notes, setNotes, songRatings, setSongRatings, theme, onClose }) {
  const noteKey = `${song.artist}||${song.album}||${song.song}`;

  const setRating = val => {
    const num = parseFloat(val);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num * 10) / 10 : null;
    const next = { ...songRatings, [noteKey]: rating };
    setSongRatings(next);
    persist(SK.songRatings, next);
  };

  const setNote = val => {
    const next = { ...notes, [noteKey]: val };
    setNotes(next);
    persist(SK.notes, next);
  };

  return (
    <Modal onClose={onClose} theme={theme} wide>
      <div style={{ fontSize:11, color:theme.muted, marginBottom:2 }}>{song.artist} · {song.album}</div>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:theme.text, fontWeight:800 }}>{song.song}</h2>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:6 }}>Your rating</div>
        <SongRatingInput value={songRatings[noteKey]} onChange={setRating} theme={theme} />
      </div>
      <div style={{ fontSize:11, color:theme.muted, marginBottom:6 }}>Notes</div>
      <NoteSection value={notes[noteKey] || ""} onChange={setNote} theme={theme} />
    </Modal>
  );
}

// ─── ALBUM DETAIL MODAL ──────────────────────────────────────────────────────
function AlbumDetailModal({ album, onClose, trackCache, setTrackCache, notes, setNotes, songRatings, setSongRatings, theme }) {
  const cacheKey = `${album.artist}||${album.album}`;
  const tracks = trackCache[cacheKey];
  const [loading, setLoading] = useState(!tracks);
  const [error, setError] = useState(null);
  const [view, setView] = useState("tracks");
  const [activeSong, setActiveSong] = useState(null);
  const [editTracks, setEditTracks] = useState(null);

  useEffect(() => {
    if (tracks) { setLoading(false); return; }
    fetchTracklist(album.artist, album.album)
      .then(list => {
        const next = { ...trackCache, [cacheKey]: list };
        setTrackCache(next);
        persist(SK.tracks, next);
        setLoading(false);
      })
      .catch(() => { setError("Couldn't load tracklist. You can add tracks manually."); setLoading(false); });
  }, []);

  const noteKey = s => `${cacheKey}||${s}`;
  const ratingKey = s => `${cacheKey}||${s}`;

  const openSong = (song) => { setActiveSong(song); setView("song"); };

  const setSongNote = (song, val) => {
    const next = { ...notes, [noteKey(song)]: val };
    setNotes(next);
    persist(SK.notes, next);
  };

  const setSongRating = (song, val) => {
    const num = parseFloat(val);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num * 10) / 10 : null;
    const next = { ...songRatings, [ratingKey(song)]: rating };
    setSongRatings(next);
    persist(SK.songRatings, next);
  };

  const openEditTracks = () => {
    setEditTracks((trackCache[cacheKey] || []).map((t, i) => ({ id: String(i), val: t })));
    setView("edit");
  };
  const saveEditTracks = () => {
    const list = editTracks.map(t => t.val.trim()).filter(Boolean);
    const next = { ...trackCache, [cacheKey]: list };
    setTrackCache(next);
    persist(SK.tracks, next);
    setView("tracks");
  };
  const etSet = (id, val) => setEditTracks(p => p.map(t => t.id === id ? { ...t, val } : t));
  const etRemove = id => setEditTracks(p => p.filter(t => t.id !== id));
  const etAdd = () => setEditTracks(p => [...p, { id: uid(), val: "" }]);
  const etMove = (id, dir) => setEditTracks(p => {
    const idx = p.findIndex(t => t.id === id);
    const next = [...p];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return p;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    return next;
  });

  const c = GENRES[album.genre]?.color || "#888";
  const currentTracks = trackCache[cacheKey];

  return (
    <Modal onClose={onClose} theme={theme} wide>
      {view === "edit" && editTracks && (
        <>
          <button onClick={() => setView("tracks")} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 0 10px", display:"flex", alignItems:"center", gap:4 }}>
            ← back without saving
          </button>
          <h3 style={{ margin:"0 0 2px", color:theme.text, fontSize:15 }}>Edit tracklist</h3>
          <p style={{ margin:"0 0 12px", fontSize:11, color:theme.muted }}>{album.album} · {editTracks.length} track{editTracks.length !== 1 ? "s" : ""}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:400, overflowY:"auto", paddingRight:2 }}>
            {editTracks.map((t, i) => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:11, color:theme.muted, width:22, textAlign:"right", flexShrink:0 }}>{i + 1}</span>
                <input value={t.val} onChange={e => etSet(t.id, e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); etAdd(); } }}
                  placeholder={`Track ${i + 1}`}
                  style={{ flex:1, background:theme.card, border:`1px solid ${theme.border}`,
                    borderRadius:7, padding:"7px 10px", color:theme.text, fontSize:13,
                    outline:"none", boxSizing:"border-box" }}
                />
                <button onClick={() => etMove(t.id, -1)} disabled={i === 0} style={{
                  background:"none", border:"none", color: i === 0 ? theme.border : theme.muted,
                  cursor: i === 0 ? "default" : "pointer", fontSize:14, padding:"0 2px", lineHeight:1,
                }}>↑</button>
                <button onClick={() => etMove(t.id, 1)} disabled={i === editTracks.length - 1} style={{
                  background:"none", border:"none", color: i === editTracks.length - 1 ? theme.border : theme.muted,
                  cursor: i === editTracks.length - 1 ? "default" : "pointer", fontSize:14, padding:"0 2px", lineHeight:1,
                }}>↓</button>
                <button onClick={() => etRemove(t.id)} style={{
                  background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:15, padding:"0 2px", lineHeight:1,
                }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={etAdd} style={{
            marginTop:10, width:"100%", padding:"8px", background:"transparent",
            border:`1px dashed ${theme.border}`, borderRadius:8,
            color:theme.muted, cursor:"pointer", fontSize:12,
          }}>+ Add track</button>
          <button onClick={saveEditTracks} style={{
            marginTop:8, width:"100%", padding:"9px", background:theme.accent,
            border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
          }}>Save tracklist</button>
        </>
      )}

      {view === "song" && activeSong && (
        <>
          <button onClick={() => setView("tracks")} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 0 12px", display:"flex", alignItems:"center", gap:4 }}>
            ← back
          </button>
          <div style={{ fontSize:11, color:theme.muted, marginBottom:2 }}>{album.album}</div>
          <h2 style={{ margin:"0 0 14px", fontSize:17, color:theme.text, fontWeight:800 }}>{activeSong}</h2>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:theme.muted, marginBottom:6 }}>Your rating</div>
            <SongRatingInput value={songRatings[ratingKey(activeSong)]} onChange={val => setSongRating(activeSong, val)} theme={theme} />
          </div>
          <div style={{ fontSize:11, color:theme.muted, marginBottom:6 }}>Notes</div>
          <NoteSection value={notes[noteKey(activeSong)] || ""} onChange={val => setSongNote(activeSong, val)} theme={theme} />
        </>
      )}

      {view === "tracks" && (
        <>
          <div style={{ fontSize:11, color:c, fontWeight:700, marginBottom:4 }}>{GENRES[album.genre]?.label}</div>
          <h2 style={{ margin:"0 0 2px", fontSize:18, color:theme.text, fontWeight:800 }}>{album.album}</h2>
          <div style={{ fontSize:12, color:theme.muted, marginBottom:14 }}>{album.artist} · {album.year}</div>
          {loading && <div style={{ color:theme.muted, fontSize:13, textAlign:"center", padding:"24px 0" }}>Loading tracklist…</div>}
          {error   && <div style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{error}</div>}
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
            <button onClick={openEditTracks} style={{
              padding:"4px 10px", background:theme.card, border:`1px solid ${theme.border}`,
              borderRadius:6, color:theme.muted, cursor:"pointer", fontSize:11,
            }}>✏️ Edit tracklist</button>
          </div>
          {currentTracks && (
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {currentTracks.map((song, i) => {
                const hasNote = !!notes[noteKey(song)];
                const sr = songRatings[ratingKey(song)];
                const rc = ratingColor(sr);
                return (
                  <div key={i} onClick={() => openSong(song)} style={{
                    display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                    background:theme.card, borderRadius:8, cursor:"pointer",
                    border: hasNote || sr != null ? `1px solid ${c}40` : `1px solid ${theme.border}`,
                  }}>
                    <span style={{ fontSize:11, color:theme.muted, width:20, textAlign:"right", flexShrink:0 }}>{i+1}</span>
                    <span style={{ flex:1, fontSize:13, color:theme.text }}>{song}</span>
                    {hasNote && <span style={{ fontSize:11 }}>✍️</span>}
                    {sr != null && (
                      <span style={{ fontSize:12, fontWeight:800, color:rc, background:rc+"22", padding:"1px 6px", borderRadius:5 }}>
                        {sr.toFixed(1)}
                      </span>
                    )}
                    <span style={{ fontSize:11, color:theme.muted }}>›</span>
                  </div>
                );
              })}
            </div>
          )}
          {!currentTracks && !loading && (
            <button onClick={openEditTracks} style={{
              width:"100%", padding:"10px", background:theme.card,
              border:`1px dashed ${theme.border}`, borderRadius:8,
              color:theme.muted, cursor:"pointer", fontSize:13,
            }}>+ Add tracks manually</button>
          )}
        </>
      )}
    </Modal>
  );
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({ settings, setSettings, onClose, theme }) {
  const set = (k, v) => setSettings(p => { const n = {...p, [k]:v}; persist(SK.settings, n); return n; });
  return (
    <Modal onClose={onClose} theme={theme}>
      <h2 style={{ margin:"0 0 20px", fontSize:16, color:theme.text, fontWeight:700 }}>⚙️ Settings</h2>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Theme</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {THEME_KEYS.map(k => {
            const t = THEMES[k];
            const active = settings.theme === k;
            return (
              <button key={k} onClick={() => set("theme", k)} style={{
                padding:"10px 8px", borderRadius:9, cursor:"pointer", textAlign:"center",
                background: t.surface, border:`2px solid ${active ? t.accent : t.border}`,
                color: t.text, fontSize:12, fontWeight: active ? 700 : 400,
              }}>
                <div style={{ width:16, height:16, borderRadius:"50%", background:t.accent, margin:"0 auto 5px" }} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Default tab</div>
        {[["want","To Listen"],["heard","Rated & Ranked"],["top50","Top 50 Songs"]].map(([k,l]) => (
          <label key={k} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
            <div style={{
              width:16, height:16, borderRadius:"50%", border:`2px solid ${settings.defaultTab===k ? theme.accent : theme.border}`,
              background: settings.defaultTab===k ? theme.accent : "transparent", flexShrink:0,
            }} onClick={() => set("defaultTab", k)} />
            <span style={{ fontSize:13, color:theme.text }}>{l}</span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Sort listened by</div>
        {[["rating","Rating (highest first)"],["year","Year"],["artist","Artist A→Z"]].map(([k,l]) => (
          <label key={k} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
            <div style={{
              width:16, height:16, borderRadius:"50%", border:`2px solid ${settings.listenSort===k ? theme.accent : theme.border}`,
              background: settings.listenSort===k ? theme.accent : "transparent", flexShrink:0,
            }} onClick={() => set("listenSort", k)} />
            <span style={{ fontSize:13, color:theme.text }}>{l}</span>
          </label>
        ))}
        {settings.listenSort === "rating" && (
          <p style={{ margin:"6px 0 0", fontSize:11, color:theme.muted }}>
            Albums with the same rating can be reordered with ▲▼ on the Rated & Ranked tab.
          </p>
        )}
      </div>
      <div>
        <div style={{ fontSize:11, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Display</div>
        <label style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
          <div style={{
            width:16, height:16, borderRadius:3, border:`2px solid ${settings.compactMode ? theme.accent : theme.border}`,
            background: settings.compactMode ? theme.accent : "transparent", flexShrink:0,
          }} onClick={() => set("compactMode", !settings.compactMode)} />
          <span style={{ fontSize:13, color:theme.text }}>Compact mode</span>
        </label>
      </div>
    </Modal>
  );
}

// ─── CONFIRM MODAL (enhanced with data-loss warning) ─────────────────────────
function ConfirmModal({ message, subMessage, onConfirm, onClose, theme, dangerous }) {
  return (
    <Modal onClose={onClose} theme={theme}>
      <div style={{ fontSize:24, textAlign:"center", marginBottom:12 }}>🗑️</div>
      <p style={{ color:theme.text, fontSize:14, margin:"0 0 8px", fontWeight:600 }}>{message}</p>
      {subMessage && (
        <p style={{
          color:"#f87171", fontSize:12, margin:"0 0 20px",
          background:"#f8717118", border:"1px solid #f8717133",
          borderRadius:8, padding:"10px 12px", lineHeight:1.5,
        }}>{subMessage}</p>
      )}
      {!subMessage && <div style={{ marginBottom:20 }} />}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, padding:"9px", background:theme.card,
          border:`1px solid ${theme.border}`, borderRadius:8, color:theme.muted, cursor:"pointer", fontSize:13 }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1, padding:"9px", background:"#f87171",
          border:"none", borderRadius:8, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>Delete permanently</button>
      </div>
    </Modal>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const [settings, setSettings] = useState(() => loadLS(SK.settings, {
    theme: "midnight", defaultTab: "want", listenSort: "rating", compactMode: false,
  }));
  const theme = THEMES[settings.theme] || THEMES.midnight;

  const [tab, setTab] = useState(settings.defaultTab || "want");

  // Load deleted ID sets first so mergeWithSeed can exclude them
  const [deletedWant,     setDeletedWant]     = useState(() => loadLS(SK.deletedWant, []));
  const [deletedListened, setDeletedListened] = useState(() => loadLS(SK.deletedListened, []));

  const [want, setWant]         = useState(() => mergeWithSeed(SEED_WANT,     loadLS(SK.want, null),     loadLS(SK.deletedWant, [])));
  const [listened, setListened] = useState(() => mergeWithSeed(SEED_LISTENED, loadLS(SK.listened, null), loadLS(SK.deletedListened, [])));
  const [trackCache, setTrackCache] = useState(() => loadLS(SK.tracks, {}));
  const [notes, setNotes]       = useState(() => loadLS(SK.notes, {}));
  const [songRatings, setSongRatings] = useState(() => loadLS(SK.songRatings, {}));
  const [albumOrder, setAlbumOrder] = useState(() => loadLS(SK.albumOrder, []));
  const [songOrder, setSongOrder]   = useState(() => loadLS(SK.songOrder, []));

  const [wantFilter, setWantFilter]     = useState("all");
  const [listenFilter, setListenFilter] = useState("all");
  const [hideDone, setHideDone]         = useState(false);
  const [editRatingId, setEditRatingId] = useState(null);
  const [editRatingVal, setEditRatingVal] = useState("");

  const [detailAlbum, setDetailAlbum]   = useState(null);
  const [detailSong, setDetailSong]     = useState(null);
  const [addModal, setAddModal]         = useState(null);
  const [editModal, setEditModal]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { persist(SK.want,     want);     }, [want]);
  useEffect(() => { persist(SK.listened, listened); }, [listened]);
  useEffect(() => { persist(SK.albumOrder, albumOrder); }, [albumOrder]);
  useEffect(() => { persist(SK.songOrder, songOrder); }, [songOrder]);
  useEffect(() => { persist(SK.deletedWant,     deletedWant);     }, [deletedWant]);
  useEffect(() => { persist(SK.deletedListened, deletedListened); }, [deletedListened]);

useEffect(() => {
  async function autoLoad() {
    const { data, error } = await supabase
      .from("app_data")
      .select("data")
      .eq("id", 8)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const cloud = data.data;

    setWant(cloud.want || []);
    setListened(cloud.listened || []);
    setTrackCache(cloud.trackCache || {});
    setNotes(cloud.notes || {});
    setSongRatings(cloud.songRatings || {});
    setSettings(cloud.settings || settings);
    setAlbumOrder(cloud.albumOrder || []);
    setSongOrder(cloud.songOrder || []);
    setDeletedWant(cloud.deletedWant || []);
    setDeletedListened(cloud.deletedListened || []);
  }

  autoLoad();
}, []);

useEffect(() => {
  const timer = setTimeout(async () => {
    const payload = {
      want,
      listened,
      trackCache,
      notes,
      songRatings,
      settings,
      albumOrder,
      songOrder,
      deletedWant,
      deletedListened,
    };

    await supabase
      .from("app_data")
      .update({ data: payload })
      .eq("id", 8);

    console.log("Auto-saved to cloud");
  }, 2000);

  return () => clearTimeout(timer);
}, [
  want,
  listened,
  trackCache,
  notes,
  songRatings,
  settings,
  albumOrder,
  songOrder,
  deletedWant,
  deletedListened,
]);

  // ── helpers to check if an album has any song data ──────────────────────
  const albumHasData = (album) => {
    const cacheKey = `${album.artist}||${album.album}`;
    // album-level rating (listened tab)
    if (album.rating != null) return true;
    // any song ratings or notes under this album
    const prefix = cacheKey + "||";
    return (
      Object.keys(songRatings).some(k => k.startsWith(prefix) && songRatings[k] != null) ||
      Object.keys(notes).some(k => k.startsWith(prefix) && notes[k])
    );
  };

  const buildDeleteWarning = (album) => {
    const cacheKey = `${album.artist}||${album.album}`;
    const prefix = cacheKey + "||";
    const ratedSongs = Object.keys(songRatings).filter(k => k.startsWith(prefix) && songRatings[k] != null).length;
    const notedSongs = Object.keys(notes).filter(k => k.startsWith(prefix) && notes[k]).length;
    const parts = [];
    if (album.rating != null) parts.push(`album rating (${album.rating.toFixed(1)})`);
    if (ratedSongs > 0) parts.push(`${ratedSongs} song rating${ratedSongs > 1 ? "s" : ""}`);
    if (notedSongs > 0) parts.push(`notes on ${notedSongs} song${notedSongs > 1 ? "s" : ""}`);
    return parts.length > 0
      ? `⚠️ This will also delete: ${parts.join(", ")}. This can't be undone.`
      : null;
  };

  // mark want done → move to listened
  const toggleWantDone = id => {
    const album = want.find(a => a.id === id);
    if (!album) return;
    if (!album.done) {
      setListened(prev => [{ id:uid(), artist:album.artist, album:album.album, year:album.year, genre:album.genre, rating:null }, ...prev]);
      setWant(prev => prev.filter(a => a.id !== id));
    } else {
      setWant(prev => prev.map(a => a.id === id ? {...a, done:!a.done} : a));
    }
  };

  const handleAdd = (form, source) => {
    const entry = { ...form, id:uid(), year:parseInt(form.year)||new Date().getFullYear() };
    if (source === "want") setWant(prev => [...prev, { ...entry, done:false }]);
    else setListened(prev => [...prev, { ...entry, rating:null }]);
    setAddModal(null);
  };

  const handleEdit = (form, source, id) => {
    if (source === "want") setWant(prev => prev.map(a => a.id===id ? {...a,...form,year:parseInt(form.year)} : a));
    else setListened(prev => prev.map(a => a.id===id ? {...a,...form,year:parseInt(form.year)} : a));
    setEditModal(null);
  };

  // PERMANENT delete — record ID in deletedWant/deletedListened so seed never re-adds it
  const handleDelete = (id, source) => {
    if (source === "want") {
      setWant(prev => prev.filter(a => a.id !== id));
      setDeletedWant(prev => prev.includes(id) ? prev : [...prev, id]);
    } else {
      setListened(prev => prev.filter(a => a.id !== id));
      setDeletedListened(prev => prev.includes(id) ? prev : [...prev, id]);
    }
    setDeleteConfirm(null);
  };

  const requestDelete = (album, source) => {
    const warning = source === "listened" ? buildDeleteWarning(album) : null;
    setDeleteConfirm({ id: album.id, source, albumName: album.album, warning });
  };

  const commitRating = id => {
    const num = parseFloat(editRatingVal);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num*10)/10 : null;
    setListened(prev => prev.map(a => a.id===id ? {...a, rating} : a));
    setEditRatingId(null);
  };

  const sortListened = arr => {
    const s = settings.listenSort;
    const base = [...arr].sort((a,b) => {
      if (s === "year")   return a.year - b.year;
      if (s === "artist") return a.artist.localeCompare(b.artist);
      if (a.rating==null && b.rating==null) return 0;
      if (a.rating==null) return 1;
      if (b.rating==null) return -1;
      return b.rating - a.rating;
    });
    if (s !== "rating") return base;
    const tagged = base.map(a => ({ ...a, __rating: a.rating }));
    return applyTieOrder(tagged, albumOrder, a => a.id);
  };

  const visibleWant = want.filter(a =>
    (wantFilter==="all" || a.genre===wantFilter) && (!hideDone || !a.done)
  );
  const visibleListened = sortListened(listened.filter(a => listenFilter==="all" || a.genre===listenFilter));

  const moveAlbumInTieGroup = (album, dir) => {
    setAlbumOrder(prev => reorderWithinTieGroup(visibleListened, prev, a => a.id, album.id, dir));
  };

  const top50Base = Object.entries(songRatings)
    .filter(([,r]) => r != null)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 50)
    .map(([key, rating]) => {
      const parts = key.split("||");
      return { key, artist:parts[0], album:parts[1], song:parts[2], rating, __rating: rating };
    });
  const top50 = applyTieOrder(top50Base, songOrder, s => s.key);

  const moveSongInTieGroup = (song, dir) => {
    setSongOrder(prev => reorderWithinTieGroup(top50, prev, s => s.key, song.key, dir));
  };

  const ratedCount = listened.filter(a => a.rating!=null).length;
  const avg = ratedCount ? (listened.filter(a=>a.rating!=null).reduce((s,a)=>s+a.rating,0)/ratedCount).toFixed(1) : null;
  const compact = settings.compactMode;
  const pad = compact ? "8px 11px" : "11px 13px";

  return (
    <div style={{ minHeight:"100vh", background:theme.bg, color:theme.text, fontFamily:"system-ui,sans-serif", paddingBottom:60 }}>

      {/* NAV */}
      <div style={{ background:theme.surface, borderBottom:`1px solid ${theme.border}`, padding:"16px 18px 0" }}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
          <h1 style={{ margin:0, fontSize:18, fontWeight:800, color:theme.text, letterSpacing:"-0.3px", flex:1 }}>🎧 My Albums</h1>
          <button
  onClick={async () => {
  const payload = {
    want,
    listened,
    trackCache,
    notes,
    songRatings,
    settings,
    albumOrder,
    songOrder,
    deletedWant,
    deletedListened,
  };

  const { error } = await supabase
    .from("app_data")
    .update({ data: payload })
    .eq("id", 8);

  if (error) {
    alert("Cloud save failed");
    console.error(error);
  } else {
    alert("Cloud save successful!");
  }
}}

  style={{
    background: theme.card,
    border: `1px solid ${theme.border}`,
    color: theme.muted,
    borderRadius: 8,
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: 12,
    marginRight: 8,
  }}
>
  ☁ Save
  
</button>
<button
  onClick={async () => {
    const { data, error } = await supabase
      .from("app_data")
      .select("data")
      .eq("id", 8)
      .single();

    if (error) {
      alert("Cloud load failed");
      console.error(error);
      return;
    }

const cloud = data.data;

console.log("CLOUD WANT LENGTH:", cloud.want.length);
console.log("LOCAL WANT LENGTH:", want.length);

setWant(cloud.want || []);
console.log("AFTER SET WANT");
setListened(cloud.listened || []);
setTrackCache(cloud.trackCache || {});
setNotes(cloud.notes || {});
setSongRatings(cloud.songRatings || {});
setSettings(cloud.settings || settings);
setAlbumOrder(cloud.albumOrder || []);
setSongOrder(cloud.songOrder || []);
setDeletedWant(cloud.deletedWant || []);
setDeletedListened(cloud.deletedListened || []);

setTab("heard");
setTimeout(() => setTab("want"), 100);

alert("Cloud data loaded!");
  }}
  style={{
    background: theme.card,
    border: `1px solid ${theme.border}`,
    color: theme.muted,
    borderRadius: 8,
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: 12,
    marginRight: 8,
  }}
>
  ☁ Load
</button>
          <button onClick={() => setShowSettings(true)} style={{
            background:theme.card, border:`1px solid ${theme.border}`, color:theme.muted,
            borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:12,
          }}>⚙️ Settings</button>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[["want","To Listen"],["heard","Rated & Ranked"],["top50","Top 50 Songs"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding:"7px 14px", border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
              background:"transparent", color: tab===key ? theme.text : theme.muted,
              borderBottom: tab===key ? `2px solid ${theme.accent}` : "2px solid transparent",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ══ TO-LISTEN ════════════════════════════════════════════════════════ */}
      {tab === "want" && (
        <>
          <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${theme.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ flex:1, height:4, background:theme.card, borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.round((want.filter(a=>a.done).length/Math.max(want.length,1))*100)}%`,
                  background:`linear-gradient(90deg,${theme.accent},#60a5fa)`, borderRadius:2, transition:"width .4s" }} />
              </div>
              <span style={{ fontSize:11, color:theme.muted, whiteSpace:"nowrap" }}>{want.filter(a=>a.done).length}/{want.length}</span>
            </div>
            <FilterBar items={want} active={wantFilter} onSelect={setWantFilter} extra={
              <button onClick={() => setHideDone(p=>!p)} style={{
                marginLeft:"auto", padding:"3px 10px", borderRadius:20, border:`1px solid ${theme.border}`,
                background:"transparent", color:theme.muted, cursor:"pointer", fontSize:11,
              }}>{hideDone ? "Show done" : "Hide done"}</button>
            } />
          </div>
          <div style={{ padding:"10px 18px", display:"flex", flexDirection:"column", gap:5 }}>
            <button onClick={() => setAddModal("want")} style={{
              padding:"9px", background:theme.surface, border:`1px dashed ${theme.border}`,
              borderRadius:9, color:theme.muted, cursor:"pointer", fontSize:12, textAlign:"left",
            }}>+ Add album</button>
            {visibleWant.map(a => {
              const c = GENRES[a.genre]?.color || "#888";
              const albumPrefix = `${a.artist}||${a.album}||`;
              const hasAlbumNotes = Object.keys(notes).some(k => k.startsWith(albumPrefix) && notes[k]);
              return (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", gap:9, padding:pad,
                  background: a.done ? theme.surface : theme.card,
                  borderRadius:9, border: a.start&&!a.done ? `1px solid ${c}55` : `1px solid ${theme.border}`,
                  opacity: a.done ? 0.4 : 1, transition:"opacity .2s",
                }}>
                  <div onClick={() => toggleWantDone(a.id)} style={{
                    width:19, height:19, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                    border:`2px solid ${a.done ? c : theme.border}`, background: a.done ? c : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s",
                  }}>
                    {a.done && <span style={{ color:"#000", fontSize:10, fontWeight:800 }}>✓</span>}
                  </div>
                  <div onClick={() => setDetailAlbum(a)} style={{ flex:1, minWidth:0, cursor:"pointer" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:600, color: a.done?theme.muted:theme.text,
                        textDecoration: a.done?"line-through":"none" }}>{a.album}</span>
                      {a.start && !a.done && <span style={{ fontSize:9, padding:"1px 5px", borderRadius:5,
                        background:c+"30", color:c, fontWeight:800 }}>START HERE</span>}
                    </div>
                    {!compact && <div style={{ fontSize:11, color:theme.muted, marginTop:1 }}>
                      {a.artist} · {a.year}{a.note ? ` · ${a.note}` : ""}
                    </div>}
                  </div>
                  {hasAlbumNotes && (
                    <span title="Has song notes" style={{ fontSize:12, flexShrink:0 }}>✍️</span>
                  )}
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8,
                    background:c+"18", color:c, border:`1px solid ${c}30`, flexShrink:0 }}>
                    {GENRES[a.genre]?.label}
                  </div>
                  <button onClick={() => setEditModal({album:a, source:"want"})} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>✏️</button>
                  <button onClick={() => requestDelete(a, "want")} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>🗑️</button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══ RATED & RANKED ═══════════════════════════════════════════════════ */}
      {tab === "heard" && (
        <>
          <div style={{ padding:"12px 18px 10px", borderBottom:`1px solid ${theme.border}` }}>
            <div style={{ display:"flex", gap:14, marginBottom:10 }}>
              <span style={{ fontSize:12, color:theme.muted }}><span style={{ color:theme.text, fontWeight:700, fontSize:15 }}>{listened.length}</span> albums</span>
              <span style={{ fontSize:12, color:theme.muted }}><span style={{ color:theme.text, fontWeight:700, fontSize:15 }}>{ratedCount}</span> rated</span>
              {avg && <span style={{ fontSize:12, color:theme.muted }}>avg <span style={{ color:"#fbbf24", fontWeight:700, fontSize:15 }}>{avg}</span></span>}
            </div>
            <FilterBar items={listened} active={listenFilter} onSelect={setListenFilter} />
          </div>
          <div style={{ padding:"10px 18px", display:"flex", flexDirection:"column", gap:5 }}>
            <button onClick={() => setAddModal("listened")} style={{
              padding:"9px", background:theme.surface, border:`1px dashed ${theme.border}`,
              borderRadius:9, color:theme.muted, cursor:"pointer", fontSize:12, textAlign:"left",
            }}>+ Add album</button>
            <p style={{ fontSize:11, color:theme.border, margin:"2px 0 4px" }}>
              Tap a rating to edit · tap title for tracklist
              {settings.listenSort==="rating" && " · ▲▼ reorders ties"}
            </p>
            {visibleListened.map((a, i) => {
              const c = GENRES[a.genre]?.color || "#888";
              const rc = ratingColor(a.rating);
              const isEditing = editRatingId === a.id;
              const prev = visibleListened[i-1];
              const next = visibleListened[i+1];
              const canUp   = settings.listenSort==="rating" && a.rating!=null && prev && prev.rating === a.rating;
              const canDown = settings.listenSort==="rating" && a.rating!=null && next && next.rating === a.rating;
              const albumPrefix = `${a.artist}||${a.album}||`;
              const hasAlbumNotes = Object.keys(notes).some(k => k.startsWith(albumPrefix) && notes[k]);
              return (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", gap:8, padding:pad,
                  background:theme.card, borderRadius:9, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:22, textAlign:"right", fontSize:11, color:a.rating!=null?theme.muted:theme.border, flexShrink:0, fontWeight:700 }}>
                    {settings.listenSort==="rating" && a.rating!=null ? i+1 : "—"}
                  </div>
                  <ReorderArrows canUp={canUp} canDown={canDown}
                    onUp={() => moveAlbumInTieGroup(a, -1)}
                    onDown={() => moveAlbumInTieGroup(a, 1)}
                    theme={theme} />
                  <div onClick={() => setDetailAlbum(a)} style={{ flex:1, minWidth:0, cursor:"pointer" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{a.album}</div>
                    {!compact && <div style={{ fontSize:11, color:theme.muted, marginTop:1 }}>{a.artist} · {a.year}</div>}
                  </div>
                  {hasAlbumNotes && (
                    <span title="Has song notes" style={{ fontSize:12, flexShrink:0 }}>✍️</span>
                  )}
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:c+"18", color:c, border:`1px solid ${c}30`, flexShrink:0 }}>
                    {GENRES[a.genre]?.label}
                  </div>
                  {isEditing ? (
                    <input autoFocus value={editRatingVal}
                      onChange={e => setEditRatingVal(e.target.value)}
                      onBlur={() => commitRating(a.id)}
                      onKeyDown={e => { if(e.key==="Enter") commitRating(a.id); if(e.key==="Escape") setEditRatingId(null); }}
                      placeholder="0–10"
                      style={{ width:50, padding:"4px 5px", borderRadius:6, border:`1px solid ${rc}`,
                        background:theme.bg, color:theme.text, fontSize:13, fontWeight:700, textAlign:"center", outline:"none" }}
                    />
                  ) : (
                    <div onClick={() => { setEditRatingId(a.id); setEditRatingVal(a.rating!=null?String(a.rating):""); }} style={{
                      minWidth:42, padding:"4px 7px", borderRadius:6, cursor:"pointer",
                      background: a.rating!=null ? rc+"22" : theme.surface,
                      border:`1px solid ${a.rating!=null ? rc+"55" : theme.border}`,
                      color: a.rating!=null ? rc : theme.muted, fontSize:13, fontWeight:800,
                      textAlign:"center", flexShrink:0,
                    }}>
                      {a.rating!=null ? a.rating.toFixed(1) : "+"}
                    </div>
                  )}
                  <button onClick={() => setEditModal({album:a, source:"listened"})} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>✏️</button>
                  <button onClick={() => requestDelete(a, "listened")} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>🗑️</button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══ TOP 50 SONGS ═════════════════════════════════════════════════════ */}
      {tab === "top50" && (
        <div style={{ padding:"16px 18px" }}>
          <p style={{ margin:"0 0 14px", fontSize:12, color:theme.muted }}>
            Rate individual songs inside an album's tracklist to build your leaderboard.
            {top50.length > 0 && ` Showing ${top50.length} rated song${top50.length!==1?"s":""}.`}
            {top50.length > 1 && " Use ▲▼ to reorder songs with the same rating."}
          </p>
          {top50.length === 0 && (
            <div style={{ textAlign:"center", padding:"48px 0", color:theme.muted }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🎵</div>
              <div style={{ fontSize:14 }}>No song ratings yet</div>
              <div style={{ fontSize:12, marginTop:6 }}>Open any album and tap a track to rate it</div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {top50.map((s, i) => {
              const rc = ratingColor(s.rating);
              const albumObj = listened.find(a => a.artist===s.artist && a.album===s.album)
                           || want.find(a => a.artist===s.artist && a.album===s.album);
              const c = albumObj ? GENRES[albumObj.genre]?.color || "#888" : "#888";
              const prevS = top50[i-1];
              const nextS = top50[i+1];
              const canUp   = prevS && prevS.rating === s.rating;
              const canDown = nextS && nextS.rating === s.rating;
              return (
                <div key={s.key} style={{
                  display:"flex", alignItems:"center", gap:10, padding:pad,
                  background:theme.card, borderRadius:9, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:26, textAlign:"right", fontSize:i<3?16:12,
                    color: i===0?"#fbbf24":i===1?"#94a3b8":i===2?"#b45309":theme.muted,
                    fontWeight:800, flexShrink:0 }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                  </div>
                  <ReorderArrows canUp={canUp} canDown={canDown}
                    onUp={() => moveSongInTieGroup(s, -1)}
                    onDown={() => moveSongInTieGroup(s, 1)}
                    theme={theme} />
                  <div onClick={() => setDetailSong(s)} style={{ flex:1, minWidth:0, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{s.song}</div>
                      <div style={{ fontSize:11, color:theme.muted, marginTop:1 }}>{s.artist} · {s.album}</div>
                    </div>
                    {!!notes[s.key] && <span style={{ fontSize:11, flexShrink:0 }}>✍️</span>}
                  </div>
                  {albumObj && (
                    <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:c+"18", color:c, border:`1px solid ${c}30`, flexShrink:0 }}>
                      {GENRES[albumObj.genre]?.label}
                    </div>
                  )}
                  <div onClick={() => setDetailSong(s)} style={{ minWidth:40, padding:"4px 7px", borderRadius:6, cursor:"pointer",
                    background:rc+"22", border:`1px solid ${rc}55`, color:rc,
                    fontSize:14, fontWeight:800, textAlign:"center", flexShrink:0 }}>
                    {s.rating.toFixed(1)}
                  </div>
                  <span onClick={() => setDetailSong(s)} style={{ fontSize:11, color:theme.muted, cursor:"pointer", flexShrink:0 }}>›</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}
      {detailAlbum && (
        <AlbumDetailModal
          album={detailAlbum} onClose={() => setDetailAlbum(null)}
          trackCache={trackCache} setTrackCache={setTrackCache}
          notes={notes} setNotes={setNotes}
          songRatings={songRatings} setSongRatings={setSongRatings}
          theme={theme}
        />
      )}
      {detailSong && (
        <SongDetailModal
          song={detailSong} onClose={() => setDetailSong(null)}
          notes={notes} setNotes={setNotes}
          songRatings={songRatings} setSongRatings={setSongRatings}
          theme={theme}
        />
      )}
      {addModal && (
        <AlbumFormModal mode="add" onSave={form => handleAdd(form, addModal)}
          onClose={() => setAddModal(null)} theme={theme} />
      )}
      {editModal && (
        <AlbumFormModal mode="edit" initial={editModal.album}
          onSave={form => handleEdit(form, editModal.source, editModal.album.id)}
          onClose={() => setEditModal(null)} theme={theme} />
      )}
      {deleteConfirm && (
        <ConfirmModal
          message={`Delete "${deleteConfirm.albumName}"?`}
          subMessage={deleteConfirm.warning}
          onConfirm={() => handleDelete(deleteConfirm.id, deleteConfirm.source)}
          onClose={() => setDeleteConfirm(null)}
          theme={theme}
        />
      )}
      {showSettings && (
        <SettingsModal settings={settings} setSettings={setSettings}
          onClose={() => setShowSettings(false)} theme={theme} />
      )}
    </div>
  );
}