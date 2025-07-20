import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import IProduct from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await IProduct.find({});
    res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await IProduct.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      next(new BadRequestError('Продукт с таким названием уже существует'));
    } else if (err instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных'));
    } else {
      next(err);
    }
  }
};
