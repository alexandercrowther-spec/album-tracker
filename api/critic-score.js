// api/critic-score.js
//
// Server-side lookup of an album's Album of the Year (AOTY) critic score.
// This runs on Vercel as a serverless function, not in the browser, because
// AOTY blocks direct browser requests (bot protection + no CORS headers).
//
// AOTY has no official API. This uses a free, community-run unofficial
// wrapper (aoty.prigoana.com, https://github.com/edideaur/AOTY-api). That
// means this endpoint can break if that service goes down or AOTY changes
// its site — the frontend always has a manual-entry fallback for that reason.

const BASE = "https://aoty.prigoana.com";

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "album-tracker (personal project)" },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // not JSON — leave json as null, keep raw text for debugging
  }
  return { ok: res.ok, status: res.status, json, rawText: text.slice(0, 500) };
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractCriticScore(albumData) {
  if (!albumData) return null;
  const raw =
    albumData.critic_score ??
    albumData.criticScore ??
    albumData.critic?.score ??
    null;
  if (raw === null || raw === undefined || raw === "NR") return null;
  const num = typeof raw === "string" ? parseFloat(raw) : raw;
  if (typeof num !== "number" || isNaN(num)) return null;
  return Math.round(num); // AOTY critic scores are 0–100 integers
}

// AOTY's search occasionally surfaces mismatched or joke/troll submissions
// (e.g. an album mistagged under the wrong artist, or a title repeated many
// times as a prank). We only trust a result if BOTH the artist and title
// closely match what was requested — an exact title match wins; loose
// substring matches are only accepted if the length is close too, to avoid
// picking a garbage entry that merely "contains" the right words.
function scoreCandidate(requestedArtist, requestedAlbum, candidate) {
  const reqArtist = normalize(requestedArtist);
  const reqTitle = normalize(requestedAlbum);
  const candArtist = normalize(candidate.artist);
  const candTitle = normalize(candidate.title);

  if (!candArtist || !candTitle) return -1;
  const artistMatches = candArtist === reqArtist || candArtist.includes(reqArtist) || reqArtist.includes(candArtist);
  if (!artistMatches) return -1;

  if (candTitle === reqTitle) return 100; // exact match, best case
  const lengthRatio = Math.min(candTitle.length, reqTitle.length) / Math.max(candTitle.length, reqTitle.length);
  const containsMatch = candTitle.includes(reqTitle) || reqTitle.includes(candTitle);
  if (containsMatch && lengthRatio > 0.7) return 50; // close-enough partial match
  return -1; // reject — likely a mismatched/troll entry
}

function pickBestMatch(requestedArtist, requestedAlbum, candidates) {
  let best = null;
  let bestScore = -1;
  for (const c of candidates) {
    const s = scoreCandidate(requestedArtist, requestedAlbum, c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return bestScore >= 0 ? best : null;
}

export default async function handler(req, res) {
  const { artist, album, debug } = req.query;

  if (!artist || !album) {
    res.status(400).json({ error: "artist and album query params are required" });
    return;
  }

  const trace = {};

  try {
    // 1) Search first — more reliable than the "direct" album?artist=&name=
    // endpoint, which has been observed fuzzy-matching to unrelated/troll
    // albums instead of returning no result.
    const searchUrl = `${BASE}/search/albums?q=${encodeURIComponent(`${artist} ${album}`)}`;
    const searchRes = await fetchJson(searchUrl);
    trace.search = { url: searchUrl, status: searchRes.status, ok: searchRes.ok, body: searchRes.json ?? searchRes.rawText };

    const searchData = searchRes.json;
    const candidates = Array.isArray(searchData?.albums)
      ? searchData.albums
      : Array.isArray(searchData?.results)
      ? searchData.results
      : Array.isArray(searchData)
      ? searchData
      : [];

    const match = pickBestMatch(artist, album, candidates);
    trace.matchedCandidate = match || null;

    let score = null;
    let aotyUrl = match?.url || null;

    if (match?.url) {
      // Fetch full detail (search results don't include scores) using the
      // matched album's page path as the slug.
      let slug = match.url;
      try {
        slug = new URL(match.url).pathname; // e.g. /album/29250-kendrick-lamar-to-pimp-a-butterfly.php
      } catch {
        // leave as-is if it wasn't a full URL
      }
      const bySlugUrl = `${BASE}/album?slug=${encodeURIComponent(slug)}&minimal=true`;
      const bySlugRes = await fetchJson(bySlugUrl);
      trace.bySlug = { url: bySlugUrl, status: bySlugRes.status, ok: bySlugRes.ok, body: bySlugRes.json ?? bySlugRes.rawText };
      score = extractCriticScore(bySlugRes.json);
      aotyUrl = bySlugRes.json?.url || match.url;
    }

    res.status(200).json({
      criticScore: score,
      aotyUrl,
      ...(debug ? { debug: trace } : {}),
    });
  } catch (err) {
    console.error("critic-score lookup failed:", err, trace);
    // Never fail hard — the frontend treats null as "not found, enter manually."
    res.status(200).json({
      criticScore: null,
      aotyUrl: null,
      error: "lookup_failed",
      ...(debug ? { debug: trace, exception: String(err) } : {}),
    });
  }
}
