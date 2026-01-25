import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const GAME_CHANNELS = {
  PUBG: ["UCZOW4EOIU_jwHhybPh6q0LQ"],
  FreeFire: ["UCP7WsVTkbPP9EaIFIUgwngg", "UCrPezsltlsZZiEkxTE2l39g"],
  Minecraft: ["UCiEnPge5PyrMQXWTBsjkA5A"],
};

const GAME_KEYWORDS = {
  PUBG: ["pubg", "bgmi", "battlegrounds"],
  FreeFire: ["free fire", "ff"],
  Minecraft: ["minecraft"],
};

/* ISO duration → seconds */
const isoToSeconds = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return (
    (Number(match?.[1] || 0) * 3600) +
    (Number(match?.[2] || 0) * 60) +
    Number(match?.[3] || 0)
  );
};

const containsGameKeyword = (text, game) => {
  const keywords = GAME_KEYWORDS[game];
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

export const getArenaVideos = async (req, res) => {
  try {
    const videosByGame = {};

    for (const game in GAME_CHANNELS) {
      let collected = [];

      for (const channelId of GAME_CHANNELS[game]) {
        let pageToken = null;

        while (collected.length < 16) {
          /* 1️⃣ Fetch latest videos */
          const searchRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "id",
                channelId,
                maxResults: 50,
                pageToken,
                type: "video",
                order: "date",
                key: YOUTUBE_API_KEY,
              },
            }
          );

          pageToken = searchRes.data.nextPageToken;

          const videoIds = searchRes.data.items
            .map((v) => v.id?.videoId)
            .filter(Boolean)
            .join(",");

          if (!videoIds) break;

          /* 2️⃣ Get full details */
          const videoRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part: "snippet,statistics,contentDetails",
                id: videoIds,
                key: YOUTUBE_API_KEY,
              },
            }
          );

          /* 3️⃣ FILTER STRICTLY */
          for (const video of videoRes.data.items) {
            if (collected.length >= 16) break;

            const duration = isoToSeconds(video.contentDetails.duration);
            const title = video.snippet.title;
            const description = video.snippet.description;

            const isValid =
              duration > 150 && // ❌ shorts
              video.snippet.liveBroadcastContent === "none" && // ❌ live
              containsGameKeyword(title + " " + description, game); // ❌ other games

            if (isValid) {
              collected.push(video);
            }
          }

          if (!pageToken) break;
        }
      }

      videosByGame[game] = collected;
    }

    res.json(videosByGame);
  } 
  
  catch (err) {
    console.error("ARENA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Arena fetch failed" });
  }
};
