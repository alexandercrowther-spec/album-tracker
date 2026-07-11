import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
// ─── GENRES ───────────────────────────────────────────────────────────────────
const GENRES = {
  hiphop:           { label: "Hip-Hop", color: "#f87171" },
  rap:              { label: "Rap", color: "#fb923c" },
  trap:             { label: "Trap", color: "#fca5a5" },
  drill:            { label: "Drill", color: "#dc2626" },
  boombap:          { label: "Boom Bap", color: "#f97316" },
  grime:            { label: "Grime", color: "#b91c1c" },

  alternative:      { label: "Alternative Rock", color: "#a78bfa" },
  indie:            { label: "Indie Rock", color: "#c084fc" },
  indiepop:         { label: "Indie Pop", color: "#f472b6" },
  rock:             { label: "Classic Rock", color: "#60a5fa" },
  hardrock:         { label: "Hard Rock", color: "#dc2626" },
  psychrock:        { label: "Psychedelic Rock", color: "#8b5cf6" },
  progrock:         { label: "Progressive Rock", color: "#6366f1" },
  jazzrock:         { label: "Jazz Rock", color: "#3b82f6" },
  punk:             { label: "Punk", color: "#ef4444" },
  postpunk:         { label: "Post-Punk", color: "#6366f1" },
  hardcorepunk:     { label: "Hardcore Punk", color: "#b91c1c" },
  emo:              { label: "Emo", color: "#7c3aed" },
  metal:            { label: "Metal", color: "#9ca3af" },
  metalcore:        { label: "Metalcore", color: "#57534e" },
  grunge:           { label: "Grunge", color: "#78716c" },
  artrock:          { label: "Art Rock", color: "#3b82f6" },
  poprock:          { label: "Pop Rock", color: "#ec4899" },
  shoegaze:         { label: "Shoegaze", color: "#8b5cf6" },
  dreampop:         { label: "Dream Pop", color: "#a855f7" },
  newwave:          { label: "New Wave", color: "#06b6d4" },
  britpop:          { label: "Britpop", color: "#f59e0b" },
  garagerock:       { label: "Garage Rock", color: "#ef4444" },
  mathrock:         { label: "Math Rock", color: "#4f46e5" },
  postrock:         { label: "Post-Rock", color: "#4338ca" },
  southernrock:     { label: "Southern Rock", color: "#ea580c" },
  glamrock:         { label: "Glam Rock", color: "#d946ef" },
  bluegrass:        { label: "Bluegrass", color: "#65a30d" },

  pop:              { label: "Pop", color: "#f9a8d4" },
  synthpop:         { label: "Synth-Pop", color: "#ec4899" },
  powerpop:         { label: "Power Pop", color: "#f9a8d4" },
  kpop:             { label: "K-Pop", color: "#f472b6" },
  jpop:             { label: "J-Pop", color: "#fb7185" },
  chamberpop:       { label: "Chamber Pop", color: "#fb7185" },

  jazz:             { label: "Jazz", color: "#fbbf24" },
  soul:             { label: "Soul", color: "#f59e0b" },
  neosoul:          { label: "Neo Soul", color: "#f59e0b" },
  rnb:              { label: "R&B", color: "#f472b6" },
  funk:             { label: "Funk / Disco", color: "#eab308" },
  disco:            { label: "Disco", color: "#eab308" },
  gospel:           { label: "Gospel", color: "#facc15" },
  blues:            { label: "Blues", color: "#0284c7" },
  triphop:          { label: "Trip Hop", color: "#14b8a6" },

  folk:             { label: "Folk", color: "#34d399" },
  folkrock:         { label: "Folk Rock", color: "#22c55e" },
  singersongwriter: { label: "Singer-Songwriter", color: "#22c55e" },
  country:          { label: "Country", color: "#a3e635" },
  americana:        { label: "Americana", color: "#84cc16" },

  electronic:       { label: "Electronic", color: "#38bdf8" },
  house:            { label: "House", color: "#06b6d4" },
  techno:           { label: "Techno", color: "#0891b2" },
  dubstep:          { label: "Dubstep", color: "#0ea5e9" },
  drumandbass:      { label: "Drum & Bass", color: "#0369a1" },
  idm:              { label: "IDM", color: "#0e7490" },
  ambient:          { label: "Ambient", color: "#06b6d4" },
  downtempo:        { label: "Downtempo", color: "#22d3ee" },
  vaporwave:        { label: "Vaporwave", color: "#f0abfc" },
  lofi:             { label: "Lo-Fi", color: "#a5b4fc" },
  industrial:       { label: "Industrial", color: "#525252" },

  classical:        { label: "Classical", color: "#94a3b8" },
  soundtrack:       { label: "Soundtrack / Score", color: "#818cf8" },
  musical:          { label: "Musical Theatre", color: "#fb923c" },

  reggae:           { label: "Reggae", color: "#16a34a" },
  ska:              { label: "Ska", color: "#059669" },
  afrobeat:         { label: "Afrobeat", color: "#ca8a04" },
  latin:            { label: "Latin", color: "#f59e0b" },
  worldmusic:       { label: "World", color: "#0d9488" },

  experimental:     { label: "Experimental", color: "#7e22ce" },
  noise:            { label: "Noise", color: "#374151" },
  comedy:           { label: "Comedy", color: "#facc15" },

  other:            { label: "Other", color: "#6b7280" },
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
  ocean: {
    label: "Ocean", bg: "#07131c", surface: "#0d1d29", card: "#132738",
    border: "#1f3d57", text: "#dbeafe", muted: "#5b7c99", accent: "#38bdf8",
  },
  emerald: {
    label: "Emerald", bg: "#08120d", surface: "#0f1b14", card: "#14241b",
    border: "#1f3a2b", text: "#dcfce7", muted: "#5f8a70", accent: "#10b981",
  },
  sunset: {
    label: "Sunset", bg: "#1a0d08", surface: "#24120c", card: "#311810",
    border: "#4a2418", text: "#ffedd5", muted: "#b07a5b", accent: "#fb923c",
  },
  plum: {
    label: "Plum", bg: "#120a16", surface: "#1c1023", card: "#25152e",
    border: "#3a2148", text: "#f0e3ff", muted: "#7a5f96", accent: "#c084fc",
  },
  rosegold: {
    label: "Rose Gold", bg: "#150c0e", surface: "#221316", card: "#2c191d",
    border: "#432429", text: "#ffe4e6", muted: "#a06a72", accent: "#fb7185",
  },
  arctic: {
    label: "Arctic", bg: "#0a1014", surface: "#101a20", card: "#16232b",
    border: "#213641", text: "#e0f2fe", muted: "#5c7c8c", accent: "#67e8f9",
  },
  mono: {
    label: "Mono", bg: "#0a0a0a", surface: "#151515", card: "#1c1c1c",
    border: "#2a2a2a", text: "#f5f5f5", muted: "#737373", accent: "#e5e5e5",
  },
  coffee: {
    label: "Coffee", bg: "#120d0a", surface: "#1d1610", card: "#261c14",
    border: "#3a2c1e", text: "#f0e2d0", muted: "#8a715a", accent: "#d97706",
  },
  neon: {
    label: "Neon", bg: "#08050f", surface: "#100a1f", card: "#160e2b",
    border: "#2a1b4a", text: "#eafff4", muted: "#5c6a8a", accent: "#39ff9f",
  },
  lavender: {
    label: "Lavender", bg: "#100e1a", surface: "#181428", card: "#201a35",
    border: "#332a55", text: "#ece8ff", muted: "#8078a8", accent: "#a5b4fc",
  },
  cherry: {
    label: "Cherry", bg: "#150608", surface: "#210b0e", card: "#2b0f13",
    border: "#451a20", text: "#ffe0e3", muted: "#a15c63", accent: "#fb2c5c",
  },
  paper: {
    label: "Paper", bg: "#1a1812", surface: "#26221a", card: "#2f2a20",
    border: "#443c2c", text: "#f2ecd9", muted: "#a4977a", accent: "#eab308",
  },
};
const THEME_KEYS = Object.keys(THEMES);

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const SK = {
  listened: "listened-v4",
  tracks: "trackcache-v2",
  songRatings: "songratings-v1", settings: "settings-v1",
  albumOrder: "albumorder-v1", songOrder: "songorder-v1",
  // store set of IDs permanently deleted by the user
  deletedListened: "deleted-listened-v1",
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
const normalize = s => (s || "").trim().toLowerCase();

// ─── RESPONSIVE HELPER ────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}



// ─── COLOUR HELPERS ───────────────────────────────────────────────────────────
const ratingColor = r => {
  if (r == null) return "#444";
  if (r >= 10) return "linear-gradient(135deg,#f8e7ff 0%,#cdb8ff 18%,#8be9ff 38%,#baffc9 56%,#fff0a6 74%,#ffb3ec 100%)";
  if (r >= 9) return "#f78fbf";
  if (r >= 8) return "#6bb3ff";
  if (r >= 7) return "#86efac";
  if (r >= 5) return "#f59e0b";
  return "#ef4444";
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
        borderRadius:14, width:"100%", maxWidth: wide ? 1400 : 1000,
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
function AlbumFormModal({ initial, onSave, onClose, mode, theme, isDuplicate }) {
  const [form, setForm] = useState(initial || { artist:"", album:"", year: new Date().getFullYear(), genre:"hiphop", cover:"" });
  const [saving, setSaving] = useState(false);
  const [dupError, setDupError] = useState(null);
  const set = (k, v) => { setForm(p => ({...p, [k]: v})); setDupError(null); };
  const submit = async () => {
    if (!form.artist || !form.album) return;
    if (isDuplicate && isDuplicate(form.artist, form.album)) {
      setDupError(`You already have "${form.album.trim()}" by ${form.artist.trim()} saved. Duplicate albums (case-insensitive) aren't allowed.`);
      return;
    }
    setSaving(true);
    await onSave(form);
  };
  return (
    <Modal onClose={onClose} theme={theme}>
      <h2 style={{ margin:"0 0 18px", fontSize:16, color:theme.text, fontWeight:700 }}>
        {mode === "edit" ? "Edit album" : "Add album"}
      </h2>
      {[["Artist","artist","text"],["Album title","album","text"],["Year","year","number"]].map(([label,key,type]) => (
        <div key={key} style={{ marginBottom:12 }}>
          <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>{label}</div>
          <input type={type} value={form[key]}
            onChange={e => set(key, type==="number" ? parseInt(e.target.value)||"" : e.target.value)}
            style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
              borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:16, outline:"none", boxSizing:"border-box" }}
          />
        </div>
      ))}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Genre</div>
        <select value={form.genre} onChange={e => set("genre", e.target.value)}
          style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:16, outline:"none" }}>
          {GENRE_KEYS.map(g => <option key={g} value={g}>{GENRES[g].label}</option>)}
        </select>
      </div>

      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Cover URL (optional)</div>
        <input
          type="text"
          value={form.cover || ""}
          onChange={e => set("cover", e.target.value)}
          placeholder="https://..."
          style={{ width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:16,
            outline:"none", boxSizing:"border-box" }}
        />
      </div>
      {mode !== "edit" && (
        <div style={{ fontSize:11, color:theme.muted, marginBottom:14 }}>
          Cover art and the tracklist are looked up automatically once you add the album.
        </div>
      )}
      {dupError && (
        <div style={{
          color:"#f87171", fontSize:12, margin:"0 0 14px",
          background:"#f8717118", border:"1px solid #f8717133",
          borderRadius:8, padding:"10px 12px", lineHeight:1.5,
        }}>{dupError}</div>
      )}
      <button onClick={submit} disabled={saving}
        style={{ width:"100%", padding:"10px", background:theme.accent, border:"none",
          borderRadius:8, color:"#fff", fontWeight:700, fontSize:14, cursor: saving ? "default" : "pointer",
          opacity: saving ? 0.7 : 1 }}>
        {saving ? "Looking up tracklist…" : (mode === "edit" ? "Save changes" : "Add album")}
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
      <span style={{ fontSize:13, color:theme.muted }}>e.g. 8.5 · press Enter</span>
    </div>
  );

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div onClick={() => { setDraft(value != null ? String(value) : ""); setEditing(true); }} style={{
        padding:"7px 16px", borderRadius:8, cursor:"pointer", minWidth:60, textAlign:"center",
        background: value != null ? (value>=10 ? "linear-gradient(135deg,#f8e7ff 0%,#cdb8ff 18%,#8be9ff 38%,#baffc9 56%,#fff0a6 74%,#ffb3ec 100%)" : rc+"22") : theme.card,
        border:`1px solid ${value != null ? (value>=10?"#e9d5ff":rc+"66") : theme.border}`,
        color: value != null ? (value>=10?"#111827":rc) : theme.muted,
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

// ─── SONG DETAIL MODAL ───────────────────────────────────────────────────────
function SongDetailModal({ song, songRatings, setSongRatings, theme, onClose, onOpenArtist }) {
  const noteKey = `${song.artist}||${song.album}||${song.song}`;

  const setRating = val => {
    const num = parseFloat(val);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num * 10) / 10 : null;
    const next = { ...songRatings, [noteKey]: rating };
    setSongRatings(next);
    persist(SK.songRatings, next);
  };

  return (
    <Modal onClose={onClose} theme={theme} wide>
      <div style={{ fontSize:13, color:theme.muted, marginBottom:2 }}>
        <span onClick={() => onOpenArtist(song.artist)} style={{ cursor:"pointer", textDecoration:"underline", textDecorationColor:"transparent" }}
          onMouseEnter={e => e.currentTarget.style.textDecorationColor = theme.muted}
          onMouseLeave={e => e.currentTarget.style.textDecorationColor = "transparent"}
        >{song.artist}</span> · {song.album}
      </div>
      <h2 style={{ margin:"0 0 14px", fontSize:17, color:theme.text, fontWeight:800 }}>{song.song}</h2>
      <div>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:6 }}>Your rating</div>
        <SongRatingInput value={songRatings[noteKey]} onChange={setRating} theme={theme} />
      </div>
    </Modal>
  );
}

// ─── ALBUM DETAIL MODAL ──────────────────────────────────────────────────────
// ─── CRITIC SCORE (AOTY) ─────────────────────────────────────────────────────
function CriticScoreBlock({ album, onSetCriticScore, theme }) {
  const [fetching, setFetching] = useState(false);
  const [editing, setEditing] = useState(false);
  const [manualVal, setManualVal] = useState("");
  const [manualError, setManualError] = useState(null);

  useEffect(() => {
    if (album.criticScoreChecked) return;
    let cancelled = false;
    setFetching(true);
    fetch(`/api/critic-score?artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.album)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        onSetCriticScore(album.id, data?.criticScore ?? null, data?.criticScore != null ? "aoty" : null);
      })
      .catch(() => {
        if (!cancelled) onSetCriticScore(album.id, null, null);
      })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album.id]);

  const saveManual = () => {
    const num = parseFloat(manualVal);
    if (isNaN(num) || num < 0 || num > 100) {
      setManualError("Enter a score from 0–100 (AOTY's scale).");
      return;
    }
    onSetCriticScore(album.id, Math.round(num), "manual");
    setEditing(false);
    setManualError(null);
  };

  const critic10 = album.criticScore != null ? album.criticScore / 10 : null;
  const diff = (album.rating != null && critic10 != null) ? Math.round((album.rating - critic10) * 10) / 10 : null;

  return (
    <div style={{
      display:"flex", flexDirection:"column", gap:8, margin:"0 0 14px",
      padding:"10px 12px", background:theme.card, borderRadius:10, border:`1px solid ${theme.border}`,
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, fontWeight:700, color:theme.muted, textTransform:"uppercase", letterSpacing:0.4 }}>
          Critic score (AOTY)
        </span>
        {album.criticScore != null && !editing && (
          <button onClick={() => { setManualVal(String(album.criticScore)); setEditing(true); }} style={{
            background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:11, padding:0,
          }}>✏️ edit</button>
        )}
      </div>

      {fetching && !album.criticScoreChecked && (
        <span style={{ fontSize:12, color:theme.muted }}>Checking AOTY…</span>
      )}

      {!fetching && album.criticScoreChecked && album.criticScore == null && !editing && (
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:theme.muted }}>No critic score found.</span>
          <button onClick={() => { setManualVal(""); setEditing(true); }} style={{
            background:"none", border:`1px solid ${theme.border}`, borderRadius:6,
            color:theme.text, cursor:"pointer", fontSize:11, padding:"3px 8px",
          }}>+ Enter manually</button>
        </div>
      )}

      {editing && (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ display:"flex", gap:6 }}>
            <input
              type="number" min="0" max="100" value={manualVal}
              onChange={e => { setManualVal(e.target.value); setManualError(null); }}
              placeholder="e.g. 84"
              style={{
                flex:1, background:theme.surface, border:`1px solid ${theme.border}`,
                borderRadius:7, padding:"6px 9px", color:theme.text, fontSize:14, outline:"none", boxSizing:"border-box",
              }}
            />
            <button onClick={saveManual} style={{
              padding:"6px 12px", background:theme.accent, border:"none", borderRadius:7,
              color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
            }}>Save</button>
            <button onClick={() => { setEditing(false); setManualError(null); }} style={{
              padding:"6px 10px", background:"none", border:`1px solid ${theme.border}`, borderRadius:7,
              color:theme.muted, fontSize:12, cursor:"pointer",
            }}>Cancel</button>
          </div>
          {manualError && <span style={{ fontSize:11, color:"#f87171" }}>{manualError}</span>}
        </div>
      )}

      {!editing && album.criticScore != null && (
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div>
            <div style={{ fontSize:10, color:theme.muted, marginBottom:2 }}>Your rating</div>
            <div style={{ fontSize:18, fontWeight:800, color:theme.text }}>
              {album.rating != null ? album.rating.toFixed(1) : "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, color:theme.muted, marginBottom:2 }}>Critics</div>
            <div style={{ fontSize:18, fontWeight:800, color:theme.text }}>
              {critic10.toFixed(1)}
              <span style={{ fontSize:10, color:theme.muted, fontWeight:400, marginLeft:4 }}>
                ({album.criticScore}/100{album.criticScoreSource === "manual" ? ", manual" : ""})
              </span>
            </div>
          </div>
          {diff != null && (
            <div style={{
              marginLeft:"auto", fontSize:13, fontWeight:800, padding:"3px 9px", borderRadius:7,
              color: diff >= 0 ? "#22c55e" : "#f87171",
              background: diff >= 0 ? "#22c55e1e" : "#f871711e",
            }}>
              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlbumDetailModal({ album, onClose, trackCache, setTrackCache, songRatings, setSongRatings, theme, onOpenArtist, onSetCriticScore }) {
  const cacheKey = `${album.artist}||${album.album}`;
  const tracks = trackCache[cacheKey];
  const [loading, setLoading] = useState(!tracks);
  const [error, setError] = useState(null);
  const [view, setView] = useState("tracks");
  const [activeSong, setActiveSong] = useState(null);
  const [editTracks, setEditTracks] = useState(null);
  const [etError, setEtError] = useState(null);

  useEffect(() => {
  if (!tracks) {
    const next = { ...trackCache, [cacheKey]: [] };
    setTrackCache(next);
    persist(SK.tracks, next);
  }

  setLoading(false);
}, []);

  const ratingKey = s => `${cacheKey}||${s}`;

  const openSong = (song) => { setActiveSong(song); setView("song"); };

  const setSongRating = (song, val) => {
    const num = parseFloat(val);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num * 10) / 10 : null;
    const next = { ...songRatings, [ratingKey(song)]: rating };
    setSongRatings(next);
    persist(SK.songRatings, next);
  };

  const openEditTracks = () => {
    setEditTracks((trackCache[cacheKey] || []).map((t, i) => ({ id: String(i), val: t })));
    setEtError(null);
    setView("edit");
  };
  const saveEditTracks = () => {
    const list = editTracks.map(t => t.val.trim()).filter(Boolean);
    const seen = new Set();
    for (const t of list) {
      const norm = normalize(t);
      if (seen.has(norm)) {
        setEtError(`"${t}" appears more than once in this tracklist (track names must be unique, case-insensitive).`);
        return;
      }
      seen.add(norm);
    }
    setEtError(null);
    const next = { ...trackCache, [cacheKey]: list };
    setTrackCache(next);
    persist(SK.tracks, next);
    setView("tracks");
  };
  const etSet = (id, val) => { setEditTracks(p => p.map(t => t.id === id ? { ...t, val } : t)); setEtError(null); };
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
          <p style={{ margin:"0 0 12px", fontSize:13, color:theme.muted }}>{album.album} · {editTracks.length} track{editTracks.length !== 1 ? "s" : ""}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:400, overflowY:"auto", paddingRight:2 }}>
            {editTracks.map((t, i) => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:13, color:theme.muted, width:22, textAlign:"right", flexShrink:0 }}>{i + 1}</span>
                <input value={t.val} onChange={e => etSet(t.id, e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); etAdd(); } }}
                  placeholder={`Track ${i + 1}`}
                  style={{ flex:1, background:theme.card, border:`1px solid ${theme.border}`,
                    borderRadius:7, padding:"7px 10px", color:theme.text, fontSize:16,
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
          {etError && (
            <div style={{
              marginTop:10, color:"#f87171", fontSize:12,
              background:"#f8717118", border:"1px solid #f8717133",
              borderRadius:8, padding:"9px 11px", lineHeight:1.5,
            }}>{etError}</div>
          )}
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
          <div style={{ fontSize:13, color:theme.muted, marginBottom:2 }}>{album.album}</div>
          <h2 style={{ margin:"0 0 14px", fontSize:17, color:theme.text, fontWeight:800 }}>{activeSong}</h2>
          {album.cover && <div style={{textAlign:"center",marginBottom:14}}><img src={album.cover} alt={album.album} style={{width:180,maxWidth:"100%",borderRadius:10}} /></div>}
          <div>
            <div style={{ fontSize:13, color:theme.muted, marginBottom:6 }}>Your rating</div>
            <SongRatingInput value={songRatings[ratingKey(activeSong)]} onChange={val => setSongRating(activeSong, val)} theme={theme} />
          </div>
        </>
      )}

      {view === "tracks" && (
        <>
          <div style={{ fontSize:11, color:c, fontWeight:700, marginBottom:4 }}>{GENRES[album.genre]?.label}</div>
          <h2 style={{ margin:"0 0 2px", fontSize:18, color:theme.text, fontWeight:800 }}>{album.album}</h2>
          <div style={{ fontSize:12, color:theme.muted, marginBottom:14 }}>
            <span onClick={() => onOpenArtist(album.artist)} style={{ cursor:"pointer", textDecoration:"underline", textDecorationColor:"transparent" }}
              onMouseEnter={e => e.currentTarget.style.textDecorationColor = theme.muted}
              onMouseLeave={e => e.currentTarget.style.textDecorationColor = "transparent"}
            >{album.artist}</span> · {album.year}
          </div>
          {album.cover && <div style={{textAlign:"center",marginBottom:14}}><img src={album.cover} alt={album.album} style={{width:220,maxWidth:"100%",borderRadius:12}} /></div>}
          <CriticScoreBlock album={album} onSetCriticScore={onSetCriticScore} theme={theme} />
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
                const sr = songRatings[ratingKey(song)];
                const rc = ratingColor(sr);
                return (
                  <div key={i} onClick={() => openSong(song)} style={{
                    display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                    background:theme.card, borderRadius:8, cursor:"pointer",
                    border: sr != null ? `1px solid ${c}40` : `1px solid ${theme.border}`,
                  }}>
                    <span style={{ fontSize:13, color:theme.muted, width:20, textAlign:"right", flexShrink:0 }}>{i+1}</span>
                    <span style={{ flex:1, fontSize:13, color:theme.text }}>{song}</span>
                    {sr != null && (
                      <span style={{ fontSize:12, fontWeight:800, color:(rc.startsWith("linear-gradient")?"#ffffff":rc), textShadow:(rc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none"), background:(rc.startsWith("linear-gradient")?rc:rc+"22"), padding:"1px 6px", borderRadius:5 }}>
                        {sr.toFixed(1)}
                      </span>
                    )}
                    <span style={{ fontSize:13, color:theme.muted }}>›</span>
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

// ─── ARTIST DETAIL MODAL ─────────────────────────────────────────────────────
function ArtistDetailModal({ artist, listened, trackCache, songRatings, settings, theme, onClose, onOpenAlbum }) {
  const listenedAlbums = listened.filter(a => a.artist === artist);

  const effectiveRating = a => {
    if (settings.listenSort === "raw") {
      const songs = trackCache[a.artist + "||" + a.album] || [];
      const vals = songs.map(s => songRatings[a.artist + "||" + a.album + "||" + s]).filter(v => v != null);
      return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
    }
    return a.rating;
  };

  const sortedListened = [...listenedAlbums].sort((a, b) => {
    const ar = effectiveRating(a), br = effectiveRating(b);
    if (ar == null && br == null) return 0;
    if (ar == null) return 1;
    if (br == null) return -1;
    return br - ar;
  });

  const ratedVals = sortedListened.map(effectiveRating).filter(v => v != null);
  const artistAvg = ratedVals.length ? (ratedVals.reduce((x, y) => x + y, 0) / ratedVals.length) : null;
  const avgRc = ratingColor(artistAvg);

  const cover = listenedAlbums.find(a => a.cover)?.cover;

  const topSongs = Object.entries(songRatings)
    .filter(([k, r]) => r != null && k.startsWith(artist + "||"))
    .map(([key, rating]) => {
      const parts = key.split("||");
      return { key, album: parts[1], song: parts[2], rating };
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <Modal onClose={onClose} theme={theme} wide>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18, flexWrap:"wrap" }}>
        {cover && (
          <img src={cover} alt={artist} style={{ width:64, height:64, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
        )}
        <div style={{ flex:1, minWidth:120 }}>
          <h2 style={{ margin:"0 0 4px", fontSize:19, color:theme.text, fontWeight:800 }}>{artist}</h2>
          <div style={{ fontSize:12, color:theme.muted }}>
            {listenedAlbums.length} heard
          </div>
        </div>
        {artistAvg != null && (
          <div style={{
            minWidth:56, padding:"8px 12px", borderRadius:9, textAlign:"center", flexShrink:0,
            background:(avgRc.startsWith("linear-gradient")?avgRc:avgRc+"22"), border:`1px solid ${avgRc}55`,
            color:(avgRc.startsWith("linear-gradient")?"#ffffff":avgRc),
            textShadow:(avgRc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none"),
          }}>
            <div style={{ fontSize:18, fontWeight:800 }}>{artistAvg.toFixed(2)}</div>
            <div style={{ fontSize:9, opacity:0.85 }}>{settings.listenSort === "raw" ? "raw avg" : "avg rating"}</div>
          </div>
        )}
      </div>

      {sortedListened.length > 0 && (
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:12, color:theme.muted, marginBottom:8, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>
            Albums heard
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {sortedListened.map((a, i) => {
              const c = GENRES[a.genre]?.color || "#888";
              const rating = effectiveRating(a);
              const rc = ratingColor(rating);
              return (
                <div key={a.id} onClick={() => onOpenAlbum(a)} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"8px 10px", cursor:"pointer",
                  background:theme.card, borderRadius:8, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:20, textAlign:"right", fontSize:11, color: rating!=null ? theme.muted : theme.border, fontWeight:700, flexShrink:0 }}>
                    {rating != null ? i + 1 : "—"}
                  </div>
                  {a.cover && <img src={a.cover} alt={a.album} style={{ width:38, height:38, borderRadius:6, objectFit:"cover", flexShrink:0 }} />}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{a.album}</div>
                    <div style={{ fontSize:11, color:theme.muted }}>{a.year}</div>
                  </div>
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:c+"18", color:c, border:`1px solid ${c}30`, flexShrink:0 }}>
                    {GENRES[a.genre]?.label}
                  </div>
                  <div style={{
                    minWidth:36, padding:"3px 6px", borderRadius:6, textAlign:"center", flexShrink:0,
                    background:(rating!=null ? (rc.startsWith("linear-gradient")?rc:rc+"22") : theme.surface),
                    border:`1px solid ${rating!=null ? rc+"55" : theme.border}`,
                    color:(rating!=null ? (rc.startsWith("linear-gradient")?"#ffffff":rc) : theme.muted),
                    textShadow:(rating!=null && rc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none"),
                    fontSize:13, fontWeight:800,
                  }}>
                    {rating != null ? rating.toFixed(1) : "+"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {topSongs.length > 0 && (
        <div>
          <div style={{ fontSize:12, color:theme.muted, marginBottom:8, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>
            Top rated songs
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {topSongs.map((s, i) => {
              const rc = ratingColor(s.rating);
              return (
                <div key={s.key} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"7px 10px",
                  background:theme.card, borderRadius:8, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:16, textAlign:"right", fontSize:11, color:theme.muted, fontWeight:700, flexShrink:0 }}>{i + 1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{s.song}</div>
                    <div style={{ fontSize:11, color:theme.muted }}>{s.album}</div>
                  </div>
                  <div style={{
                    minWidth:36, padding:"3px 6px", borderRadius:6, textAlign:"center", flexShrink:0,
                    background:(rc.startsWith("linear-gradient")?rc:rc+"22"), border:`1px solid ${rc}55`,
                    color:(rc.startsWith("linear-gradient")?"#ffffff":rc),
                    textShadow:(rc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none"),
                    fontSize:13, fontWeight:800,
                  }}>
                    {s.rating.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sortedListened.length === 0 && (
        <div style={{ color:theme.muted, fontSize:13, textAlign:"center", padding:"20px 0" }}>No albums found for this artist.</div>
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
        <div style={{ fontSize:13, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Theme</div>
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
        <div style={{ fontSize:13, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Default tab</div>
        {[["heard","Rated & Ranked"],["top50","Song Leaderboard"],["stats","Stats"]].map(([k,l]) => (
          <label key={k} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
            <div style={{
              width:16, height:16, borderRadius:"50%", border:`2px solid ${settings.defaultTab===k ? theme.accent : theme.border}`,
              background: settings.defaultTab===k ? theme.accent : "transparent", flexShrink:0,
            }} onClick={() => set("defaultTab", k)} />
            <span style={{ fontSize:13, color:theme.text }}>{l}</span>
          </label>
        ))}
      </div><div>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Display</div>
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

async function getAlbumInfo(artist, album) {
  try {
    const q = encodeURIComponent(`${artist} ${album}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&entity=album&limit=1`
    );
    const data = await res.json();

    if (!data.results?.length) return { cover: null, tracks: [] };

    const result = data.results[0];
    const cover = result.artworkUrl100
      ? result.artworkUrl100.replace("100x100bb", "600x600bb")
      : null;

    let tracks = [];
    if (result.collectionId) {
      try {
        const lookupRes = await fetch(
          `https://itunes.apple.com/lookup?id=${result.collectionId}&entity=song`
        );
        const lookupData = await lookupRes.json();
        tracks = (lookupData.results || [])
          .filter(r => r.wrapperType === "track" && r.kind === "song")
          .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
          .map(r => r.trackName)
          .filter(Boolean);
      } catch (e) {
        console.error(e);
      }
    }

    return { cover, tracks };
  } catch (e) {
    console.error(e);
  }

  return { cover: null, tracks: [] };
}

// ─── STATS PAGE ──────────────────────────────────────────────────────────────
function StatBar({ label, value, max, color, theme, formatValue }) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
      <div style={{ width:110, fontSize:12, color:theme.muted, flexShrink:0, textAlign:"right",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</div>
      <div style={{ flex:1, height:16, background:theme.card, borderRadius:5, overflow:"hidden", border:`1px solid ${theme.border}` }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:5, transition:"width .4s" }} />
      </div>
      <div style={{ width:32, fontSize:12, color:theme.text, fontWeight:700, flexShrink:0 }}>{formatValue ? formatValue(value) : value}</div>
    </div>
  );
}

function StatCard({ label, value, sub, theme }) {
  return (
    <div style={{ flex:"1 1 120px", background:theme.card, border:`1px solid ${theme.border}`, borderRadius:10, padding:"14px 12px", textAlign:"center" }}>
      <div style={{ fontSize:22, fontWeight:800, color:theme.text }}>{value}</div>
      <div style={{ fontSize:11, color:theme.muted, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:theme.muted, marginTop:2, opacity:0.75 }}>{sub}</div>}
    </div>
  );
}

function SectionHeading({ children, theme }) {
  return (
    <div style={{ fontSize:12, color:theme.muted, marginBottom:10, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>
      {children}
    </div>
  );
}

function StatsPage({ listened, songRatings, trackCache, theme, isMobile }) {
  const ratedAlbums = listened.filter(a => a.rating != null);
  const avgAlbum = ratedAlbums.length ? ratedAlbums.reduce((s, a) => s + a.rating, 0) / ratedAlbums.length : null;

  const songRatingVals = Object.values(songRatings).filter(v => v != null);
  const avgSong = songRatingVals.length ? songRatingVals.reduce((s, v) => s + v, 0) / songRatingVals.length : null;

  const totalTracks = Object.values(trackCache).reduce((s, arr) => s + (arr ? arr.length : 0), 0);

  // genre breakdown (listened albums)
  const genreCounts = {};
  listened.forEach(a => { genreCounts[a.genre] = (genreCounts[a.genre] || 0) + 1; });
  const genreEntries = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const genreTotal = listened.length || 1;

  // conic-gradient donut
  let acc = 0;
  const gradientParts = genreEntries.map(([g, count]) => {
    const start = (acc / genreTotal) * 360;
    acc += count;
    const end = (acc / genreTotal) * 360;
    const color = GENRES[g]?.color || "#888";
    return `${color} ${start}deg ${end}deg`;
  });
  const donutStyle = genreEntries.length
    ? { background: `conic-gradient(${gradientParts.join(",")})` }
    : { background: theme.card };

  // rating distribution buckets 0-1 ... 9-10
  const buckets = Array.from({ length: 10 }, () => 0);
  ratedAlbums.forEach(a => {
    const idx = a.rating >= 10 ? 9 : Math.min(9, Math.floor(a.rating));
    buckets[idx]++;
  });
  const maxBucket = Math.max(...buckets, 1);

  // top artists by album count
  const artistCounts = {};
  listened.forEach(a => { artistCounts[a.artist] = (artistCounts[a.artist] || 0) + 1; });
  const topArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxArtist = Math.max(...topArtists.map(a => a[1]), 1);

  // albums by decade
  const decadeCounts = {};
  listened.forEach(a => {
    const d = Math.floor((a.year || 0) / 10) * 10;
    decadeCounts[d] = (decadeCounts[d] || 0) + 1;
  });
  const decadeEntries = Object.entries(decadeCounts).sort((a, b) => Number(a[0]) - Number(b[0]));
  const maxDecade = Math.max(...decadeEntries.map(d => d[1]), 1);

  return (
    <div style={{ padding:isMobile?"16px 12px":"16px 18px" }}>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:26 }}>
        <StatCard label="Albums rated" value={listened.length} theme={theme} />
        <StatCard label="Avg album rating" value={avgAlbum != null ? avgAlbum.toFixed(2) : "—"} theme={theme} />
        <StatCard label="Songs rated" value={songRatingVals.length} sub={totalTracks ? `of ${totalTracks} tracked` : null} theme={theme} />
        <StatCard label="Avg song rating" value={avgSong != null ? avgSong.toFixed(2) : "—"} theme={theme} />
        <StatCard label="Artists" value={Object.keys(artistCounts).length} theme={theme} />
      </div>

      {listened.length === 0 && (
        <div style={{ textAlign:"center", padding:"48px 0", color:theme.muted }}>
          <div style={{ fontSize:32, marginBottom:10 }}>📊</div>
          <div style={{ fontSize:14 }}>No stats yet</div>
          <div style={{ fontSize:12, marginTop:6 }}>Rate some albums and songs to see your stats here</div>
        </div>
      )}

      {genreEntries.length > 0 && (
        <div style={{ marginBottom:30 }}>
          <SectionHeading theme={theme}>Genre breakdown</SectionHeading>
          <div style={{ display:"flex", gap:22, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ width:130, height:130, borderRadius:"50%", flexShrink:0, ...donutStyle }} />
            <div style={{ flex:1, minWidth:180, display:"flex", flexDirection:"column", gap:6 }}>
              {genreEntries.slice(0, 8).map(([g, count]) => (
                <div key={g} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:GENRES[g]?.color || "#888", flexShrink:0 }} />
                  <span style={{ color:theme.text, flex:1 }}>{GENRES[g]?.label || g}</span>
                  <span style={{ color:theme.muted }}>{count} ({Math.round((count/genreTotal)*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {ratedAlbums.length > 0 && (
        <div style={{ marginBottom:30 }}>
          <SectionHeading theme={theme}>Rating distribution (albums)</SectionHeading>
          {buckets.map((count, i) => (
            <StatBar key={i} label={i === 9 ? "9 – 10" : `${i} – ${i + 1}`} value={count} max={maxBucket}
              color={ratingColor(i === 9 ? 10 : i + 0.5).startsWith("linear-gradient") ? "#f78fbf" : ratingColor(i + 0.5)}
              theme={theme} />
          ))}
        </div>
      )}

      {topArtists.length > 0 && (
        <div style={{ marginBottom:30 }}>
          <SectionHeading theme={theme}>Top artists (by albums rated)</SectionHeading>
          {topArtists.map(([artist, count]) => (
            <StatBar key={artist} label={artist} value={count} max={maxArtist} color={theme.accent} theme={theme} />
          ))}
        </div>
      )}

      {decadeEntries.length > 0 && (
        <div>
          <SectionHeading theme={theme}>Albums by decade</SectionHeading>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120, paddingBottom:4 }}>
            {decadeEntries.map(([decade, count]) => (
              <div key={decade} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:0 }}>
                <div style={{ fontSize:11, color:theme.text, fontWeight:700 }}>{count}</div>
                <div style={{
                  width:"100%", maxWidth:34,
                  height:`${Math.max((count / maxDecade) * 90, 4)}px`,
                  background:theme.accent, borderRadius:"4px 4px 0 0",
                }} />
                <div style={{ fontSize:10, color:theme.muted }}>{decade}s</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [settings, setSettings] = useState(() => loadLS(SK.settings, {
    theme: "midnight", defaultTab: "heard", listenSort: "rating", compactMode: false,
  }));
  const theme = THEMES[settings.theme] || THEMES.midnight;
  const isMobile = useIsMobile();
  const coverSize = isMobile ? 46 : 80;
  const rowGap = isMobile ? 6 : 9;

  // ── tab comes from the URL so it's linkable and back/forward works ──────
  const pathTab = location.pathname.replace(/^\/+/, "").split("/")[0];
  const tab = pathTab === "leaderboard" ? "top50" : pathTab === "stats" ? "stats" : "heard";
  const setTab = key => {
    const path = key === "top50" ? "/leaderboard" : key === "stats" ? "/stats" : "/rated";
    navigate(path);
  };

  // ── detail modals are driven by query params so they get their own link ─
  const detailAlbumId = searchParams.get("album");
  const detailArtistName = searchParams.get("artist");
  const detailSongKey = searchParams.get("song");

  const openAlbum = (album) => setSearchParams({ album: album.id });
  const openArtist = (name) => setSearchParams({ artist: name });
  const openSong = (song) => setSearchParams({ song: song.key || `${song.artist}||${song.album}||${song.song}` });
  const closeDetail = () => setSearchParams({});

  // redirect "/" (or any unknown path) to the configured default tab
  useEffect(() => {
    const known = ["rated", "leaderboard", "stats"];
    if (!known.includes(pathTab)) {
      const def = settings.defaultTab === "top50" ? "/leaderboard" : settings.defaultTab === "stats" ? "/stats" : "/rated";
      navigate(def, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathTab]);

  const [deletedListened, setDeletedListened] = useState(() => loadLS(SK.deletedListened, []));

  const [listened, setListened] = useState(() => mergeWithSeed(SEED_LISTENED, loadLS(SK.listened, null), loadLS(SK.deletedListened, [])));
  const [trackCache, setTrackCache] = useState(() => loadLS(SK.tracks, {}));
  const [songRatings, setSongRatings] = useState(() => loadLS(SK.songRatings, {}));
  const [albumOrder, setAlbumOrder] = useState(() => loadLS(SK.albumOrder, []));
  const [songOrder, setSongOrder]   = useState(() => loadLS(SK.songOrder, []));

  const [listenFilter, setListenFilter] = useState("all");
  const [searchHeard,setSearchHeard]=useState("");
  const [searchTop50,setSearchTop50]=useState("");
  const [top50Artist,setTop50Artist]=useState("all");
  const [top50Genre,setTop50Genre]=useState("all");
const [top50RatingRange,setTop50RatingRange]=useState("all");
  const [heardSort,setHeardSort]=useState(settings.listenSort==="rating"?"final":"default");
  const [editRatingId, setEditRatingId] = useState(null);
  const [editRatingVal, setEditRatingVal] = useState("");

  const [addModal, setAddModal]         = useState(null);
  const [editModal, setEditModal]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // derive the actual detail objects from the URL params each render
  const detailAlbum = detailAlbumId ? listened.find(a => a.id === detailAlbumId) || null : null;
  const detailArtist = detailArtistName || null;
  const detailSong = detailSongKey
    ? (() => {
        const parts = detailSongKey.split("||");
        return { key: detailSongKey, artist: parts[0], album: parts[1], song: parts[2] };
      })()
    : null;

  useEffect(() => { persist(SK.listened, listened); }, [listened]);
  useEffect(() => { persist(SK.albumOrder, albumOrder); }, [albumOrder]);
  useEffect(() => { persist(SK.songOrder, songOrder); }, [songOrder]);
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

    setListened(cloud.listened || []);
    setTrackCache(cloud.trackCache || {});
    setSongRatings(cloud.songRatings || {});
    setSettings(cloud.settings || settings);
    setAlbumOrder(cloud.albumOrder || []);
    setSongOrder(cloud.songOrder || []);
    setDeletedListened(cloud.deletedListened || []);
  }

  autoLoad();
}, []);

useEffect(() => {
  const timer = setTimeout(async () => {
    const payload = {
      listened,
      trackCache,
      songRatings,
      settings,
      albumOrder,
      songOrder,
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
  listened,
  trackCache,
  songRatings,
  settings,
  albumOrder,
  songOrder,
  deletedListened,
]);

  // ── helpers to check if an album has any song data ──────────────────────
  const albumHasData = (album) => {
    const cacheKey = `${album.artist}||${album.album}`;
    // album-level rating (listened tab)
    if (album.rating != null) return true;
    // any song ratings under this album
    const prefix = cacheKey + "||";
    return Object.keys(songRatings).some(k => k.startsWith(prefix) && songRatings[k] != null);
  };

  const buildDeleteWarning = (album) => {
    const cacheKey = `${album.artist}||${album.album}`;
    const prefix = cacheKey + "||";
    const ratedSongs = Object.keys(songRatings).filter(k => k.startsWith(prefix) && songRatings[k] != null).length;
    const parts = [];
    if (album.rating != null) parts.push(`album rating (${album.rating.toFixed(1)})`);
    if (ratedSongs > 0) parts.push(`${ratedSongs} song rating${ratedSongs > 1 ? "s" : ""}`);
    return parts.length > 0
      ? `⚠️ This will also delete: ${parts.join(", ")}. This can't be undone.`
      : null;
  };

  // case-insensitive duplicate check for albums, excluding the album's own id when editing
  const isDuplicateAlbum = (artist, album, excludeId) => listened.some(a =>
    a.id !== excludeId && normalize(a.artist) === normalize(artist) && normalize(a.album) === normalize(album)
  );

  const handleAdd = async (form) => {
  if (isDuplicateAlbum(form.artist, form.album)) return;
  const { cover: fetchedCover, tracks } = await getAlbumInfo(form.artist, form.album);
  const cover = form.cover?.trim() ? form.cover.trim() : fetchedCover;

  const entry = {
    ...form,
    id: uid(),
    year: parseInt(form.year) || new Date().getFullYear(),
    cover,
  };

  setListened(prev => [...prev, { ...entry, rating: null }]);

  if (tracks.length) {
    const cacheKey = `${form.artist}||${form.album}`;
    setTrackCache(prev => {
      const next = { ...prev, [cacheKey]: tracks };
      persist(SK.tracks, next);
      return next;
    });
  }

  setAddModal(null);
};

  const handleEdit = (form, id) => {
    if (isDuplicateAlbum(form.artist, form.album, id)) return;
    setListened(prev => prev.map(a => a.id===id ? {...a,...form,year:parseInt(form.year)} : a));
    setEditModal(null);
  };

  const setCriticScore = (id, score, source) => {
    setListened(prev => prev.map(a => a.id===id
      ? { ...a, criticScore: score, criticScoreSource: source, criticScoreChecked: true }
      : a
    ));
  };

  // PERMANENT delete — record ID in deletedListened so seed never re-adds it
  const handleDelete = (id) => {
    setListened(prev => prev.filter(a => a.id !== id));
    setDeletedListened(prev => prev.includes(id) ? prev : [...prev, id]);
    setDeleteConfirm(null);
  };

  const requestDelete = (album) => {
    const warning = buildDeleteWarning(album);
    setDeleteConfirm({ id: album.id, albumName: album.album, warning });
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
      const rawAvg = x => {
        const songs = trackCache[x.artist+"||"+x.album] || [];
        const vals = songs.map(s=>songRatings[x.artist+"||"+x.album+"||"+s]).filter(v=>v!=null);
        return vals.length ? vals.reduce((s,v)=>s+v,0)/vals.length : null;
      };
      if (s === "raw") {
        const ar = rawAvg(a), br = rawAvg(b);
        if (ar==null && br==null) return 0;
        if (ar==null) return 1;
        if (br==null) return -1;
        return br-ar;
      }
      if (a.rating==null && b.rating==null) return 0;
      if (a.rating==null) return 1;
      if (b.rating==null) return -1;
      return b.rating - a.rating;
    });
    if (s !== "rating") return base;
    const tagged = base.map(a => ({ ...a, __rating: a.rating }));
    return applyTieOrder(tagged, albumOrder, a => a.id);
  };

  let visibleListened = sortListened(listened.filter(a =>
    (listenFilter==="all" || a.genre===listenFilter) &&
    (`${a.artist} ${a.album}`.toLowerCase().includes(searchHeard.toLowerCase()))
  ));
  if(heardSort==="final") {
    visibleListened = sortListened(listened.filter(a =>
      (listenFilter==="all" || a.genre===listenFilter) &&
      (`${a.artist} ${a.album}`).toLowerCase().includes(searchHeard.toLowerCase())
    ));
  } else if(heardSort==="artist") {
    visibleListened=[...visibleListened].sort((a,b)=>a.artist.localeCompare(b.artist));
  } else {
    visibleListened = sortListened(listened.filter(a =>
      (listenFilter==="all" || a.genre===listenFilter) &&
      (`${a.artist} ${a.album}`.toLowerCase().includes(searchHeard.toLowerCase()))
    ));
  }

  const moveAlbumInTieGroup = (album, dir) => {
    if(settings.listenSort!=="rating") return;
    setAlbumOrder(prev => reorderWithinTieGroup(visibleListened, prev, a => a.id, album.id, dir));
  };

  const top50Base = Object.entries(songRatings)
    .filter(([,r]) => r != null)
    .map(([key, rating]) => {
      const parts = key.split("||");
      return { key, artist:parts[0], album:parts[1], song:parts[2], rating, __rating: rating };
    })
    .filter(s=>top50Artist==="all"||s.artist===top50Artist)
    .filter(s=>{const ao=listened.find(a=>a.artist===s.artist&&a.album===s.album); return top50Genre==="all" || ao?.genre===top50Genre;})
    .filter(s=> top50RatingRange==="all" ? true : (top50RatingRange==="9" ? s.rating>=9 : (s.rating>=Number(top50RatingRange) && s.rating<Number(top50RatingRange)+1)))
    .sort((a,b)=>b.rating-a.rating);
  const top50 = applyTieOrder(top50Base, songOrder, s => s.key);

  const moveSongInTieGroup = (song, dir) => {
    setSongOrder(prev => reorderWithinTieGroup(top50, prev, s => s.key, song.key, dir));
  };

  const ratedCount = listened.filter(a => a.rating!=null).length;
  const avg = ratedCount ? (listened.filter(a=>a.rating!=null).reduce((s,a)=>s+a.rating,0)/ratedCount).toFixed(1) : null;
  const compact = settings.compactMode;
  const pad = compact ? (isMobile ? "7px 8px" : "8px 11px") : (isMobile ? "9px 9px" : "11px 13px");

  return (
    <div style={{ minHeight:"100vh", background:theme.bg, color:theme.text, fontFamily:"system-ui,sans-serif", paddingBottom:60, maxWidth: isMobile ? "100%" : 980, margin:"0 auto" }}>

      {/* NAV */}
      <div style={{ background:theme.surface, borderBottom:`1px solid ${theme.border}`, padding:isMobile?"14px 12px 0":"16px 18px 0" }}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
          <h1 style={{ margin:0, fontSize:18, fontWeight:800, color:theme.text, letterSpacing:"-0.3px", flex:1 }}>🎧 My Albums</h1>
          <button onClick={() => setShowSettings(true)} style={{
            background:theme.card, border:`1px solid ${theme.border}`, color:theme.muted,
            borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:12,
          }}>⚙️ Settings</button>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[["heard","Rated & Ranked"],["top50","Song Leaderboard"],["stats","Stats"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding:isMobile?"7px 8px":"7px 14px", border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
              background:"transparent", color: tab===key ? theme.text : theme.muted,
              borderBottom: tab===key ? `2px solid ${theme.accent}` : "2px solid transparent",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ══ RATED & RANKED ═══════════════════════════════════════════════════ */}
      {tab === "heard" && (
        <>
          <div style={{ padding:isMobile?"12px 12px 10px":"12px 18px 10px", borderBottom:`1px solid ${theme.border}` }}>
            <div style={{ display:"flex", gap:14, marginBottom:10 }}>
              <span style={{ fontSize:12, color:theme.muted }}><span style={{ color:theme.text, fontWeight:700, fontSize:15 }}>{listened.length}</span> albums</span>
              <span style={{ fontSize:12, color:theme.muted }}><span style={{ color:theme.text, fontWeight:700, fontSize:15 }}>{ratedCount}</span> rated</span>
              {avg && <span style={{ fontSize:12, color:theme.muted }}>avg <span style={{ color:"#fbbf24", fontWeight:700, fontSize:15 }}>{avg}</span></span>}
            </div>
            <FilterBar items={listened} active={listenFilter} onSelect={setListenFilter} />
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <input placeholder="Search albums or artists..." value={searchHeard} onChange={e=>setSearchHeard(e.target.value)} style={{flex:"1 1 180px",minWidth:0,borderRadius:999,padding:"10px 14px",border:`1px solid ${theme.border}`,background:theme.surface,color:theme.text,fontSize:16}} />
            <select style={{flex:"1 1 130px",minWidth:0,padding:"10px 14px",borderRadius:999,background:theme.surface,color:theme.text,border:`1px solid ${theme.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:16}} value={settings.listenSort} onChange={e=>{setSettings(p=>{const n={...p, listenSort:e.target.value}; persist(SK.settings, n); return n;}); setHeardSort("default");}}><option value="rating">Final Rating</option><option value="raw">Raw Average</option></select><select style={{flex:"1 1 100px",minWidth:0,padding:"10px 14px",borderRadius:999,background:theme.surface,color:theme.text,border:`1px solid ${theme.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:16}} value={heardSort} onChange={e=>setHeardSort(e.target.value)}><option value="default">Sort</option><option value="artist">Artist</option></select>
            </div>
          </div>
          <div style={{ padding:isMobile?"10px 12px":"10px 18px", display:"flex", flexDirection:"column", gap:5 }}>
            <button onClick={() => setAddModal(true)} style={{
              padding:"9px", background:theme.surface, border:`1px dashed ${theme.border}`,
              borderRadius:9, color:theme.muted, cursor:"pointer", fontSize:12, textAlign:"left",
            }}>+ Add album</button>
            <p style={{ fontSize:11, color:theme.border, margin:"2px 0 4px" }}>
              Tap a rating to edit · tap title for tracklist
              {settings.listenSort==="rating" && " · ▲▼ reorders ties"}
            </p>
           {visibleListened.map((a, i) => {
  const c = GENRES[a.genre]?.color || "#888";
  const rawVals=(trackCache[a.artist+"||"+a.album]||[]).map(ss=>songRatings[a.artist+"||"+a.album+"||"+ss]).filter(v=>v!=null); const rawAvg=rawVals.length?rawVals.reduce((x,y)=>x+y,0)/rawVals.length:null; const rc = ratingColor(settings.listenSort==="raw"?rawAvg:a.rating);
  const isEditing = editRatingId === a.id;
  const prev = visibleListened[i-1];
  const next = visibleListened[i+1];
  const canUp   = settings.listenSort==="rating" && a.rating!=null && prev && prev.rating === a.rating;
  const canDown = settings.listenSort==="rating" && a.rating!=null && next && next.rating === a.rating;
  return (
    <div key={a.id} style={{
      display:"flex",
      alignItems:"center",
      gap:rowGap,
      padding:pad,
      background:theme.card,
      borderRadius:9,
      border:`1px solid ${theme.border}`,
    }}>
      <div style={{
        width:isMobile?16:22,
        textAlign:"right",
        fontSize:11,
        color:(settings.listenSort==="raw" ? rawAvg!=null : a.rating!=null) ? theme.muted : theme.border,
        flexShrink:0,
        fontWeight:700
      }}>
        {(settings.listenSort==="raw" ? rawAvg!=null : a.rating!=null) ? i+1 : "—"}
      </div>

      <ReorderArrows
        canUp={canUp}
        canDown={canDown}
        onUp={() => moveAlbumInTieGroup(a, -1)}
        onDown={() => moveAlbumInTieGroup(a, 1)}
        theme={theme}
      />

      {a.cover && (
        <img
          src={a.cover}
          alt={a.album}
          style={{
            width:coverSize,
            height:coverSize,
            borderRadius:8,
            objectFit:"cover",
            flexShrink:0,
          }}
        />
      )}

      <div
        onClick={() => openAlbum(a)}
        style={{ flex:1, minWidth:0, cursor:"pointer" }}
      >
        <div style={{
          fontSize:13,
          fontWeight:600,
          color:theme.text
        }}>
          {a.album}
        </div>

        {!compact && (
          <div style={{
            fontSize:11,
            color:theme.muted,
            marginTop:1
          }}>
            <span onClick={e => { e.stopPropagation(); openArtist(a.artist); }}
              style={{ cursor:"pointer", textDecoration:"underline", textDecorationColor:"transparent" }}
              onMouseEnter={e => e.currentTarget.style.textDecorationColor = theme.muted}
              onMouseLeave={e => e.currentTarget.style.textDecorationColor = "transparent"}
            >{a.artist}</span> · {a.year}
          </div>
        )}
      </div>

      <div style={{
        fontSize:10,
        padding:"2px 7px",
        borderRadius:8,
        background:c+"18",
        color:c,
        border:`1px solid ${c}30`,
        flexShrink:0
      }}>
        {GENRES[a.genre]?.label}
      </div>

      {isEditing ? (
        <input
          autoFocus
          value={editRatingVal}
          onChange={e => setEditRatingVal(e.target.value)}
          onBlur={() => commitRating(a.id)}
          onKeyDown={e => {
            if (e.key === "Enter") commitRating(a.id);
            if (e.key === "Escape") setEditRatingId(null);
          }}
          placeholder="0–10"
          style={{
            width:56,
            padding:"4px 5px",
            borderRadius:6,
            border:`1px solid ${rc}`,
            background:theme.bg,
            color:theme.text,
            fontSize:16,
            fontWeight:700,
            textAlign:"center",
            outline:"none"
          }}
        />
      ) : (
        <div
          onClick={() => {
            setEditRatingId(a.id);
            setEditRatingVal(a.rating!=null ? String(a.rating) : "");
          }}
          style={{
            minWidth:42,
            padding:"4px 7px",
            borderRadius:6,
            cursor:"pointer",
            background:a.rating!=null ? (rc.startsWith("linear-gradient")?rc:rc+"22") : theme.surface,
            border:`1px solid ${a.rating!=null ? (rc.startsWith("linear-gradient")?"#e9d5ff":rc+"55") : theme.border}`,
            color:a.rating!=null ? (rc.startsWith("linear-gradient")?"#ffffff":rc) : theme.muted,
            textShadow:a.rating!=null && rc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none",
            fontSize:13,
            fontWeight:800,
            textAlign:"center",
            flexShrink:0,
          }}
        >
          {settings.listenSort==="raw" ? (()=>{const songs=trackCache[a.artist+"||"+a.album]||[]; const vals=songs.map(s=>songRatings[a.artist+"||"+a.album+"||"+s]).filter(v=>v!=null); return vals.length? (vals.reduce((x,y)=>x+y,0)/vals.length).toFixed(2):"+";})() : (a.rating!=null ? a.rating.toFixed(1) : "+")}
        </div>
      )}

      <button
        onClick={() => setEditModal({album:a})}
        style={{
          background:"none",
          border:"none",
          color:theme.muted,
          cursor:"pointer",
          fontSize:13,
          padding:"0 2px"
        }}
      >
        ✏️
      </button>

      <button
        onClick={() => requestDelete(a)}
        style={{
          background:"none",
          border:"none",
          color:theme.muted,
          cursor:"pointer",
          fontSize:13,
          padding:"0 2px"
        }}
      >
        🗑️
      </button>
    </div>
  );
})}
          </div>
        </>
      )}
      {/* ══ SONG LEADERBOARD ═════════════════════════════════════════════════ */}
      {tab === "top50" && (
        <div style={{ padding:isMobile?"16px 12px":"16px 18px" }}><input placeholder="Search songs, albums, artists..." value={searchTop50} onChange={e=>setSearchTop50(e.target.value)} style={{marginBottom:10,width:"100%",borderRadius:999,padding:"10px 14px",border:`1px solid ${theme.border}`,background:theme.surface,color:theme.text,fontSize:16}} />
<div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
<select style={{flex:"1 1 130px",minWidth:0,padding:"10px 14px",borderRadius:999,background:theme.surface,color:theme.text,border:`1px solid ${theme.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:16}} value={top50Artist} onChange={e=>setTop50Artist(e.target.value)}><option value="all">All Artists</option>{[...new Set(top50.map(s=>s.artist))].sort().map(a=><option key={a} value={a}>{a}</option>)}</select>
<select style={{flex:"1 1 130px",minWidth:0,padding:"10px 14px",borderRadius:999,background:theme.surface,color:theme.text,border:`1px solid ${theme.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:16}} value={top50Genre} onChange={e=>setTop50Genre(e.target.value)}><option value="all">All Genres</option>{GENRE_KEYS.map(g=><option key={g} value={g}>{GENRES[g].label}</option>)}</select>
<select style={{flex:"1 1 130px",minWidth:0,padding:"10px 14px",borderRadius:999,background:theme.surface,color:theme.text,border:`1px solid ${theme.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:16}} value={top50RatingRange} onChange={e=>setTop50RatingRange(e.target.value)}>
<option value="all">All Ratings</option>
{Array.from({length:10},(_,i)=><option key={i} value={i}>{i===9?"9-10":`${i}-${i}.9`}</option>)}
</select>
</div>
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
            {top50.filter(s=>{
const searchOk=`${s.song} ${s.artist} ${s.album}`.toLowerCase().includes(searchTop50.toLowerCase());
const artistOk=top50Artist==="all"||s.artist===top50Artist;
const genreOk=top50Genre==="all"||(listened.find(a=>a.artist===s.artist&&a.album===s.album)?.genre===top50Genre);
const ratingOk=top50RatingRange==="all"||(top50RatingRange==="9"?s.rating>=9:(s.rating>=Number(top50RatingRange)&&s.rating<Number(top50RatingRange)+1));
return searchOk&&artistOk&&genreOk&&ratingOk;
})
.map((s, i) => {
              const rc = ratingColor(s.rating);
              const albumObj = listened.find(a => a.artist===s.artist && a.album===s.album);
              const c = albumObj ? GENRES[albumObj.genre]?.color || "#888" : "#888";
              const prevS = top50[i-1];
              const nextS = top50[i+1];
              const canUp   = prevS && prevS.rating === s.rating;
              const canDown = nextS && nextS.rating === s.rating;
              return (
                <div key={s.key} style={{
                  display:"flex", alignItems:"center", gap:isMobile?6:10, padding:pad,
                  background:theme.card, borderRadius:9, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:isMobile?20:26, textAlign:"right", fontSize:i<3?16:12,
                    color: i===0?"#fbbf24":i===1?"#94a3b8":i===2?"#b45309":theme.muted,
                    fontWeight:800, flexShrink:0 }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                  </div>
                  <ReorderArrows canUp={canUp} canDown={canDown}
  onUp={() => moveSongInTieGroup(s, -1)}
  onDown={() => moveSongInTieGroup(s, 1)}
  theme={theme} />

{albumObj?.cover && (
  <img
    src={albumObj.cover}
    alt={s.album}
    style={{
      width:coverSize,
      height:coverSize,
      borderRadius:8,
      objectFit:"cover",
      flexShrink:0,
    }}
  />
)}

<div onClick={() => openSong(s)} style={{
  flex:1,
  minWidth:0,
  cursor:"pointer",
  display:"flex",
  alignItems:"center",
  gap:6
}}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:theme.text }}>{s.song}</div>
                      <div style={{ fontSize:13, color:theme.muted, marginTop:1 }}>
                        <span onClick={e => { e.stopPropagation(); openArtist(s.artist); }}
                          style={{ cursor:"pointer", textDecoration:"underline", textDecorationColor:"transparent" }}
                          onMouseEnter={e => e.currentTarget.style.textDecorationColor = theme.muted}
                          onMouseLeave={e => e.currentTarget.style.textDecorationColor = "transparent"}
                        >{s.artist}</span> · {s.album}
                      </div>
                    </div>
                  </div>
                  {albumObj && (
                    <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:c+"18", color:c, border:`1px solid ${c}30`, flexShrink:0 }}>
                      {GENRES[albumObj.genre]?.label}
                    </div>
                  )}
                  <div onClick={() => openSong(s)} style={{ minWidth:40, padding:"4px 7px", borderRadius:6, cursor:"pointer",
                    background:(rc.startsWith("linear-gradient")?rc:rc+"22"), border:`1px solid ${rc}55`, color:(rc.startsWith("linear-gradient")?"#ffffff":rc), textShadow:(rc.startsWith("linear-gradient")?"0 1px 2px rgba(0,0,0,.7),0 0 4px rgba(0,0,0,.35)":"none"),
                    fontSize:14, fontWeight:800, textAlign:"center", flexShrink:0 }}>
                    {s.rating.toFixed(1)}
                  </div>
                  <span onClick={() => openSong(s)} style={{ fontSize:13, color:theme.muted, cursor:"pointer", flexShrink:0 }}>›</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ STATS ════════════════════════════════════════════════════════════ */}
      {tab === "stats" && (
        <StatsPage listened={listened} songRatings={songRatings} trackCache={trackCache} theme={theme} isMobile={isMobile} />
      )}

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}
      {detailAlbum && (<>
<div>{detailAlbum?.cover && <img src={detailAlbum.cover} alt="" style={{maxWidth:220,borderRadius:12,display:"block",margin:"0 auto 12px"}} />}</div>
        <AlbumDetailModal
          album={detailAlbum} onClose={closeDetail}
          trackCache={trackCache} setTrackCache={setTrackCache}
          songRatings={songRatings} setSongRatings={setSongRatings}
          theme={theme}
          onOpenArtist={name => openArtist(name)}
          onSetCriticScore={setCriticScore}
        />
      </>) }
      {!detailAlbum && detailSong && (<>
        <SongDetailModal
          song={detailSong} onClose={closeDetail}
          songRatings={songRatings} setSongRatings={setSongRatings}
          theme={theme}
          onOpenArtist={name => openArtist(name)}
        />
      </>)}
      {!detailAlbum && !detailSong && detailArtist && (
        <ArtistDetailModal
          artist={detailArtist} onClose={closeDetail}
          listened={listened}
          trackCache={trackCache} songRatings={songRatings}
          settings={settings} theme={theme}
          onOpenAlbum={(album) => openAlbum(album)}
        />
      )}
      {addModal && (
        <AlbumFormModal mode="add" onSave={form => handleAdd(form)}
          isDuplicate={(artist, album) => isDuplicateAlbum(artist, album)}
          onClose={() => setAddModal(null)} theme={theme} />
      )}
      {editModal && (
        <AlbumFormModal mode="edit" initial={editModal.album}
          onSave={form => handleEdit(form, editModal.album.id)}
          isDuplicate={(artist, album) => isDuplicateAlbum(artist, album, editModal.album.id)}
          onClose={() => setEditModal(null)} theme={theme} />
      )}
      {deleteConfirm && (
        <ConfirmModal
          message={`Delete "${deleteConfirm.albumName}"?`}
          subMessage={deleteConfirm.warning}
          onConfirm={() => handleDelete(deleteConfirm.id)}
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