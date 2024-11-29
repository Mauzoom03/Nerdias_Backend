const axios = require("axios");
const config = require("./configNewsApi");

const validQueries = [
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "data science",
  "Ai",
];

const buildQuery = () => {
  return validQueries.map((term) => encodeURIComponent(term)).join(" OR ");
};

const fetchNews = async (sortBy = "publishedAt", pageSize = 15) => {
  const queryString = buildQuery();

  const url = `https://newsapi.org/v2/everything?q=(${queryString})&sortBy=${sortBy}&pageSize=${pageSize}&language=en`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Api-Key": config.newsApiKey, // Asegúrate de pasar la clave de API correctamente
      },
      timeout: 5000,
    });

    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    throw new Error("Error al obtener noticias");
  }
};

module.exports = {
  fetchNews,
};
