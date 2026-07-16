import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "./supabase";
import { SEED_LISTENED } from "./seedData";
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
  // cover art URLs for songs added directly (singles, or albums not yet
  // added as a full album entry) — keyed the same way as trackCache,
  // "artist||album", so a manually-added song's row has art instead of
  // an empty gap next to songs that came from a real album.
  songCovers: "songcovers-v1",
  // store set of IDs permanently deleted by the user
  deletedListened: "deleted-listened-v1",
  // timestamp (ms) of the last LOCAL edit, used to decide whether an
  // incoming cloud snapshot is actually newer than what's on this device
  // before overwriting anything with it — see the sync effect below.
  updatedAt: "data-updated-at-v1",
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

// Returns the [start, end] index range (inclusive) of the run of items
// sharing sorted[idx]'s rating.
function tieGroupBounds(sorted, idx) {
  const rating = sorted[idx].__rating;
  let start = idx;
  while (start > 0 && sorted[start - 1].__rating === rating) start--;
  let end = idx;
  while (end < sorted.length - 1 && sorted[end + 1].__rating === rating) end++;
  return [start, end];
}

// Whether this item shares its rating with at least one neighbor, i.e.
// whether reordering is possible at all.
function hasTieGroup(sorted, idx) {
  if (idx < 0 || idx >= sorted.length || sorted[idx].__rating == null) return false;
  const [start, end] = tieGroupBounds(sorted, idx);
  return end > start;
}

function reorderWithinTieGroup(sorted, order, keyOf, key, dir) {
  const idx = sorted.findIndex(item => keyOf(item) === key);
  if (idx < 0) return order;
  const [start, end] = tieGroupBounds(sorted, idx);
  if (start === end) return order; // not tied with anything, nothing to do

  const newOrderKeys = sorted.map(keyOf);
  const swapIdx = idx + dir;

  if (swapIdx >= start && swapIdx <= end) {
    // Still inside the tie group — plain adjacent swap, so repeated clicks
    // walk the item through the tied entries one at a time (10 -> 11 -> 12...).
    const a = newOrderKeys[idx], b = newOrderKeys[swapIdx];
    newOrderKeys[idx] = b; newOrderKeys[swapIdx] = a;
    return newOrderKeys;
  }

  // Hit the edge of the tie group (no more tied entries in this direction)
  // — wrap around to the opposite end of the group instead of doing nothing,
  // so an item pushed all the way down cycles back to where it started.
  const [item] = newOrderKeys.splice(idx, 1);
  const insertAt = dir > 0 ? start : end;
  newOrderKeys.splice(insertAt, 0, item);
  return newOrderKeys;
}

// Reorders `key` within the subset of `fullSorted` matched by `scopeFilter`
// (e.g. one artist's albums/songs), so tie-groups are local to that subset,
// then merges the result back into the full ordering — every id outside the
// scope keeps its exact existing position. Used by the artist page so ties
// cascade/wrap through just that artist's own entries rather than the
// whole app-wide list.
function reorderScoped(fullSorted, keyOf, scopeFilter, key, dir) {
  const scoped = fullSorted.filter(scopeFilter);
  const newScopedKeys = reorderWithinTieGroup(scoped, scoped.map(keyOf), keyOf, key, dir);
  const scopedKeySet = new Set(scoped.map(keyOf));
  let si = 0;
  return fullSorted.map(keyOf).map(k => scopedKeySet.has(k) ? newScopedKeys[si++] : k);
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

// ─── ALBUM SEARCH PICKER ─────────────────────────────────────────────────────
// Lets the person confirm exactly which release they mean instead of the
// app silently guessing — this is the fix for "Yeezus becomes Ye" /
// "Overly Dedicated becomes DAMN. Collector's Edition"-type mismatches.
// Editions of the same album (Deluxe, Collector's Edition, Remastered, ...)
// show up as separate, clearly-labeled cards.
function AlbumSearchPicker({ artist, album, theme, selectedId, onPick }) {
  const [results, setResults] = useState(null); // null = not searched yet
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(null); // id currently fetching its tracklist

  const doSearch = useCallback(async () => {
    const a = artist.trim(), al = album.trim();
    if (!a && !al) { setResults([]); return; }
    setLoading(true);
    const candidates = await searchAlbumCandidates(a, al, 8);
    setResults(candidates);
    setLoading(false);
  }, [artist, album]);

  // Auto-search once both fields have something, debounced so it doesn't
  // fire on every keystroke.
  useEffect(() => {
    const a = artist.trim(), al = album.trim();
    if (!a || !al) { setResults(null); return; }
    const t = setTimeout(() => { doSearch(); }, 550);
    return () => clearTimeout(t);
  }, [artist, album, doSearch]);

  const pick = async (candidate) => {
    setPicking(candidate.id);
    const tracks = candidate.source === "musicbrainz"
      ? await fetchTracklistForMBReleaseGroup(candidate.id)
      : await fetchTracklistForCollection(candidate.id);
    setPicking(null);
    onPick({
      id: candidate.id,
      source: candidate.source,
      cover: candidate.cover,
      tracks,
      matchedArtist: candidate.artist,
      matchedAlbum: candidate.album,
    });
  };

  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
        <div style={{ fontSize:13, color:theme.muted }}>Find the exact release</div>
        <button type="button" onClick={doSearch} disabled={loading} style={{
          background:"none", border:`1px solid ${theme.border}`, borderRadius:6,
          color:theme.muted, cursor:loading?"default":"pointer", fontSize:11, padding:"3px 9px",
        }}>{loading ? "Searching…" : "🔍 Search"}</button>
      </div>

      {loading && (
        <div style={{ fontSize:12, color:theme.muted, padding:"10px 0" }}>Searching…</div>
      )}

      {!loading && results && results.length === 0 && (
        <div style={{ fontSize:12, color:theme.muted, padding:"8px 0" }}>
          No matches found anywhere we checked — that's fine, it may just not be catalogued digitally.
          Enter a cover URL below and add the tracklist manually after saving.
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:260, overflowY:"auto", paddingRight:2 }}>
          {results.map(c => {
            const isSelected = selectedId === c.id;
            const isPicking = picking === c.id;
            return (
              <div key={`${c.source}:${c.id}`} onClick={() => !picking && pick(c)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"7px 9px",
                background: isSelected ? theme.accent+"1a" : theme.card,
                border:`1px solid ${isSelected ? theme.accent : theme.border}`,
                borderRadius:9, cursor: picking ? "default" : "pointer",
                opacity: picking && !isPicking ? 0.5 : 1,
              }}>
                {c.cover
                  ? <img src={c.cover} alt="" onError={e => { e.currentTarget.style.display = "none"; }}
                      style={{ width:40, height:40, borderRadius:6, objectFit:"cover", flexShrink:0, background:theme.surface }} />
                  : <div style={{ width:40, height:40, borderRadius:6, background:theme.surface, flexShrink:0 }} />}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:theme.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {c.album}
                  </div>
                  <div style={{ fontSize:11, color:theme.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {c.artist}{c.year ? ` · ${c.year}` : ""}{c.trackCount ? ` · ${c.trackCount} tracks` : ""}
                  </div>
                </div>
                {c.source === "musicbrainz" && (
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:theme.surface, color:theme.muted, border:`1px solid ${theme.border}`, flexShrink:0 }}>
                    MusicBrainz
                  </div>
                )}
                {c.edition && (
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:theme.surface, color:theme.muted, border:`1px solid ${theme.border}`, flexShrink:0 }}>
                    {c.edition}
                  </div>
                )}
                {!c.edition && c.confident && (
                  <div style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:"#22c55e18", color:"#22c55e", border:"1px solid #22c55e30", flexShrink:0 }}>
                    Standard
                  </div>
                )}
                <div style={{ fontSize:16, flexShrink:0, width:16, textAlign:"center" }}>
                  {isPicking ? "⏳" : isSelected ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ALBUM FORM ──────────────────────────────────────────────────────────────
function AlbumFormModal({ initial, onSave, onClose, mode, theme, isDuplicate }) {
  const [form, setForm] = useState(initial || { artist:"", album:"", year: new Date().getFullYear(), genre:"hiphop", cover:"" });
  const [saving, setSaving] = useState(false);
  const [dupError, setDupError] = useState(null);
  // The exact release the person confirmed via search, if any. When set,
  // this is used as-is (cover + full tracklist) instead of re-guessing.
  const [matched, setMatched] = useState(null);
  const set = (k, v) => {
    setForm(p => ({...p, [k]: v}));
    setDupError(null);
    if (k === "artist" || k === "album") setMatched(null); // stale once the search terms change
  };
  const submit = async () => {
    const artist = form.artist.trim();
    const album = form.album.trim();
    if (!artist || !album) return;
    if (isDuplicate && isDuplicate(artist, album)) {
      setDupError(`You already have "${album}" by ${artist} saved. Duplicate albums (case-insensitive) aren't allowed.`);
      return;
    }
    setSaving(true);
    const payload = {
      ...form, artist, album,
      cover: form.cover?.trim() || matched?.cover || "",
    };
    if (mode !== "edit") {
      payload.tracks = matched?.tracks || null; // null = let the caller do its own best-effort lookup
    }
    await onSave(payload);
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

      {mode !== "edit" && (
        <AlbumSearchPicker
          artist={form.artist} album={form.album} theme={theme}
          selectedId={matched?.id}
          onPick={m => setMatched(m)}
        />
      )}

      {matched && (
        <div style={{
          display:"flex", alignItems:"center", gap:8, marginBottom:12, fontSize:11,
          color:"#22c55e", background:"#22c55e14", border:"1px solid #22c55e30",
          borderRadius:8, padding:"7px 10px",
        }}>
          ✓ Using "{matched.matchedAlbum}" by {matched.matchedArtist} — {matched.tracks.length} track{matched.tracks.length!==1?"s":""} + cover art will be saved.
        </div>
      )}

      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Cover URL {matched ? "(overrides the picked cover)" : "(optional)"}</div>
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
      {mode !== "edit" && !matched && (
        <div style={{ fontSize:11, color:theme.muted, marginBottom:14 }}>
          Didn't pick a release above? We'll try a best-effort automatic lookup, but only if we're confident
          it's the right album — otherwise it's saved with no cover/tracklist and you can add them by hand.
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
        {saving ? "Saving…" : (mode === "edit" ? "Save changes" : "Add album")}
      </button>
    </Modal>
  );
}

// ─── ADD SONG (from the leaderboard) ────────────────────────────────────────
function AddSongModal({ onClose, onSave, theme, existingKeys }) {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [type, setType] = useState("single"); // "single" | "album"
  const [album, setAlbum] = useState("");
  const [rating, setRating] = useState("");
  const [cover, setCover] = useState("");
  const [error, setError] = useState(null);

  const inputStyle = {
    width:"100%", background:theme.card, border:`1px solid ${theme.border}`,
    borderRadius:7, padding:"8px 10px", color:theme.text, fontSize:16,
    outline:"none", boxSizing:"border-box",
  };

  const submit = () => {
    const s = song.trim(), a = artist.trim();
    if (!s || !a) { setError("Enter both a song title and an artist."); return; }
    const al = type === "album" ? album.trim() : s;
    if (type === "album" && !al) { setError("Enter the album title, or switch to Single."); return; }
    const num = parseFloat(rating);
    if (isNaN(num) || num < 0 || num > 10) { setError("Enter a rating from 0–10."); return; }

    const isDupe = existingKeys.some(k => {
      const parts = k.split("||");
      if (parts.length !== 3) return false;
      const [ka, kal, ks] = parts;
      return normalize(ka) === normalize(a) && normalize(kal) === normalize(al) && normalize(ks) === normalize(s);
    });
    if (isDupe) { setError("You already have a rating for this song — open it from the leaderboard to edit it instead."); return; }

    onSave({ artist: a, album: al, song: s, rating: Math.round(num * 10) / 10, cover: cover.trim() });
  };

  return (
    <Modal onClose={onClose} theme={theme}>
      <h2 style={{ margin:"0 0 18px", fontSize:16, color:theme.text, fontWeight:700 }}>+ Add song</h2>

      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Song title</div>
        <input value={song} onChange={e => { setSong(e.target.value); setError(null); }} style={inputStyle} />
      </div>

      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Artist</div>
        <input value={artist} onChange={e => { setArtist(e.target.value); setError(null); }} style={inputStyle} />
      </div>

      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:6 }}>Is this a single, or is it on an album?</div>
        <div style={{ display:"flex", gap:8 }}>
          <button type="button" onClick={() => setType("single")} style={{
            flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13,
            background: type === "single" ? theme.accent : theme.card,
            color: type === "single" ? "#fff" : theme.text,
            border:`1px solid ${type === "single" ? theme.accent : theme.border}`,
          }}>Single</button>
          <button type="button" onClick={() => setType("album")} style={{
            flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13,
            background: type === "album" ? theme.accent : theme.card,
            color: type === "album" ? "#fff" : theme.text,
            border:`1px solid ${type === "album" ? theme.accent : theme.border}`,
          }}>On an album</button>
        </div>
      </div>

      {type === "album" && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Album title</div>
          <input value={album} onChange={e => { setAlbum(e.target.value); setError(null); }}
            placeholder="e.g. Renaissance" style={inputStyle} />
          <p style={{ fontSize:11, color:theme.muted, margin:"6px 0 0", lineHeight:1.5 }}>
            If you add this album later under the same artist &amp; title, this rating will be picked up
            automatically instead of creating a duplicate.
          </p>
        </div>
      )}

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:6 }}>Your rating</div>
        <input type="number" min="0" max="10" step="0.1" value={rating}
          onChange={e => { setRating(e.target.value); setError(null); }}
          placeholder="0–10" style={inputStyle} />
      </div>

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:4 }}>Cover URL (optional)</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {cover.trim() && (
            <img src={cover.trim()} alt="" onError={e => { e.currentTarget.style.display = "none"; }}
              style={{ width:38, height:38, borderRadius:6, objectFit:"cover", flexShrink:0, background:theme.surface }} />
          )}
          <input value={cover} onChange={e => setCover(e.target.value)}
            placeholder="https://…" style={inputStyle} />
        </div>
        <p style={{ fontSize:11, color:theme.muted, margin:"6px 0 0", lineHeight:1.5 }}>
          Adds a bit of art so this song doesn't look out of place next to songs from an album.
        </p>
      </div>

      {error && (
        <div style={{
          color:"#f87171", fontSize:12, margin:"0 0 14px",
          background:"#f8717118", border:"1px solid #f8717133",
          borderRadius:8, padding:"10px 12px", lineHeight:1.5,
        }}>{error}</div>
      )}

      <button onClick={submit} style={{
        width:"100%", padding:"10px", background:theme.accent, border:"none",
        borderRadius:8, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
      }}>Add song</button>
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
    setSongRatings(prev => ({ ...prev, [noteKey]: rating }));
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
async function fetchCriticScore(artist, album, { debug = false } = {}) {
  try {
    const url = `/api/critic-score?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}${debug ? "&debug=true" : ""}`;
    const r = await fetch(url);
    const data = await r.json();
    return { score: data?.criticScore ?? null, debug: data?.debug ?? null, error: data?.error ?? null };
  } catch (err) {
    return { score: null, debug: null, error: String(err) };
  }
}

// Turns the raw debug trace from api/critic-score.js into a short, readable
// summary so a "no score found" case can be understood without opening
// devtools — e.g. "AOTY has it listed under a different title" vs "AOTY
// genuinely has nothing for this one" vs "the lookup service itself failed".
function summarizeCriticDebug(trace, error) {
  if (error) return `The lookup itself failed: ${error}`;
  if (!trace) return "No diagnostic info came back with this response.";
  const lines = [];
  (trace.bases || []).forEach(b => {
    const body = b.body;
    let list = [];
    if (body && typeof body === "object") {
      list = Array.isArray(body.albums) ? body.albums : Array.isArray(body.results) ? body.results : Array.isArray(body) ? body : [];
    }
    const sample = list.slice(0, 3).map(c => `"${c.title || "?"}" by ${c.artist || "?"}`).join("; ");
    lines.push(`${b.base} → HTTP ${b.status}${b.ok ? "" : " (not ok)"}, ${list.length} result(s)${sample ? ": " + sample : ""}`);
  });
  if (trace.matchedCandidate) {
    lines.push(`Best match accepted: "${trace.matchedCandidate.title}" by ${trace.matchedCandidate.artist}`);
  } else {
    lines.push("None of the results were a close enough artist+title match, so nothing was accepted.");
  }
  return lines.join("\n");
}

function CriticScoreBlock({ album, onSetCriticScore, theme, showDebugTools }) {
  const [fetching, setFetching] = useState(album.criticScore == null);
  const [editing, setEditing] = useState(false);
  const [manualVal, setManualVal] = useState("");
  const [manualError, setManualError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Only search AOTY if we don't already have a score (manual or found).
    if (album.criticScore != null) { setFetching(false); return; }
    let cancelled = false;
    setFetching(true);
    setShowDebug(false);
    fetchCriticScore(album.artist, album.album, { debug: true })
      .then(({ score, debug, error }) => {
        if (cancelled) return;
        onSetCriticScore(album.id, score, score != null ? "aoty" : null);
        setDebugInfo(summarizeCriticDebug(debug, error));
      })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album.id, album.criticScore]);

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

      {fetching && (
        <span style={{ fontSize:12, color:theme.muted }}>Checking AOTY…</span>
      )}

      {!fetching && album.criticScore == null && !editing && (
        <div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:theme.muted }}>No critic score found.</span>
            <button onClick={() => { setManualVal(""); setEditing(true); }} style={{
              background:"none", border:`1px solid ${theme.border}`, borderRadius:6,
              color:theme.text, cursor:"pointer", fontSize:11, padding:"3px 8px",
            }}>+ Enter manually</button>
            {debugInfo && showDebugTools && (
              <button onClick={() => setShowDebug(s => !s)} style={{
                background:"none", border:"none", color:theme.muted, textDecoration:"underline",
                cursor:"pointer", fontSize:11, padding:0,
              }}>{showDebug ? "hide details" : "why?"}</button>
            )}
          </div>
          {showDebug && debugInfo && (
            <pre style={{
              fontSize:10, color:theme.muted, marginTop:8, whiteSpace:"pre-wrap",
              wordBreak:"break-word", fontFamily:"monospace", lineHeight:1.5,
            }}>{debugInfo}</pre>
          )}
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
                ({album.criticScore}/100)
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

function AlbumDetailModal({ album, onClose, trackCache, setTrackCache, songRatings, setSongRatings, theme, onOpenArtist, onSetCriticScore, showDebugTools, onUpdateAlbum }) {
  const cacheKey = `${album.artist}||${album.album}`;
  const tracks = trackCache[cacheKey];
  const [loading, setLoading] = useState(!tracks);
  const [error, setError] = useState(null);
  const [view, setView] = useState("tracks");
  const [activeSong, setActiveSong] = useState(null);
  const [editTracks, setEditTracks] = useState(null);
  const [etError, setEtError] = useState(null);
  const [fixMatch, setFixMatch] = useState(null); // picked candidate awaiting confirmation

  useEffect(() => {
  if (!tracks) {
    setTrackCache(prev => ({ ...prev, [cacheKey]: [] }));
  }

  setLoading(false);
}, []);

  // "Fix cover & tracklist": replaces this album's cover art and tracklist
  // with a specific release the person picks — for correcting existing
  // entries that got matched to the wrong album/edition before this fix,
  // or for swapping to a different edition later.
  const applyFix = () => {
    if (!fixMatch) return;
    onUpdateAlbum(album.id, { cover: fixMatch.cover || album.cover });
    setTrackCache(prev => ({ ...prev, [cacheKey]: fixMatch.tracks }));
    setFixMatch(null);
    setView("tracks");
  };

  const ratingKey = s => `${cacheKey}||${s}`;

  const openSong = (song) => { setActiveSong(song); setView("song"); };

  const setSongRating = (song, val) => {
    const num = parseFloat(val);
    const rating = (!isNaN(num) && num >= 0 && num <= 10) ? Math.round(num * 10) / 10 : null;
    setSongRatings(prev => ({ ...prev, [ratingKey(song)]: rating }));
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

    // If a track's name matches an existing rating under a differently
    // typed/cased key for this same album, carry that score over to the
    // exact key we're about to save instead of leaving a duplicate/orphan.
    const prefix = cacheKey + "||";
    const existingByNorm = {};
    Object.keys(songRatings).forEach(k => {
      if (!k.startsWith(prefix)) return;
      existingByNorm[normalize(k.slice(prefix.length))] = k;
    });
    const nextRatings = { ...songRatings };
    let ratingsChanged = false;
    list.forEach(title => {
      const exactKey = ratingKey(title);
      const matchKey = existingByNorm[normalize(title)];
      if (matchKey && matchKey !== exactKey && nextRatings[exactKey] == null) {
        nextRatings[exactKey] = nextRatings[matchKey];
        delete nextRatings[matchKey];
        ratingsChanged = true;
      }
    });
    if (ratingsChanged) setSongRatings(nextRatings);

    setTrackCache(prev => ({ ...prev, [cacheKey]: list }));
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

      {view === "fix" && (
        <>
          <button onClick={() => { setFixMatch(null); setView("tracks"); }} style={{ background:"none", border:"none", color:theme.muted, cursor:"pointer", fontSize:13, padding:"0 0 10px", display:"flex", alignItems:"center", gap:4 }}>
            ← back without changing
          </button>
          <h3 style={{ margin:"0 0 2px", color:theme.text, fontSize:15 }}>Fix cover & tracklist</h3>
          <p style={{ margin:"0 0 12px", fontSize:12, color:theme.muted }}>
            Search for the release this album should actually be linked to, then pick it. This replaces the current
            cover art and tracklist — any existing song ratings stay attached by title.
          </p>
          <AlbumSearchPicker
            artist={album.artist} album={album.album} theme={theme}
            selectedId={fixMatch?.id}
            onPick={m => setFixMatch({ ...m, cover: m.cover, tracks: m.tracks })}
          />
          {fixMatch && (
            <div style={{
              display:"flex", alignItems:"center", gap:8, marginBottom:12, fontSize:11,
              color:"#22c55e", background:"#22c55e14", border:"1px solid #22c55e30",
              borderRadius:8, padding:"7px 10px",
            }}>
              ✓ "{fixMatch.matchedAlbum}" by {fixMatch.matchedArtist} — {fixMatch.tracks.length} track{fixMatch.tracks.length!==1?"s":""}
            </div>
          )}
          <button onClick={applyFix} disabled={!fixMatch} style={{
            width:"100%", padding:"9px", background:theme.accent,
            border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13,
            cursor: fixMatch ? "pointer" : "default", opacity: fixMatch ? 1 : 0.5,
          }}>Apply this release</button>
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
          <CriticScoreBlock album={album} onSetCriticScore={onSetCriticScore} theme={theme} showDebugTools={showDebugTools} />
          {loading && <div style={{ color:theme.muted, fontSize:13, textAlign:"center", padding:"24px 0" }}>Loading tracklist…</div>}
          {error   && <div style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{error}</div>}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:6, marginBottom:8 }}>
            <button onClick={() => setView("fix")} style={{
              padding:"4px 10px", background:theme.card, border:`1px solid ${theme.border}`,
              borderRadius:6, color:theme.muted, cursor:"pointer", fontSize:11,
            }}>🔁 Fix cover/tracklist</button>
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
function ArtistDetailModal({ artist, listened, trackCache, songRatings, songCovers, settings, theme, onClose, onOpenAlbum, albumOrder, setAlbumOrder, songOrder, setSongOrder }) {
  const listenedAlbums = listened.filter(a => a.artist === artist);

  const effectiveRating = a => {
    if (settings.listenSort === "raw") {
      const songs = trackCache[a.artist + "||" + a.album] || [];
      const vals = songs.map(s => songRatings[a.artist + "||" + a.album + "||" + s]).filter(v => v != null);
      return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
    }
    return a.rating;
  };

  // Reordering ties only makes sense against the persisted `rating` field
  // (same gating the Rated & Ranked tab uses) — "raw average" is derived
  // and can't be manually tie-broken.
  const canReorderAlbums = settings.listenSort === "rating";

  // Full rating-sorted + tie-ordered album list across ALL artists (mirrors
  // the Heard tab), used only to compute correct tie-group edges — display
  // is filtered down to this artist below.
  const globalSortedAlbums = (() => {
    const base = [...listened].sort((a, b) => {
      if (a.rating == null && b.rating == null) return 0;
      if (a.rating == null) return 1;
      if (b.rating == null) return -1;
      return b.rating - a.rating;
    });
    if (!canReorderAlbums) return base;
    const tagged = base.map(a => ({ ...a, __rating: a.rating }));
    return applyTieOrder(tagged, albumOrder, a => a.id);
  })();

  const artistScopedAlbums = canReorderAlbums
    ? globalSortedAlbums.filter(a => a.artist === artist)
    : null;

  const sortedListened = canReorderAlbums
    ? artistScopedAlbums
    : [...listenedAlbums].sort((a, b) => {
        const ar = effectiveRating(a), br = effectiveRating(b);
        if (ar == null && br == null) return 0;
        if (ar == null) return 1;
        if (br == null) return -1;
        return br - ar;
      });

  const moveAlbumInTieGroup = (album, dir) => {
    if (!canReorderAlbums) return;
    setAlbumOrder(() => reorderScoped(globalSortedAlbums, a => a.id, a => a.artist === artist, album.id, dir));
  };

  const ratedVals = sortedListened.map(effectiveRating).filter(v => v != null);
  const artistAvg = ratedVals.length ? (ratedVals.reduce((x, y) => x + y, 0) / ratedVals.length) : null;
  const avgRc = ratingColor(artistAvg);

  // Compare my total rating points to critics' total, across whichever of
  // this artist's albums I've both rated AND have a critic score for —
  // straight sums rather than averages, so it scales with how many
  // albums you've actually rated instead of hiding that behind an average.
  const albumsWithCritic = listenedAlbums.filter(a => a.rating != null && a.criticScore != null);
  const myTotal = albumsWithCritic.reduce((s, a) => s + a.rating, 0);
  const criticTotal = albumsWithCritic.reduce((s, a) => s + a.criticScore / 10, 0);
  const vsCriticsDiff = albumsWithCritic.length
    ? Math.round((myTotal - criticTotal) * 10) / 10
    : null;

  const cover = listenedAlbums.find(a => a.cover)?.cover
    || Object.entries(songCovers || {}).find(([k]) => k.startsWith(artist + "||"))?.[1];

  // Full rating-sorted + tie-ordered list of every rated song across ALL
  // artists (mirrors the Song Leaderboard tab, minus its UI filters), used
  // to compute correct tie-group edges before filtering to this artist.
  const allSongsOrdered = (() => {
    const base = Object.entries(songRatings)
      .filter(([, r]) => r != null)
      .map(([key, rating]) => {
        const parts = key.split("||");
        return { key, artist: parts[0], album: parts[1], song: parts[2], rating, __rating: rating };
      })
      .sort((a, b) => b.rating - a.rating);
    return applyTieOrder(base, songOrder, s => s.key);
  })();

  const artistScopedSongs = allSongsOrdered.filter(s => s.artist === artist);
  const topSongs = artistScopedSongs.slice(0, 10);

  const moveSongInTieGroup = (song, dir) => {
    setSongOrder(() => reorderScoped(allSongsOrdered, s => s.key, s => s.artist === artist, song.key, dir));
  };

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

      {albumsWithCritic.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:theme.muted }}>
            vs critics ({albumsWithCritic.length} album{albumsWithCritic.length !== 1 ? "s" : ""}) — {myTotal.toFixed(1)} you vs {criticTotal.toFixed(1)} critics
          </span>
          <span style={{
            fontSize:13, fontWeight:800, padding:"2px 8px", borderRadius:7,
            color: vsCriticsDiff >= 0 ? "#22c55e" : "#f87171",
            background: vsCriticsDiff >= 0 ? "#22c55e1e" : "#f871711e",
          }}>
            {vsCriticsDiff > 0 ? `+${vsCriticsDiff.toFixed(1)}` : vsCriticsDiff.toFixed(1)}
          </span>
        </div>
      )}

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
              const canReorderRow = canReorderAlbums && rating != null && hasTieGroup(artistScopedAlbums, i);
              return (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                  background:theme.card, borderRadius:8, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:20, textAlign:"right", fontSize:11, color: rating!=null ? theme.muted : theme.border, fontWeight:700, flexShrink:0 }}>
                    {rating != null ? i + 1 : "—"}
                  </div>
                  <ReorderArrows
                    canUp={canReorderRow} canDown={canReorderRow}
                    onUp={() => moveAlbumInTieGroup(a, -1)}
                    onDown={() => moveAlbumInTieGroup(a, 1)}
                    theme={theme}
                  />
                  <div onClick={() => onOpenAlbum(a)} style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0, cursor:"pointer" }}>
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
              const canReorderSongRow = hasTieGroup(artistScopedSongs, i);
              return (
                <div key={s.key} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"7px 10px",
                  background:theme.card, borderRadius:8, border:`1px solid ${theme.border}`,
                }}>
                  <div style={{ width:16, textAlign:"right", fontSize:11, color:theme.muted, fontWeight:700, flexShrink:0 }}>{i + 1}</div>
                  <ReorderArrows
                    canUp={canReorderSongRow} canDown={canReorderSongRow}
                    onUp={() => moveSongInTieGroup(s, -1)}
                    onDown={() => moveSongInTieGroup(s, 1)}
                    theme={theme}
                  />
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
function SettingsModal({ settings, setSettings, onClose, theme, backupData, onImportBackup }) {
  const set = (k, v) => setSettings(p => { const n = {...p, [k]:v}; persist(SK.settings, n); return n; });
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState(null);
  const [importedOk, setImportedOk] = useState(false);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `album-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.listened)) {
          setImportError("That doesn't look like a valid backup file.");
          setImportedOk(false);
          return;
        }
        onImportBackup(parsed);
        setImportError(null);
        setImportedOk(true);
      } catch {
        setImportError("Couldn't read that file — make sure it's a backup exported from here.");
        setImportedOk(false);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

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
        <label style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
          <div style={{
            width:16, height:16, borderRadius:3, border:`2px solid ${settings.showCriticDebug !== false ? theme.accent : theme.border}`,
            background: settings.showCriticDebug !== false ? theme.accent : "transparent", flexShrink:0,
          }} onClick={() => set("showCriticDebug", settings.showCriticDebug === false)} />
          <span style={{ fontSize:13, color:theme.text }}>Show "why?" critic-score debug details</span>
        </label>
      </div>
      <div>
        <div style={{ fontSize:13, color:theme.muted, marginBottom:8, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Backup</div>
        <p style={{ fontSize:12, color:theme.muted, margin:"0 0 10px", lineHeight:1.5 }}>
          Download a copy of every rating, ranking, and note. Keep it somewhere safe as a fallback in case cloud sync ever has a problem.
        </p>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportBackup} style={{
            flex:1, padding:"9px", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:8, color:theme.text, cursor:"pointer", fontSize:12, fontWeight:600,
          }}>⬇️ Export backup</button>
          <button onClick={() => fileInputRef.current?.click()} style={{
            flex:1, padding:"9px", background:theme.card, border:`1px solid ${theme.border}`,
            borderRadius:8, color:theme.text, cursor:"pointer", fontSize:12, fontWeight:600,
          }}>⬆️ Import backup</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display:"none" }} />
        </div>
        {importError && <div style={{ fontSize:11, color:"#f87171", marginTop:8 }}>{importError}</div>}
        {importedOk && !importError && <div style={{ fontSize:11, color:"#22c55e", marginTop:8 }}>Backup restored.</div>}
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

// Strip accents and punctuation so titles compare on their actual words
// rather than exact formatting, which iTunes is inconsistent about. Unlike
// the old version, this does NOT delete parenthesized/bracketed text — an
// edition suffix like "(Collector's Edition)" is meaningful information we
// want to reason about explicitly (see splitEdition), not throw away.
function normalizeTitle(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Single tokens that mark the start of an "edition" descriptor tacked onto
// an otherwise-plain album title, e.g. "damn collectors edition" or
// "abbey road super deluxe anniversary edition". Everything from the first
// matching token onward is treated as edition text, not part of the title.
const EDITION_MARKERS = new Set([
  "deluxe", "remaster", "remastered", "anniversary", "expanded", "extended",
  "reissue", "reissued", "edition", "version", "collector", "collectors",
  "platinum", "super", "bonus", "international", "explicit", "clean",
  "special", "complete", "legacy", "instrumental", "acapella", "acappella",
  "live", "demo", "demos", "mono", "stereo", "digital",
]);

// Splits a normalized title into { base, edition }. "yeezus" -> base
// "yeezus", edition "". "damn collectors edition" -> base "damn",
// edition "collectors edition". "ye" -> base "ye", edition "".
function splitEdition(normalized) {
  const words = (normalized || "").split(" ").filter(Boolean);
  const idx = words.findIndex(w => EDITION_MARKERS.has(w));
  if (idx === -1) return { base: normalized, edition: "" };
  return { base: words.slice(0, idx).join(" ").trim(), edition: words.slice(idx).join(" ").trim() };
}

// Human-readable edition label for UI badges, derived the same way.
// Returns null for a plain/standard release.
function detectEdition(title) {
  const { edition } = splitEdition(normalizeTitle(title));
  if (!edition) return null;
  return edition
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\bCollectors\b/, "Collector's");
}

// 0-1 similarity between two already-normalized strings. Used for ARTIST
// name comparison, where a loose "one contains the other" match is usually
// still correct (e.g. "kanye west" vs "ye", or "the beatles" vs "beatles").
// The length-ratio guard is what stops a tiny fragment like "ye" from
// getting undeserved credit for merely appearing inside a longer, unrelated
// string — that was the root cause of "Yeezus" search results being
// out-scored by "Ye".
function titleSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const shorter = a.length <= b.length ? a : b;
  const longer  = a.length <= b.length ? b : a;
  if (shorter && longer.includes(shorter) && shorter.length >= longer.length * 0.6) return 0.8;
  const aTokens = new Set(a.split(" ").filter(Boolean));
  const bTokens = new Set(b.split(" ").filter(Boolean));
  if (!aTokens.size || !bTokens.size) return 0;
  let overlap = 0;
  aTokens.forEach(t => { if (bTokens.has(t)) overlap++; });
  return overlap / Math.max(aTokens.size, bTokens.size);
}

// 0-1 confidence that `candidateTitle` IS the album the person asked for
// (`targetTitle`), edition-aware. This is deliberately strict: two totally
// different albums by the same artist ("Overly Dedicated" vs "DAMN.") must
// never score high just because they share an artist or a stray word —
// unlike the old titleSimilarity substring shortcut, plain token overlap
// alone is capped well below what an exact/edition-variant base-title match
// scores, so it can never win outright.
function albumMatchScore(candidateTitle, targetTitle) {
  const cn = normalizeTitle(candidateTitle);
  const tn = normalizeTitle(targetTitle);
  if (!cn || !tn) return 0;
  if (cn === tn) return 1;
  const { base: cBase, edition: cEdition } = splitEdition(cn);
  const { base: tBase, edition: tEdition } = splitEdition(tn);
  if (cBase && cBase === tBase) {
    // Same underlying album. Prefer an exact edition match (both plain, or
    // both naming the same edition); still count a *different* edition of
    // the right album as a strong match, just not a perfect one, so e.g.
    // asking for "DAMN." doesn't accidentally settle for the Collector's
    // Edition when the plain one is also on offer.
    return cEdition === tEdition ? 0.97 : 0.85;
  }
  const cTokens = new Set(cBase.split(" ").filter(Boolean));
  const tTokens = new Set(tBase.split(" ").filter(Boolean));
  if (!cTokens.size || !tTokens.size) return 0;
  let overlap = 0;
  cTokens.forEach(w => { if (tTokens.has(w)) overlap++; });
  // Scaled down hard: token overlap on its own is a weak signal (lots of
  // albums share a word) and must never outscore a real base-title match.
  return (overlap / Math.max(cTokens.size, tTokens.size)) * 0.5;
}

// Minimum album-title confidence required before we'll silently attach a
// cover + tracklist to something the person didn't explicitly pick. Below
// this, an "almost right" guess is worse than no guess — it looks correct
// at a glance and quietly corrupts the tracklist/rating data underneath it.
const AUTO_MATCH_THRESHOLD = 0.55;

// iTunes' search ranking often isn't an exact-title match — for artists
// with many releases it'll happily return a deluxe reissue, a "best of"
// compilation, or occasionally a different artist entirely as result #1.
// Score every candidate against the artist/album we actually asked for and
// take the best match instead of trusting position 0 — and return nothing
// at all if even the best candidate isn't a confident match.
function pickBestAlbumMatch(results, artist, album) {
  const targetArtist = normalizeTitle(artist);
  let best = null, bestScore = -1, bestAlbumScore = 0;
  for (const r of results) {
    if (!r.collectionName) continue;
    const artistScore = titleSimilarity(normalizeTitle(r.artistName), targetArtist);
    const albumScore = albumMatchScore(r.collectionName, album);
    // Normally require some minimum artist relevance so a same-titled
    // album by a different artist can't outscore the real one on title
    // match alone — but a very strong, near-exact album-title match is
    // allowed through on its own, since collabs/features/group monikers
    // (e.g. "Drake & 21 Savage", "JACKBOYS") often don't textually
    // resemble the artist name the person typed at all.
    if (artistScore < 0.4 && albumScore < 0.8) continue;
    const score = albumScore * 2 + artistScore * 0.3;
    if (score > bestScore) { bestScore = score; best = r; bestAlbumScore = albumScore; }
  }
  if (!best || bestAlbumScore < AUTO_MATCH_THRESHOLD) return null;
  return best;
}

// Fetches the ordered tracklist for a specific iTunes collection id.
async function fetchTracklistForCollection(collectionId) {
  if (!collectionId) return [];
  try {
    const lookupRes = await fetch(
      `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`
    );
    const lookupData = await lookupRes.json();
    return (lookupData.results || [])
      .filter(r => r.wrapperType === "track" && r.kind === "song")
      .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
      .map(r => r.trackName)
      .filter(Boolean);
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Raw iTunes album search for one query string, filtered down to usable
// results. Kept separate so both the picker and the silent auto-lookup can
// combine a "combined term" pass with a "title only" fallback pass without
// duplicating the fetch/parse logic.
async function rawAlbumSearch(term, limit = 50) {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=${limit}`);
    const data = await res.json();
    return (data.results || []).filter(r => r.collectionName && r.collectionId);
  } catch (e) {
    console.error(e);
    return [];
  }
}

// ─── MUSICBRAINZ FALLBACK ─────────────────────────────────────────────────
// The iTunes Search API is really the old *purchasable iTunes Store*
// catalog, not the full Apple Music streaming catalog — plenty of real
// releases (older mixtapes especially, e.g. things that were only ever a
// free/retail digital drop rather than a store album, or got delisted as
// purchases while staying on streaming) simply aren't in it, no matter how
// the query is phrased. MusicBrainz is a separate, independent, free
// database that isn't tied to any single storefront's catalog and covers
// this kind of release far better, with Cover Art Archive providing art
// for anything MusicBrainz has. Used as a fallback whenever iTunes doesn't
// turn up a confident match, and merged in alongside iTunes results in the
// picker so the person can still choose between them.
async function searchMusicBrainzCandidates(artist, album) {
  try {
    const q = encodeURIComponent(`${artist} ${album}`.trim());
    const res = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=${q}&fmt=json&limit=15`);
    const data = await res.json();
    return (data["release-groups"] || [])
      .filter(rg => rg.title && rg.id)
      .map(rg => ({
        id: rg.id,
        title: rg.title,
        artist: (rg["artist-credit"] || []).map(c => c.name).join(""),
        year: rg["first-release-date"] ? parseInt(rg["first-release-date"].slice(0, 4)) || null : null,
      }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Picks a representative release under a MusicBrainz release-group and
// returns its ordered tracklist. Release-groups can have several releases
// (regional pressings, remasters, a Spotify-ingest duplicate, etc); we
// prefer one flagged "Official" and otherwise just take the first.
async function fetchTracklistForMBReleaseGroup(rgId) {
  try {
    const rgRes = await fetch(`https://musicbrainz.org/ws/2/release-group/${rgId}?inc=releases&fmt=json`);
    const rgData = await rgRes.json();
    const releases = rgData.releases || [];
    if (!releases.length) return [];
    const release = releases.find(r => r.status === "Official") || releases[0];
    const relRes = await fetch(`https://musicbrainz.org/ws/2/release/${release.id}?inc=recordings&fmt=json`);
    const relData = await relRes.json();
    const tracks = [];
    (relData.media || []).forEach(m => (m.tracks || []).forEach(t => { if (t.title) tracks.push(t.title); }));
    return tracks;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Runs both a "artist + album" search and, when that doesn't turn up a
// confident match, a fallback "album title only" search. This matters for
// collab/feature albums and group monikers where iTunes credits the
// release to something that doesn't textually resemble the artist name the
// person typed (e.g. "Drake & 21 Savage", "JACKBOYS", "Watch The Throne"
// credited to a joint act) — searching with the artist name baked into the
// query string can otherwise push the real album out of iTunes' own top
// results before our local scoring even sees it.
async function searchAlbumRaw(artist, album) {
  const combined = await rawAlbumSearch(`${artist} ${album}`.trim());
  const bestSoFar = combined.reduce((best, r) => {
    const albumScore = album ? albumMatchScore(r.collectionName, album) : 0;
    return Math.max(best, albumScore);
  }, 0);
  if (bestSoFar >= 0.6 || !album) return combined;

  const titleOnly = await rawAlbumSearch(album);
  const seen = new Set(combined.map(r => r.collectionId));
  const merged = [...combined];
  titleOnly.forEach(r => { if (!seen.has(r.collectionId)) { merged.push(r); seen.add(r.collectionId); } });
  return merged;
}

// Returns up to `limit` album candidates for artist+album, sorted by match
// confidence (best first), each annotated with an edition label, a
// confidence flag, and a `source` so the UI can show the person exactly
// what they're picking between instead of a single silent guess. Pulls
// from iTunes first; if nothing there is confident, MusicBrainz candidates
// are merged in too (covers mixtapes/older releases that have fallen out
// of the legacy iTunes Store index — see searchMusicBrainzCandidates).
// Artist-name relevance is used for ranking, not as a hard cutoff — a very
// strong album-title match is enough to surface a candidate even if the
// credited artist string looks nothing like what was typed (collabs,
// features, group monikers), since the person confirms the pick visually
// either way.
async function searchAlbumCandidates(artist, album, limit = 8) {
  const targetArtist = normalizeTitle(artist);
  const results = await searchAlbumRaw(artist, album);
  const seen = new Set();
  const scoredItunes = results
    .map(r => {
      const artistScore = titleSimilarity(normalizeTitle(r.artistName), targetArtist);
      const albumScore = album ? albumMatchScore(r.collectionName, album) : 0.5;
      return { r, artistScore, albumScore, score: albumScore * 2 + artistScore * 0.3 };
    })
    .filter(x => x.artistScore >= 0.15 || x.albumScore >= 0.5);

  const bestItunesAlbumScore = scoredItunes.reduce((m, x) => Math.max(m, x.albumScore), 0);

  let mbCandidates = [];
  if (bestItunesAlbumScore < AUTO_MATCH_THRESHOLD && album) {
    const mbResults = await searchMusicBrainzCandidates(artist, album);
    mbCandidates = mbResults
      .map(r => {
        const artistScore = titleSimilarity(normalizeTitle(r.artist), targetArtist);
        const albumScore = albumMatchScore(r.title, album);
        return { r, artistScore, albumScore, score: albumScore * 2 + artistScore * 0.3 };
      })
      .filter(x => x.artistScore >= 0.15 || x.albumScore >= 0.5);
  }

  const combined = [
    ...scoredItunes.map(x => ({
      source: "itunes",
      id: x.r.collectionId,
      artist: x.r.artistName,
      album: x.r.collectionName,
      year: x.r.releaseDate ? new Date(x.r.releaseDate).getFullYear() : null,
      trackCount: x.r.trackCount || null,
      cover: x.r.artworkUrl100 ? x.r.artworkUrl100.replace("100x100bb", "600x600bb") : null,
      edition: detectEdition(x.r.collectionName),
      albumScore: x.albumScore,
      score: x.score,
    })),
    ...mbCandidates.map(x => ({
      source: "musicbrainz",
      id: x.r.id,
      artist: x.r.artist,
      album: x.r.title,
      year: x.r.year,
      trackCount: null,
      cover: `https://coverartarchive.org/release-group/${x.r.id}/front-500`,
      edition: detectEdition(x.r.title),
      albumScore: x.albumScore,
      score: x.score,
    })),
  ];

  return combined
    .sort((a, b) => b.score - a.score)
    .filter(x => {
      const key = `${x.source}:${x.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(x => ({ ...x, confident: x.albumScore >= AUTO_MATCH_THRESHOLD }));
}

// Best-effort automatic lookup, used as a fallback when the person adds an
// album without picking a specific search result. Now gated by
// AUTO_MATCH_THRESHOLD, so a bad guess is skipped entirely (empty
// cover/tracks) rather than silently attached — and, like the picker,
// falls back to MusicBrainz when iTunes doesn't have a confident match.
async function getAlbumInfo(artist, album) {
  try {
    const results = await searchAlbumRaw(artist, album);
    const result = results.length ? pickBestAlbumMatch(results, artist, album) : null;
    if (result) {
      const cover = result.artworkUrl100 ? result.artworkUrl100.replace("100x100bb", "600x600bb") : null;
      const tracks = await fetchTracklistForCollection(result.collectionId);
      return { cover, tracks };
    }

    const mbResults = await searchMusicBrainzCandidates(artist, album);
    const targetArtist = normalizeTitle(artist);
    let bestMB = null, bestMBAlbumScore = 0;
    mbResults.forEach(r => {
      const artistScore = titleSimilarity(normalizeTitle(r.artist), targetArtist);
      const albumScore = albumMatchScore(r.title, album);
      if ((artistScore >= 0.4 || albumScore >= 0.8) && albumScore > bestMBAlbumScore) {
        bestMB = r; bestMBAlbumScore = albumScore;
      }
    });
    if (bestMB && bestMBAlbumScore >= AUTO_MATCH_THRESHOLD) {
      const tracks = await fetchTracklistForMBReleaseGroup(bestMB.id);
      return { cover: `https://coverartarchive.org/release-group/${bestMB.id}/front-500`, tracks };
    }
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

// ─── CRITIC COMPARISON (stats page) ─────────────────────────────────────────
// Auto-fills critic scores for rated albums that don't have one yet (same
// "search AOTY only while empty" rule as the album detail modal), then shows
// how the person's ratings stack up against critics: a scatter of you-vs-them
// plus a distribution of the differences. Anything AOTY can't find gets a
// quick manual-entry row right here instead of making you open each album.
function CriticComparisonSection({ ratedAlbums, onSetCriticScore, theme, isMobile }) {
  const [checkedIds, setCheckedIds] = useState(() => new Set());
  const inFlight = useRef(new Set());

  useEffect(() => {
    ratedAlbums.forEach(a => {
      if (a.criticScore != null) return;
      if (inFlight.current.has(a.id)) return;
      if (checkedIds.has(a.id)) return; // already searched once this visit to the stats page
      inFlight.current.add(a.id);
      fetchCriticScore(a.artist, a.album)
        .then(({ score }) => {
          onSetCriticScore(a.id, score, score != null ? "aoty" : null);
        })
        .finally(() => {
          inFlight.current.delete(a.id);
          setCheckedIds(prev => new Set(prev).add(a.id));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratedAlbums]);

  const withCritic = ratedAlbums.filter(a => a.criticScore != null);
  const stillFetching = ratedAlbums.filter(a => a.criticScore == null && !checkedIds.has(a.id));
  const missing = ratedAlbums.filter(a => a.criticScore == null && checkedIds.has(a.id));

  const diffs = withCritic.map(a => a.rating - a.criticScore / 10);
  const avgDiff = diffs.length ? diffs.reduce((s, d) => s + d, 0) / diffs.length : null;
  const avgCritic = withCritic.length ? withCritic.reduce((s, a) => s + a.criticScore / 10, 0) / withCritic.length : null;

  // diff histogram: -5..+5 in 1-point buckets, centered on 0
  const diffBuckets = Array.from({ length: 10 }, () => 0); // -5..-4 ... 4..5
  diffs.forEach(d => {
    const idx = Math.min(9, Math.max(0, Math.floor(d + 5)));
    diffBuckets[idx]++;
  });
  const maxDiffBucket = Math.max(...diffBuckets, 1);

  return (
    <div style={{ marginBottom:30 }}>
      <SectionHeading theme={theme}>You vs. critics (AOTY)</SectionHeading>

      {withCritic.length === 0 && stillFetching.length > 0 && (
        <div style={{ fontSize:12, color:theme.muted, padding:"10px 0" }}>Looking up critic scores on AOTY…</div>
      )}

      {withCritic.length === 0 && stillFetching.length === 0 && missing.length > 0 && (
        <div style={{ fontSize:12, color:theme.muted, padding:"10px 0" }}>
          AOTY didn't have a critic score for any of your rated albums yet — add some below.
        </div>
      )}

      {withCritic.length > 0 && (
        <>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            <StatCard label="Albums compared" value={withCritic.length} theme={theme} />
            <StatCard label="Avg critic score" value={avgCritic != null ? avgCritic.toFixed(2) : "—"} theme={theme} />
            <StatCard label="Avg you vs. critics"
              value={avgDiff != null ? (avgDiff > 0 ? `+${avgDiff.toFixed(2)}` : avgDiff.toFixed(2)) : "—"}
              sub={avgDiff != null ? (avgDiff > 0 ? "you rate higher" : avgDiff < 0 ? "you rate lower" : "dead even") : null}
              theme={theme} />
          </div>

          <div>
            <div style={{ fontSize:11, color:theme.muted, marginBottom:6 }}>Distribution of (you − critics)</div>
            {diffBuckets.map((count, i) => {
              const lo = i - 5;
              return (
                <StatBar key={i} label={`${lo >= 0 ? "+" : ""}${lo} to ${lo+1 >= 0 ? "+" : ""}${lo+1}`}
                  value={count} max={maxDiffBucket}
                  color={lo + 0.5 >= 0 ? "#22c55e" : "#f87171"} theme={theme} />
              );
            })}
          </div>
        </>
      )}

      {missing.length > 0 && (
        <div style={{ marginTop:18 }}>
          <div style={{ fontSize:11, color:theme.muted, marginBottom:8 }}>
            No AOTY critic score found for these — enter one to include them in the comparison:
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {missing.map(a => (
              <MissingCriticRow key={a.id} album={a} onSetCriticScore={onSetCriticScore} theme={theme} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MissingCriticRow({ album, onSetCriticScore, theme }) {
  const [val, setVal] = useState("");
  const [error, setError] = useState(null);

  const save = () => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 100) {
      setError("0–100");
      return;
    }
    onSetCriticScore(album.id, Math.round(num), "manual");
  };

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:theme.card,
      borderRadius:8, border:`1px solid ${theme.border}` }}>
      <div style={{ flex:1, minWidth:0, fontSize:12, color:theme.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {album.artist} <span style={{ color:theme.muted }}>·</span> {album.album}
      </div>
      <input
        type="number" min="0" max="100" value={val}
        onChange={e => { setVal(e.target.value); setError(null); }}
        placeholder="e.g. 84"
        style={{ width:64, background:theme.surface, border:`1px solid ${theme.border}`,
          borderRadius:6, padding:"4px 7px", color:theme.text, fontSize:12, outline:"none" }}
      />
      <button onClick={save} style={{ padding:"4px 10px", background:theme.accent, border:"none",
        borderRadius:6, color:"#fff", fontWeight:700, fontSize:11, cursor:"pointer" }}>Save</button>
      {error && <span style={{ fontSize:10, color:"#f87171" }}>{error}</span>}
    </div>
  );
}

function StatsPage({ listened, songRatings, trackCache, theme, isMobile, onSetCriticScore }) {
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
        <div style={{ marginBottom:30 }}>
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

      {ratedAlbums.length > 0 && (
        <CriticComparisonSection ratedAlbums={ratedAlbums} onSetCriticScore={onSetCriticScore} theme={theme} isMobile={isMobile} />
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
    showCriticDebug: true,
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
  const [songCovers, setSongCovers] = useState(() => loadLS(SK.songCovers, {}));
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
  const [addSongModal, setAddSongModal] = useState(false);
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

  // All app data is persisted locally the moment it changes — this used to
  // be scattered across individual click handlers (easy to miss a spot);
  // now it's centralized here so nothing can fall through the cracks.
  useEffect(() => { persist(SK.listened, listened); }, [listened]);
  useEffect(() => { persist(SK.tracks, trackCache); }, [trackCache]);
  useEffect(() => { persist(SK.songRatings, songRatings); }, [songRatings]);
  useEffect(() => { persist(SK.songCovers, songCovers); }, [songCovers]);
  useEffect(() => { persist(SK.albumOrder, albumOrder); }, [albumOrder]);
  useEffect(() => { persist(SK.songOrder, songOrder); }, [songOrder]);
  useEffect(() => { persist(SK.deletedListened, deletedListened); }, [deletedListened]);

  // ── LOCAL EDIT TIMESTAMP ─────────────────────────────────────────────
  // Records when the data on THIS device last actually changed. The cloud
  // sync below uses this to tell "the cloud has something newer than us"
  // apart from "the cloud is behind us" instead of always trusting
  // whatever's in the cloud — that unconditional trust was the main cause
  // of tracklists/ratings disappearing after a reload: if the 2s debounced
  // save hadn't finished yet (tab closed, phone locked, network hiccup),
  // the next load would pull the older cloud copy and stomp the newer
  // local one, then immediately re-persist that stale copy over the local
  // backup too — permanently losing the recent edit on both sides at once.
  const [localUpdatedAt, setLocalUpdatedAt] = useState(() => loadLS(SK.updatedAt, 0));
  const localUpdatedAtRef = useRef(localUpdatedAt);
  localUpdatedAtRef.current = localUpdatedAt;
  // The cloud auto-load effect below only runs once on mount, so anything
  // it reads via closure is frozen at whatever it was when the effect was
  // created — NOT whatever it is by the time the (async) cloud fetch
  // actually resolves. Without these refs, an edit made in that window
  // (e.g. rating a song while the cloud fetch is still in flight) would
  // get silently discarded the moment the merge fires and overwrites state
  // with the stale mount-time snapshot. Mirrors the localUpdatedAtRef
  // pattern already used above for the same reason.
  const listenedRef = useRef(listened);
  listenedRef.current = listened;
  const trackCacheRef = useRef(trackCache);
  trackCacheRef.current = trackCache;
  const songRatingsRef = useRef(songRatings);
  songRatingsRef.current = songRatings;
  const songCoversRef = useRef(songCovers);
  songCoversRef.current = songCovers;
  const albumOrderRef = useRef(albumOrder);
  albumOrderRef.current = albumOrder;
  const songOrderRef = useRef(songOrder);
  songOrderRef.current = songOrder;
  const deletedListenedRef = useRef(deletedListened);
  deletedListenedRef.current = deletedListened;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  // Set right before a batch of setState calls that represent data ARRIVING
  // (from the cloud or a backup import) rather than the person editing
  // something, so that arrival doesn't get mistaken for a brand-new local
  // edit on the very next timestamp check.
  const suppressTimestampBump = useRef(false);
  const isFirstDataEffect = useRef(true);

  useEffect(() => {
    if (isFirstDataEffect.current) { isFirstDataEffect.current = false; return; }
    if (suppressTimestampBump.current) { suppressTimestampBump.current = false; return; }
    const now = Date.now();
    setLocalUpdatedAt(now);
    persist(SK.updatedAt, now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listened, trackCache, songRatings, songCovers, albumOrder, songOrder, deletedListened]);

  // Guards the very first render(s): the initial state is whatever's in
  // localStorage/seed data, loaded synchronously before the cloud fetch
  // below has a chance to finish.
  const [cloudLoaded, setCloudLoaded] = useState(false);

  // Merges two key→value maps (trackCache or songRatings) WITHOUT ever
  // silently dropping an entry: every key from `base` survives unless
  // `winner` also has that exact key, in which case winner's value wins.
  // This is what stops a stale/partial cloud snapshot (or a stale/partial
  // local one) from erasing tracklists or ratings that only exist on one
  // side — a plain overwrite could lose them; this can only ever add.
  const mergeKeyed = (base, winner) => ({ ...(base || {}), ...(winner || {}) });

  // Same idea for the `listened` array, merged by album id.
  const mergeListened = (base, winner) => {
    const byId = new Map((base || []).map(a => [a.id, a]));
    (winner || []).forEach(a => byId.set(a.id, a));
    return Array.from(byId.values());
  };

  useEffect(() => {
    async function autoLoad() {
      try {
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
        if (!cloud || typeof cloud !== "object") return;

        const cloudUpdatedAt = typeof cloud.updatedAt === "number" ? cloud.updatedAt : 0;
        const localAt = localUpdatedAtRef.current || 0;
        // Whichever side is more recent wins ties on conflicting fields,
        // but everything is MERGED rather than replaced outright, so a
        // stale write on either side can never make data disappear —
        // at worst it loses a tie-break on the handful of fields that
        // actually conflict, never the fields that don't.
        const cloudWins = cloudUpdatedAt > localAt;

        const currentListened = listenedRef.current;
        const currentTrackCache = trackCacheRef.current;
        const currentSongRatings = songRatingsRef.current;
        const currentSongCovers = songCoversRef.current;
        const currentAlbumOrder = albumOrderRef.current;
        const currentSongOrder = songOrderRef.current;
        const currentDeletedListened = deletedListenedRef.current;
        const currentSettings = settingsRef.current;

        const deletedUnion = Array.from(new Set([
          ...(currentDeletedListened || []),
          ...(Array.isArray(cloud.deletedListened) ? cloud.deletedListened : []),
        ]));

        const mergedListenedRaw = cloudWins
          ? mergeListened(currentListened, Array.isArray(cloud.listened) ? cloud.listened : [])
          : mergeListened(Array.isArray(cloud.listened) ? cloud.listened : [], currentListened);
        const finalListened = mergedListenedRaw.filter(a => !deletedUnion.includes(a.id));

        const mergedTracks = cloudWins
          ? mergeKeyed(currentTrackCache, cloud.trackCache)
          : mergeKeyed(cloud.trackCache, currentTrackCache);
        const mergedRatings = cloudWins
          ? mergeKeyed(currentSongRatings, cloud.songRatings)
          : mergeKeyed(cloud.songRatings, currentSongRatings);
        const mergedSongCovers = cloudWins
          ? mergeKeyed(currentSongCovers, cloud.songCovers)
          : mergeKeyed(cloud.songCovers, currentSongCovers);
        const mergedAlbumOrder = cloudWins && Array.isArray(cloud.albumOrder) ? cloud.albumOrder : currentAlbumOrder;
        const mergedSongOrder  = cloudWins && Array.isArray(cloud.songOrder)  ? cloud.songOrder  : currentSongOrder;
        const mergedSettings = cloudWins && cloud.settings ? cloud.settings : currentSettings;
        const finalUpdatedAt = Math.max(cloudUpdatedAt, localAt);

        suppressTimestampBump.current = true;
        setListened(finalListened);
        setTrackCache(mergedTracks);
        setSongRatings(mergedRatings);
        setSongCovers(mergedSongCovers);
        setAlbumOrder(mergedAlbumOrder);
        setSongOrder(mergedSongOrder);
        setDeletedListened(deletedUnion);
        if (mergedSettings) setSettings(mergedSettings);
        setLocalUpdatedAt(finalUpdatedAt);
        persist(SK.updatedAt, finalUpdatedAt);

        // If the cloud was behind us (or missing data only we had), push
        // the reconciled result straight back up now instead of waiting
        // for the debounce — this is what lets a device that closed mid-
        // save catch the cloud up on the very next load, instead of
        // quietly losing whatever didn't make it out in time.
        if (!cloudWins) {
          const { error: pushErr } = await supabase.from("app_data").update({
            data: {
              listened: finalListened, trackCache: mergedTracks, songRatings: mergedRatings,
              songCovers: mergedSongCovers,
              settings: mergedSettings, albumOrder: mergedAlbumOrder, songOrder: mergedSongOrder,
              deletedListened: deletedUnion, updatedAt: finalUpdatedAt,
            },
          }).eq("id", 8);
          if (pushErr) console.error("Cloud catch-up save failed:", pushErr);
        }
      } finally {
        setCloudLoaded(true);
      }
    }

    autoLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── DEBOUNCED CLOUD SAVE, WITH AN IMMEDIATE FLUSH ON TAB HIDE/CLOSE ────
  // A plain debounce alone is exactly what caused the data loss: closing
  // or backgrounding the tab inside the quiet window meant the timer just
  // never got to fire. The debounce is kept for normal rating/typing
  // bursts (so we're not hammering the network on every keystroke), but
  // the pending save is also flushed immediately the moment the tab is
  // hidden or the page is about to unload, so a quick close can't outrun it.
  const pendingPayloadRef = useRef(null);
  const saveTimerRef = useRef(null);

  const flushSave = useCallback(() => {
    if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null; }
    const payload = pendingPayloadRef.current;
    if (!payload) return;
    pendingPayloadRef.current = null;
    supabase.from("app_data").update({ data: payload }).eq("id", 8)
      .then(({ error }) => { if (error) console.error("Cloud auto-save failed:", error); });
  }, []);

  useEffect(() => {
    if (!cloudLoaded) return; // never save over the cloud before we know what's actually in it

    pendingPayloadRef.current = {
      listened, trackCache, songRatings, songCovers, settings, albumOrder, songOrder,
      deletedListened, updatedAt: localUpdatedAt,
    };

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(flushSave, 1500);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [
    cloudLoaded, listened, trackCache, songRatings, songCovers, settings,
    albumOrder, songOrder, deletedListened, localUpdatedAt, flushSave,
  ]);

  // Backstop: flush whatever's pending as soon as the tab is hidden/closed
  // rather than only on a timer. visibilitychange fires reliably on both
  // mobile (backgrounding) and desktop (closing/switching tabs); pagehide
  // covers the rest.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden") flushSave(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushSave);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushSave);
    };
  }, [flushSave]);

  const handleImportBackup = (parsed) => {
    if (Array.isArray(parsed.listened)) setListened(parsed.listened);
    if (parsed.trackCache) setTrackCache(parsed.trackCache);
    if (parsed.songRatings) setSongRatings(parsed.songRatings);
    if (parsed.songCovers) setSongCovers(parsed.songCovers);
    if (parsed.settings) setSettings(parsed.settings);
    if (Array.isArray(parsed.albumOrder)) setAlbumOrder(parsed.albumOrder);
    if (Array.isArray(parsed.songOrder)) setSongOrder(parsed.songOrder);
    if (Array.isArray(parsed.deletedListened)) setDeletedListened(parsed.deletedListened);
  };

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

  // If the person explicitly picked a release from the search results,
  // trust it completely — no re-guessing, no risk of the classic
  // "similarly-named album/edition" mismatch. Only fall back to the
  // best-effort auto lookup (which is itself gated on confidence) when
  // they skipped the picker entirely.
  let cover, tracks;
  if (Array.isArray(form.tracks)) {
    cover = form.cover?.trim() ? form.cover.trim() : "";
    tracks = form.tracks;
  } else {
    const info = await getAlbumInfo(form.artist, form.album);
    cover = form.cover?.trim() ? form.cover.trim() : info.cover;
    tracks = info.tracks;
  }

  const entry = {
    artist: form.artist,
    album: form.album,
    year: parseInt(form.year) || new Date().getFullYear(),
    genre: form.genre,
    id: uid(),
    cover,
  };

  setListened(prev => [...prev, { ...entry, rating: null }]);

  if (tracks && tracks.length) {
    const cacheKey = `${form.artist}||${form.album}`;
    setTrackCache(prev => ({ ...prev, [cacheKey]: tracks }));

    // If songs were pre-rated from the Song Leaderboard as "on this album"
    // before the album itself existed here, adopt those ratings under the
    // album's exact artist||album||track key instead of leaving them
    // orphaned under whatever casing/spacing was typed at the time — this
    // is what stops the same song from ending up rated twice.
    const na = normalize(form.artist), nal = normalize(form.album);
    setSongRatings(prev => {
      let changed = false;
      const next = { ...prev };
      Object.keys(prev).forEach(k => {
        const parts = k.split("||");
        if (parts.length !== 3) return;
        const [ka, kal, ks] = parts;
        if (normalize(ka) !== na || normalize(kal) !== nal) return;
        const match = tracks.find(t => normalize(t) === normalize(ks));
        if (!match) return;
        const exactKey = `${form.artist}||${form.album}||${match}`;
        if (exactKey === k) return;
        if (next[exactKey] == null) {
          next[exactKey] = next[k];
          delete next[k];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }

  setAddModal(null);
};

  const handleAddSong = ({ artist, album, song, rating, cover }) => {
    const key = `${artist}||${album}`;
    setSongRatings(prev => ({ ...prev, [key + "||" + song]: rating }));
    if (cover) {
      setSongCovers(prev => (prev[key] ? prev : { ...prev, [key]: cover }));
    }
    setAddSongModal(false);
  };

  const handleEdit = (form, id) => {
    if (isDuplicateAlbum(form.artist, form.album, id)) return;
    const prevAlbum = listened.find(a => a.id === id);
    const renamed = prevAlbum && (prevAlbum.artist !== form.artist || prevAlbum.album !== form.album);

    setListened(prev => prev.map(a => a.id===id ? {...a,...form,year:parseInt(form.year)} : a));

    // A rename shouldn't orphan the tracklist/ratings that were tied to the
    // old artist/album string — move them to the new key so they follow the
    // album across the edit (and back again, if the name reverts later).
    if (renamed) {
      const oldKey = `${prevAlbum.artist}||${prevAlbum.album}`;
      const newKey = `${form.artist}||${form.album}`;

      setTrackCache(prev => {
        if (!(oldKey in prev)) return prev;
        const { [oldKey]: oldTracks, ...rest } = prev;
        const keepExisting = Array.isArray(rest[newKey]) && rest[newKey].length > 0;
        return { ...rest, [newKey]: keepExisting ? rest[newKey] : oldTracks };
      });

      setSongRatings(prev => {
        const oldPrefix = oldKey + "||";
        const newPrefix = newKey + "||";
        let changed = false;
        const next = { ...prev };
        Object.keys(prev).forEach(k => {
          if (!k.startsWith(oldPrefix)) return;
          const nk = newPrefix + k.slice(oldPrefix.length);
          if (next[nk] == null) next[nk] = next[k];
          delete next[k];
          changed = true;
        });
        return changed ? next : prev;
      });
    }

    setEditModal(null);
  };

  const setCriticScore = (id, score, source) => {
    setListened(prev => prev.map(a => a.id===id
      ? { ...a, criticScore: score, criticScoreSource: source, criticScoreChecked: true }
      : a
    ));
  };

  // Generic album field patcher, used by the "fix cover/tracklist" flow.
  const patchAlbum = (id, patch) => {
    setListened(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
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
  const canReorder = settings.listenSort==="rating" && a.rating!=null && hasTieGroup(visibleListened, i);
  const canUp   = canReorder;
  const canDown = canReorder;
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
          <button onClick={() => setAddSongModal(true)} style={{
            padding:"9px", marginBottom:12, width:"100%", background:theme.surface, border:`1px dashed ${theme.border}`,
            borderRadius:9, color:theme.muted, cursor:"pointer", fontSize:12, textAlign:"left",
          }}>+ Add song</button>
          <p style={{ margin:"0 0 14px", fontSize:12, color:theme.muted }}>
            Rate individual songs inside an album's tracklist, or add one directly above, to build your leaderboard.
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
              const rowCover = albumObj?.cover || songCovers[s.artist + "||" + s.album];
              const c = albumObj ? GENRES[albumObj.genre]?.color || "#888" : "#888";
              const canReorderSong = hasTieGroup(top50, i);
              const canUp   = canReorderSong;
              const canDown = canReorderSong;
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

{rowCover && (
  <img
    src={rowCover}
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
        <StatsPage listened={listened} songRatings={songRatings} trackCache={trackCache} theme={theme} isMobile={isMobile} onSetCriticScore={setCriticScore} />
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
          onUpdateAlbum={patchAlbum}
          showDebugTools={settings.showCriticDebug !== false}
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
          trackCache={trackCache} songRatings={songRatings} songCovers={songCovers}
          settings={settings} theme={theme}
          onOpenAlbum={(album) => openAlbum(album)}
          albumOrder={albumOrder} setAlbumOrder={setAlbumOrder}
          songOrder={songOrder} setSongOrder={setSongOrder}
        />
      )}
      {addModal && (
        <AlbumFormModal mode="add" onSave={form => handleAdd(form)}
          isDuplicate={(artist, album) => isDuplicateAlbum(artist, album)}
          onClose={() => setAddModal(null)} theme={theme} />
      )}
      {addSongModal && (
        <AddSongModal onSave={handleAddSong} onClose={() => setAddSongModal(false)}
          existingKeys={Object.keys(songRatings)} theme={theme} />
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
          onClose={() => setShowSettings(false)} theme={theme}
          backupData={{ listened, trackCache, songRatings, songCovers, settings, albumOrder, songOrder, deletedListened }}
          onImportBackup={handleImportBackup}
        />
      )}
    </div>
  );
}