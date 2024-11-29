const ProductRoutes = require('express').Router();
const {getProducts,deleteProducts,createProduct,getFilteredProducts} = require("./products.controller");

ProductRoutes.get('/getProducts', getProducts);
ProductRoutes.post('/createProduct', createProduct);
ProductRoutes.delete('/deleteProducts/:productId', deleteProducts);
ProductRoutes.get('/getFilteredProducts', getFilteredProducts);


module.exports = ProductRoutes;