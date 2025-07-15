import { Document } from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

export default IProduct;

export interface IOrder {
  items: string[],
  total: number,
  payment: string,
  email: string,
  phone: string,
  address: string,
}