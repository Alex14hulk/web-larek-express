import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; 
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';
import Product from '../models/product';
import { IOrder } from 'types/interface';
import { orderSchema } from 'middlewares/validations';

async function processCreateOrder(orderData: IOrder) {
  const { items } = orderData;

  const productIds = items.map((item: string) =>
    new mongoose.Types.ObjectId(item)
  );

  const products = await Product.find({ _id: { $in: productIds } }).exec();

  if (products.length !== productIds.length) {
    throw new BadRequestError('Ошибка в данных продукта: Не все продукты доступны');
  }

  const productSum = products.reduce((sum, currentProduct) => sum + currentProduct.price!, 0); 

  if (orderData.total !== productSum) {
    throw new BadRequestError('Общая сумма заказа неверна');
  }

  return {
    id: uuidv4(),
    total: productSum,
  };
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = orderSchema.validate(req.body as IOrder);
    if (error) {
      throw new BadRequestError(`Ошибка проверки: ${error.message}`);
    }

    const result = await processCreateOrder(value);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      if (err instanceof BadRequestError) {
        return next(err);
      }
      return next(new ServerError(`Ошибка сервера: ${err.message}`));
    } else {
      return next(new ServerError('Ошибка сервера'));
    }
  }
};