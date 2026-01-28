import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const GAME_CHANNELS = {
  PUBG: ["UCHIS4ceYnZYpVXO31Fkg5_g", "UCibWZzkjMuzaYd0epLLjRpA"],
  FreeFire: ["UChLeCIE6M49IgW0anxMm4lw", "UCrPezsltlsZZiEkxTE2l39g"],
  Fortnite: ["UCEe2aqK4fgDYTOjkZvTvang"],
  Valorant: ["UC1_PJ9hWfuurTjmcBkNlo4A"],
  COD: ["UCVzejkZ0GVweFmMe8D_4w4A"],
};

const GAME_KEYWORDS = {
  PUBG: ["pubg", "bgmi", "battlegrounds"],
  FreeFire: ["free fire", "ff"],
  Fortnite: ["fortnite"],
  Valorant: ["valorant"],
  COD:["call of duty","cod"],
};

const isoToSeconds = (iso) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return (
    (Number(match?.[1] || 0) * 3600) +
    (Number(match?.[2] || 0) * 60) +
    (Number(match?.[3] || 0))
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
      // 1. Array to hold videos from ALL channels for this game
      let allChannelsVideos = [];

      // 2. Iterate through every channel for the game
      for (const channelId of GAME_CHANNELS[game]) {
        let channelCollected = []; // Store videos just for this specific channel
        let pageToken = null;

        // Fetch up to 10 valid videos per channel (to ensure we get a mix)
        while (channelCollected.length < 10) {
          const searchRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "id",
                channelId,
                maxResults: 20, // Fetch a batch
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

          for (const video of videoRes.data.items) {
             // Stop if we have enough for this specific channel
            if (channelCollected.length >= 10) break;

            const duration = isoToSeconds(video.contentDetails.duration);
            const title = video.snippet.title;
            const description = video.snippet.description;

            const isValid =
              duration > 150 && 
              video.snippet.liveBroadcastContent === "none" && 
              containsGameKeyword(title + " " + description, game);

            if (isValid) {
              channelCollected.push(video);
            }
          }

          // If no next page, stop fetching for this channel
          if (!pageToken) break; 
        }

        // Add this channel's videos to the main game array
        allChannelsVideos = [...allChannelsVideos, ...channelCollected];
      }

      // 3. MERGE & SORT: Sort all videos by date (newest first)
      allChannelsVideos.sort((a, b) => {
        return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
      });

      // 4. SLICE: Take the top 16 from the combined list
      videosByGame[game] = allChannelsVideos.slice(0, 16);
    }

    res.json(videosByGame);
  } catch (err) {
    console.error("ARENA ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Arena fetch failed" });
  }
};