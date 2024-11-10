const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const coursesSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  academy: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  link: { type: String, trim: true, required: true },
  image: { type: String, trim: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Courses = mongoose.model("courses", coursesSchema);
module.exports = Courses;