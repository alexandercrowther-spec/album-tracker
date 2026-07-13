// api/album-lookup.js
//
// Improved album information fetching with strict disambiguation:
// - Uses MusicBrainz API as primary source (free, no bot detection)
// - Strict matching on artist/album to avoid mismatches
// - iTunes API fallback for cover art
// - Returns tracklist, cover art, and release info with confidence scores

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2";
const ITUNES_BASE = "https://itunes.apple.com/search";
const COVERART_BASE = "https://coverartarchive.org/release";

async function fetchJson(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "album-tracker-app (personal project)" },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { ok: res.ok, status: res.status, json, rawText: text.slice(0, 500) };
  } catch (err) {
    return { ok: false, status: 0, json: null, rawText: String(err) };
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ") // remove parenthetical notes like (Deluxe Edition)
    .replace(/\[.*?\]/g, " ") // remove bracketed notes
    .replace(/remaster/gi, "")
    .replace(/reissue/gi, "")
    .replace(/edition/gi, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Levenshtein distance for fuzzy matching
function editDistance(a, b) {
  const memo = {};
  const key = `${a}|${b}`;
  if (memo[key]) return memo[key];

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const result =
    a[0] === b[0]
      ? editDistance(a.slice(1), b.slice(1))
      : 1 +
        Math.min(
          editDistance(a.slice(1), b),
          editDistance(a, b.slice(1)),
          editDistance(a.slice(1), b.slice(1))
        );

  memo[key] = result;
  return result;
}

// Calculate similarity (0-1) based on edit distance
function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  if (longer.length === 0) return 1;
  return 1 - editDistance(a, b) / longer.length;
}

// Search MusicBrainz with strict artist/album matching
async function searchMusicBrainz(artist, album) {
  const normArtist = normalize(artist);
  const normAlbum = normalize(album);

  // Try artist + album query first
  const query = `${artist} ${album}`;
  const url = `${MUSICBRAINZ_BASE}/release?query=${encodeURIComponent(query)}&limit=25&fmt=json`;
  const res = await fetchJson(url, 8000);

  if (!res.ok || !res.json?.releases) return null;

  let best = null;
  let bestScore = 0;

  for (const release of res.json.releases) {
    const releaseArtists = release["artist-credit"]
      ?.map((ac) => normalize(ac.name))
      .join(" ");
    const releaseName = normalize(release.title);

    // Both artist AND album must match reasonably well
    const artistSim = similarity(normArtist, releaseArtists || "");
    const albumSim = similarity(normAlbum, releaseName);

    // Require high confidence on both sides
    if (artistSim >= 0.75 && albumSim >= 0.75) {
      // Weight by release type: prefer "Album" and "EP" over "Single"
      let typeBonus = 1;
      if (release["release-group"]?."primary-type" === "Album") typeBonus = 1.2;
      if (release["release-group"]?."primary-type" === "EP") typeBonus = 1.1;

      // Recent releases are more likely correct
      const year = parseInt(release["release-events"]?.[0]?.date?.split("-")[0]);
      const ageBonus = year && year >= 2000 ? 1 : 0.9;

      const score = (artistSim + albumSim) / 2 * typeBonus * ageBonus;
      if (score > bestScore) {
        bestScore = score;
        best = release;
      }
    }
  }

  return best;
}

// Get full tracklist from MusicBrainz release
async function getMusicBrainzTracklist(releaseId) {
  const url = `${MUSICBRAINZ_BASE}/release/${releaseId}?inc=recordings+artists&fmt=json`;
  const res = await fetchJson(url, 8000);

  if (!res.ok || !res.json) return null;

  const tracks = [];
  for (const medium of res.json.media || []) {
    for (const track of medium.tracks || []) {
      const recording = track.recording || {};
      tracks.push({
        title: recording.title || track.title || "Unknown",
        artist:
          recording["artist-credit"]?.map((ac) => ac.name).join(", ") ||
          "Unknown",
        duration: recording.length || null,
      });
    }
  }

  return tracks.length > 0 ? tracks : null;
}

// Fallback: iTunes for cover art and verification
async function searchItunes(artist, album) {
  const query = `${artist} ${album}`;
  const url = `${ITUNES_BASE}?term=${encodeURIComponent(query)}&type=album&limit=15`;
  const res = await fetchJson(url, 8000);

  if (!res.ok || !res.json?.results) return null;

  const normArtist = normalize(artist);
  const normAlbum = normalize(album);

  let best = null;
  let bestScore = 0;

  for (const result of res.json.results) {
    const artistSim = similarity(normArtist, normalize(result.artistName));
    const albumSim = similarity(normAlbum, normalize(result.collectionName));

    if (artistSim >= 0.75 && albumSim >= 0.75) {
      const score = (artistSim + albumSim) / 2;
      if (score > bestScore) {
        bestScore = score;
        best = result;
      }
    }
  }

  return best;
}

export default async function handler(req, res) {
  const { artist, album, debug } = req.query;

  if (!artist || !album) {
    res.status(400).json({ error: "artist and album query params required" });
    return;
  }

  const trace = { steps: [] };

  try {
    let mbRelease = null;
    let itunesResult = null;
    let tracklist = null;
    let coverArt = null;
    let releaseYear = null;

    // Step 1: MusicBrainz (primary, most reliable)
    trace.steps.push({ step: "MusicBrainz search", status: "in_progress" });
    mbRelease = await searchMusicBrainz(artist, album);

    if (mbRelease) {
      trace.steps[trace.steps.length - 1] = {
        step: "MusicBrainz search",
        status: "success",
        releaseId: mbRelease.id,
        title: mbRelease.title,
      };

      // Fetch tracklist
      trace.steps.push({ step: "Fetch MusicBrainz tracklist", status: "in_progress" });
      tracklist = await getMusicBrainzTracklist(mbRelease.id);
      if (tracklist) {
        trace.steps[trace.steps.length - 1].status = "success";
        trace.steps[trace.steps.length - 1].trackCount = tracklist.length;
      } else {
        trace.steps[trace.steps.length - 1].status = "failed";
      }

      // Try CoverArtArchive for cover
      const caUrl = `${COVERART_BASE}/${mbRelease.id}/front-500.jpg`;
      const caRes = await fetch(caUrl, { method: "HEAD" });
      if (caRes.ok) {
        coverArt = `${COVERART_BASE}/${mbRelease.id}/front`;
      }

      releaseYear = mbRelease["release-events"]?.[0]?.date?.split("-")[0] || null;
    } else {
      trace.steps[trace.steps.length - 1].status = "no_match";
    }

    // Step 2: iTunes fallback for cover art and validation
    if (!coverArt) {
      trace.steps.push({ step: "iTunes fallback", status: "in_progress" });
      itunesResult = await searchItunes(artist, album);
      if (itunesResult) {
        trace.steps[trace.steps.length - 1].status = "success";
        coverArt = itunesResult.artworkUrl600 || itunesResult.artworkUrl100;
        if (!releaseYear) {
          releaseYear = itunesResult.releaseDate?.split("-")[0] || null;
        }
      } else {
        trace.steps[trace.steps.length - 1].status = "no_match";
      }
    }

    const result = {
      success: !!(mbRelease || itunesResult),
      artist,
      album,
      coverArt: coverArt || null,
      tracklist: tracklist || null,
      releaseYear: releaseYear || null,
      confidence: mbRelease ? "high" : itunesResult ? "medium" : "low",
    };

    if (debug) {
      result.debug = trace;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Album lookup failed:", err, trace);
    res.status(200).json({
      success: false,
      error: "lookup_failed",
      ...(debug ? { debug: trace, exception: String(err) } : {}),
    });
  }
}
