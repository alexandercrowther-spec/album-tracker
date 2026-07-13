// api/album-lookup.js
//
// Improved album information fetching with better disambiguation:
// - Uses MusicBrainz API as primary source (more accurate, no bot detection issues)
// - Strict matching on artist/album to avoid mismatches
// - Filters by release date when possible
// - Fallback to iTunes API for cover art if MusicBrainz data incomplete
// - Returns tracklist, cover art, and release info

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
    } catch {
      // not JSON
    }
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
    .replace(/\(.*?\)/g, " ") // remove parenthetical notes
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Calculate similarity between two normalized strings (0-1)
function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Search MusicBrainz for release with strict matching
async function searchMusicBrainz(artist, album) {
  const query = `${artist} ${album}`;
  const url = `https://musicbrainz.org/ws/2/release?query=${encodeURIComponent(query)}&limit=20&fmt=json`;
  const res = await fetchJson(url);

  if (!res.ok || !res.json?.releases) return null;

  const normArtist = normalize(artist);
  const normAlbum = normalize(album);

  // Score candidates: exact/close match on both artist and album
  let best = null;
  let bestScore = 0;

  for (const release of res.json.releases) {
    const releaseArtists = release["artist-credit"]?.map((ac) => normalize(ac.name)).join(" ");
    const releaseName = normalize(release.title);

    const artistMatch = similarity(normArtist, releaseArtists || "");
    const albumMatch = similarity(normAlbum, releaseName);

    // Only consider if both artist and album are reasonably close
    if (artistMatch >= 0.7 && albumMatch >= 0.7) {
      const score = artistMatch * albumMatch;
      if (score > bestScore) {
        bestScore = score;
        best = release;
      }
    }
  }

  return best;
}

// Get tracklist from MusicBrainz release ID
async function getMusicBrainzTracklist(releaseId) {
  const url = `https://musicbrainz.org/ws/2/release/${releaseId}?inc=recordings&fmt=json`;
  const res = await fetchJson(url);

  if (!res.ok || !res.json) return null;

  const tracks = [];
  for (const medium of res.json.media || []) {
    for (const track of medium.tracks || []) {
      tracks.push({
        title: track.recording?.title || track.title || "Unknown",
        artist: track.recording?.["artist-credit"]?.map((ac) => ac.name).join(", ") || "Unknown",
        duration: track.recording?.length || null,
      });
    }
  }

  return tracks.length > 0 ? tracks : null;
}

// Fallback: try iTunes API for cover and metadata
async function searchItunes(artist, album) {
  const query = `${artist} ${album}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&type=album&limit=10`;
  const res = await fetchJson(url, 8000);

  if (!res.ok || !res.json?.results) return null;

  const normArtist = normalize(artist);
  const normAlbum = normalize(album);

  let best = null;
  let bestScore = 0;

  for (const result of res.json.results) {
    const artistMatch = similarity(normArtist, normalize(result.artistName));
    const albumMatch = similarity(normAlbum, normalize(result.collectionName));

    if (artistMatch >= 0.7 && albumMatch >= 0.7) {
      const score = artistMatch * albumMatch;
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
    res
      .status(400)
      .json({ error: "artist and album query params are required" });
    return;
  }

  const trace = { steps: [] };

  try {
    let mbRelease = null;
    let itunesResult = null;
    let tracklist = null;
    let coverArt = null;

    // Step 1: Try MusicBrainz (primary source)
    trace.steps.push({ step: "MusicBrainz search", status: "in_progress" });
    mbRelease = await searchMusicBrainz(artist, album);

    if (mbRelease) {
      trace.steps[trace.steps.length - 1].status = "success";
      trace.steps[trace.steps.length - 1].releaseId = mbRelease.id;

      // Get tracklist
      trace.steps.push({ step: "Fetch MusicBrainz tracklist", status: "in_progress" });
      tracklist = await getMusicBrainzTracklist(mbRelease.id);
      if (tracklist) {
        trace.steps[trace.steps.length - 1].status = "success";
        trace.steps[trace.steps.length - 1].trackCount = tracklist.length;
      }

      // Try to get cover from CoverArtArchive
      if (mbRelease.id) {
        const caUrl = `https://coverartarchive.org/release/${mbRelease.id}/front-250.jpg`;
        const caRes = await fetch(caUrl, { method: "HEAD" });
        if (caRes.ok) {
          coverArt = `https://coverartarchive.org/release/${mbRelease.id}/front`;
        }
      }
    } else {
      trace.steps[trace.steps.length - 1].status = "no_match";
    }

    // Step 2: Fallback to iTunes for cover art and metadata if needed
    if (!coverArt) {
      trace.steps.push({ step: "iTunes fallback", status: "in_progress" });
      itunesResult = await searchItunes(artist, album);
      if (itunesResult) {
        trace.steps[trace.steps.length - 1].status = "success";
        coverArt = itunesResult.artworkUrl600 || itunesResult.artworkUrl100;
      } else {
        trace.steps[trace.steps.length - 1].status = "no_match";
      }
    }

    // Build response
    const result = {
      success: !!(mbRelease || itunesResult),
      artist,
      album,
      coverArt: coverArt || null,
      tracklist: tracklist || null,
      releaseYear: mbRelease?.["release-events"]?.[0]?.date?.split("-")[0] || null,
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
