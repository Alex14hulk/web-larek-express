import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { orderRouteValidator } from '../middlewares/validations';

const routerOrder = Router();

routerOrder.post('/order',  orderRouteValidator, createOrder);

export default routerOrder;