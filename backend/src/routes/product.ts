import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product';
import { validateProduct } from '../middlewares/validations';

const routerProduct = Router();

routerProduct.get('/product', getProducts);
routerProduct.post('/product', validateProduct, createProduct);

export default routerProduct;
