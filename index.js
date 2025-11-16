require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const feeds = require("./data");
const Parser = require("rss-parser");
const webpush = require("web-push");

const app = express();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:sen@mail.com",
  publicVapidKey,
  privateVapidKey
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const parser = new Parser({
  customFields: {
    item: [
      ["image", "image"],
      ["enclosure", "enclosure"],
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

app.get("/", async (req, res) => {
  const results = [];

  for (const feed of feeds) {
    try {
      const data = await parser.parseURL(feed.url);
      if (!data || !data.items) continue;

      const items = data.items.slice(0, 30).map((item) => {
        let image =
          item.image ||
          item.enclosure?.url ||
          item["media:content"]?.$?.url ||
          item["media:thumbnail"]?.$?.url ||
          "";

        if (!image && item.description) {
          const imgMatch = item.description.match(/<img.*?src="(.*?)"/);
          if (imgMatch) image = imgMatch[1];
        }

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet || item.description || "",
          image,
        };
      });

      results.push({ name: feed.name, items });
    } catch (err) {
      console.warn(`RSS alınamadı: ${feed.name}`, err.message);
    }
  }

  res.render("news", { title: "RSS Haberler", feeds: results, publicVapidKey });
});

app.get("/index", (req, res) => {
  res.render("index")
})

// Push abonelik endpointi
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  console.log("Yeni abonelik:", subscription);
  res.status(201).json({});
});

// 10 saniye gecikmeli test push
app.post("/send-test", async (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({
    title: "Test Bildirimi",
    body: "10 saniye sonra gelen bildirim!"
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bildirim gönderilemedi" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Sunucu http://localhost:4000 adresinde çalışıyor");
});
