import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import ConflictError from 'errors/conflict-error';
import BadRequestError from 'errors/bad-request-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ items: products, total: products.length });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;

  try {
    const newProduct = await Product.create({ title, image, category, description, price });
    res.status(201).json({ data: newProduct });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('E11000')) {
        return next(new ConflictError('Продукт с таким названием уже существует'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`Ошибка валидации: ${err.message}`));
      }
      
      return next(err);
    }
    
    return next(new Error('Возникла непредвиденная ошибка.'));
  }
};