const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    link: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true  },
    subtype: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },

  { timestamps: true }
);

const Product = mongoose.model('products', productSchema);
module.exports = Product;
