require("dotenv").config();

const configNewsApi = {
  newsApiKey: process.env.NEWS_API_KEY,
  newsApiUrl: "https://newsapi.org/v2/everything",
};

module.exports = configNewsApi;