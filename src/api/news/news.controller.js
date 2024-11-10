const { fetchNews } = require("../../utils/newsApi/newsApiService");
const User = require("../users/users.model");
const News = require("./news.model");

const getNews = async (req, res, next) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    return next(error);
  }
};

const deleteNews = async (req, res, next) => {
  const NewsId = req.params.newsId;
  try {
    const news = await News.findByIdAndDelete(newsId);

    if (!news) {
      return res.status(404).json({ message: "Noticia no encontrada." });
    }

    res
      .status(200)
      .json({ message: "Noticia eliminado correctamente", data: newsId });
  } catch (error) {
    return next(error);
  }
};

const createNews = async (req, res, next) => {
  const { title, description, link, image } = req.body;

  try {
    const news = await News.create({ title, description, link, image });
    res.status(201).json(news);
  } catch (error) {
    return next(error);
  }
};

const getApiNews = async (req, res) => {
  const query = req.query.q || "artificial intelligence";
  const sortBy = req.query.sortBy || "publishedAt";
  const pageSize = req.query.pageSize || 10;

  try {
    const articles = await fetchNews(query, sortBy, pageSize);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No se encontraron noticias" });
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error al obtener noticias" });
  }
};

module.exports = {
  getNews,
  deleteNews,
  createNews,
  getApiNews,
};
