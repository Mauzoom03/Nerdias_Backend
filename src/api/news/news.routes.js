const express = require("express");
const NewsRoutes = express.Router();
const {getNews,deleteNews,createNews,getApiNews} = require("./news.controller");

NewsRoutes.get('/getNews', getNews);
NewsRoutes.post('/createNew', createNews);
NewsRoutes.delete('/deleteNew/:newId', deleteNews);
NewsRoutes.get('/getApiNews', getApiNews);


module.exports = NewsRoutes;
