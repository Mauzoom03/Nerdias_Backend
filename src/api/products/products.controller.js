
const User = require('../users/users.model');
const Product = require('./products.model');

const getProducts = async (req, res, next) => {
    try {
      const products = await Product.find();
       if (products.length === 0) {
         return res.status(404).json({ message: "No products found" });
       }
        res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);

        return next(error);
    }
};

const getFilteredProducts = async (req, res) => {
  const { type, subtype } = req.query;

  if (!type || !subtype) {
    return res.status(400).send("Bad Request: Missing type or subtype");
  }

  try {
    console.log("Consulta recibida:", { type, subtype });
    const products = await Product.find({ type, subtype });
    console.log("Productos encontrados:", products);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};





const deleteProducts = async (req, res, next) => {
    const productId = req.params.productId
        ;

    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        res.status(200).json({message: 'Proyecto eliminado correctamente', data: productId})
    } catch (error) {
        return next(error)
  }

}
  


  const createProduct = async (req, res, next) => {
    const { name, description, link, image, type, subtype } = req.body;

    try {
      const product = await Product.create({ name, description, link, image, type, subtype });
      res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  };



module.exports = {
  getProducts,
  deleteProducts,
  createProduct,
  getFilteredProducts
}