import { Joi, celebrate, Segments } from 'celebrate';
import IProduct from '../types/interface';
import { IOrder } from '../types/interface';

export const productSchema = Joi.object<IProduct>({
    title: Joi.string().min(3).max(30).required(),
    image: { fileName: Joi.string(), originalName: Joi.string() },
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number(),
  });
  
  export const validateProduct = celebrate({
    [Segments.BODY]: productSchema,
  });

  export const orderSchema = Joi.object<IOrder>({
    items: Joi.array().required(),
    total: Joi.number().required(),
    payment: Joi.equal('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/)
      .required(),
    address: Joi.string().required(),
  });
  
  export const orderRouteValidator = celebrate({
    [Segments.BODY]: orderSchema,
  });