const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const BEARER_TOKEN = process.env.BEARER_TOKEN;

let likedKeywords = [];

app.get("/api/posts", async (req, res) => {
  try {
    let query = likedKeywords.length > 0 
      ? likedKeywords[likedKeywords.length - 1] 
      : "trending";

    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=10`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/like", (req, res) => {
  const { text } = req.body;
  likedKeywords.push(text.split(" ")[0]); // simple keyword logic
  res.json({ success: true });
});

app.post("/api/dislike", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
