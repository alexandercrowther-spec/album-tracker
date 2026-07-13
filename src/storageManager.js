// Enhanced localStorage management with integrity checks
import {
  sanitizeListened,
  sanitizeTrackCache,
  sanitizeSongRatings,
  sanitizeSettings,
  verifyDataIntegrity,
  hydrateWithSeed,
} from "./dataValidation";

export const SK = {
  listened: "listened-v4",
  tracks: "trackcache-v2",
  songRatings: "songratings-v1",
  settings: "settings-v1",
  albumOrder: "albumorder-v1",
  songOrder: "songorder-v1",
  deletedListened: "deleted-listened-v1",
};

const DEFAULTS = {
  listened: [],
  tracks: [],
  songRatings: {},
  settings: {
    theme: "midnight",
    listenSort: "rating",
    showDebugTools: false,
  },
  albumOrder: [],
  songOrder: [],
  deletedListened: [],
};

export function persist(k, v) {
  try {
    // Validate before saving
    const sanitized = sanitizeForStorage(k, v);
    localStorage.setItem(k, JSON.stringify(sanitized));
    return true;
  } catch (e) {
    console.error(`Failed to persist ${k}:`, e);
    return false;
  }
}

export function loadLS(k, fb) {
  try {
    const r = localStorage.getItem(k);
    if (!r) return fb || DEFAULTS[k];

    const parsed = JSON.parse(r);
    const sanitized = sanitizeForStorage(k, parsed);

    // If sanitization changed data significantly, persist the clean version
    if (JSON.stringify(sanitized) !== r) {
      persist(k, sanitized);
    }

    return sanitized;
  } catch (e) {
    console.error(`Failed to load ${k}, using fallback:`, e);
    return fb || DEFAULTS[k];
  }
}

function sanitizeForStorage(k, v) {
  switch (k) {
    case SK.listened:
      return sanitizeListened(v);
    case SK.tracks:
      return sanitizeTrackCache(v);
    case SK.songRatings:
      return sanitizeSongRatings(v);
    case SK.settings:
      return sanitizeSettings(v, DEFAULTS.settings);
    case SK.deletedListened:
      return Array.isArray(v) ? v : [];
    default:
      return v;
  }
}

export function loadWithIntegrityCheck(
  listened,
  trackCache,
  songRatings,
  seedData
) {
  const deletedIds = loadLS(SK.deletedListened, []);

  // Verify cross-references
  const { trackCache: cleanedTracks, songRatings: cleanedRatings } =
    verifyDataIntegrity(listened, trackCache, songRatings);

  // Hydrate with seed if needed
  const hydrated = hydrateWithSeed(listened, seedData, deletedIds);

  return {
    listened: hydrated,
    trackCache: cleanedTracks,
    songRatings: cleanedRatings,
  };
}

export function clearCorruptedData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Failed to clear ${key}:`, e);
    return false;
  }
}
