const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  link: { type: String, trim: true, required: true },
  image: { type: String, trim: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model("news", newsSchema);
module.exports = News;
