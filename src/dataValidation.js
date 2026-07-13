// Data validation and hydration to prevent corruption
// Runs on app startup to sanitize/recover from corrupted state

export function validateAlbum(album) {
  return (
    album &&
    typeof album === "object" &&
    album.id &&
    album.artist &&
    album.album
  );
}

export function validateTrack(track) {
  return (
    track &&
    typeof track === "object" &&
    track.title &&
    track.artist
  );
}

export function validateSongRating(rating) {
  return (
    rating != null &&
    typeof rating === "number" &&
    rating >= 0 &&
    rating <= 10
  );
}

// Sanitize loaded data, removing corrupted entries
export function sanitizeListened(data) {
  if (!Array.isArray(data)) return [];
  return data.filter((album) => {
    if (!validateAlbum(album)) return false;
    // Ensure numeric fields
    if (album.year && typeof album.year !== "number") return false;
    return true;
  });
}

export function sanitizeTrackCache(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((entry) => {
      if (
        !entry ||
        typeof entry !== "object" ||
        !entry.cacheKey ||
        !Array.isArray(entry.tracks)
      )
        return false;
      return entry.tracks.every((t) => validateTrack(t));
    })
    .map((entry) => ({
      cacheKey: entry.cacheKey,
      tracks: entry.tracks,
      timestamp: entry.timestamp || Date.now(),
    }));
}

export function sanitizeSongRatings(data) {
  if (typeof data !== "object") return {};
  const result = {};
  for (const [key, rating] of Object.entries(data)) {
    if (validateSongRating(rating)) {
      result[key] = rating;
    }
  }
  return result;
}

export function sanitizeSettings(data, defaults) {
  if (typeof data !== "object") return defaults;
  return { ...defaults, ...data };
}

// Hydrate with seed data if critical data is missing
export function hydrateWithSeed(currentListened, seedData, deletedIds) {
  const deletedSet = new Set(deletedIds || []);
  const currentIds = new Set(currentListened.map((a) => a.id));

  // Add seed albums that aren't deleted and don't exist
  const toAdd = seedData.filter(
    (a) => !deletedSet.has(a.id) && !currentIds.has(a.id)
  );

  return [...currentListened, ...toAdd];
}

// Verify data integrity by checking for orphaned references
export function verifyDataIntegrity(listened, trackCache, songRatings) {
  const albumIds = new Set(listened.map((a) => a.id));
  const cacheKeyPattern = /^(.+?)\|\|(.+?)\|\|(.+?)$/;

  // Clean orphaned track cache entries
  const cleanedTrackCache = trackCache.filter((entry) => {
    const match = entry.cacheKey.match(cacheKeyPattern);
    return match && albumIds.has(entry.cacheKey.split("||")?.[0]);
  });

  // Clean orphaned song ratings
  const cleanedSongRatings = {};
  for (const [key, rating] of Object.entries(songRatings)) {
    const parts = key.split("||");
    if (
      parts.length === 3 &&
      albumIds.has(parts[0]) &&
      validateSongRating(rating)
    ) {
      cleanedSongRatings[key] = rating;
    }
  }

  return {
    trackCache: cleanedTrackCache,
    songRatings: cleanedSongRatings,
  };
}
