// api/critic-score.js
//
// Server-side lookup of an album's Album of the Year (AOTY) critic score.
// This runs on Vercel as a serverless function, not in the browser, because
// AOTY blocks direct browser requests (bot protection + no CORS headers).
//
// AOTY has no official API. This uses a free, community-run unofficial
// wrapper (https://github.com/edideaur/aoty-api). That project moved its
// production host from aoty.prigoana.com to aoty.prigoana.pw — the old
// .com host is kept here only as a fallback in case .pw ever goes down.
// This endpoint can also break if AOTY changes its site — the frontend
// always has a manual-entry fallback for that reason.

const BASES = ["https://aoty.prigoana.pw", "https://aoty.prigoana.com"];

async function fetchJson(url) {
  try {
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
  } catch (err) {
    // network-level failure (DNS, timeout, host down, etc.)
    return { ok: false, status: 0, json: null, rawText: String(err) };
  }
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
    albumData.criticScore ??
    albumData.critic_score ??
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

function candidatesFrom(searchData) {
  return Array.isArray(searchData?.albums)
    ? searchData.albums
    : Array.isArray(searchData?.results)
    ? searchData.results
    : Array.isArray(searchData)
    ? searchData
    : [];
}

export default async function handler(req, res) {
  const { artist, album, debug } = req.query;

  if (!artist || !album) {
    res.status(400).json({ error: "artist and album query params are required" });
    return;
  }

  const trace = { bases: [] };

  try {
    let match = null;
    let usedBase = null;

    // Try each known host in order. Move on to the next one only if this
    // host is genuinely unreachable/broken (network error, bad JSON) — not
    // just because it found no match, since "no match" can be a correct
    // answer for an obscure album.
    for (const base of BASES) {
      const searchUrl = `${base}/search/albums?q=${encodeURIComponent(`${artist} ${album}`)}`;
      const searchRes = await fetchJson(searchUrl);
      trace.bases.push({ base, url: searchUrl, status: searchRes.status, ok: searchRes.ok, body: searchRes.json ?? searchRes.rawText });

      const hostIsUp = searchRes.status !== 0 && searchRes.json !== null;
      if (!hostIsUp) continue; // this host is down/broken — try the next one

      usedBase = base;
      const candidates = candidatesFrom(searchRes.json);
      match = pickBestMatch(artist, album, candidates);
      break; // host responded validly — trust its (possibly null) result, don't also query the fallback
    }

    trace.matchedCandidate = match || null;

    let score = null;
    let aotyUrl = match?.url || null;

    if (match?.url) {
      // The search result itself already carries a criticScore field — use
      // that as a baseline in case the detail lookup below fails for any
      // reason (rate limiting, a scraping hiccup on AOTY's end, etc).
      score = extractCriticScore(match);

      let slug = match.url;
      try {
        slug = new URL(match.url).pathname; // e.g. /album/29250-kendrick-lamar-to-pimp-a-butterfly.php
      } catch {
        // leave as-is if it wasn't a full URL
      }
      const bySlugUrl = `${usedBase}/album?slug=${encodeURIComponent(slug)}&minimal=true`;
      const bySlugRes = await fetchJson(bySlugUrl);
      trace.bySlug = { url: bySlugUrl, status: bySlugRes.status, ok: bySlugRes.ok, body: bySlugRes.json ?? bySlugRes.rawText };

      const detailScore = extractCriticScore(bySlugRes.json);
      if (detailScore != null) score = detailScore; // prefer the more detailed lookup when it has one
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
