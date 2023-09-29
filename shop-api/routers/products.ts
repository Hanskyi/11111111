import express from 'express';
import {IProduct} from "../type";
import {imagesUpload} from "../multer";
import Product from "../models/Product";
import fs from 'fs';
import config from "../config";
import mongoose from "mongoose";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'title description');
    return res.send(products);
  } catch {
    return res.sendStatus(500);
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.sendStatus(404);
    }

    return res.send(product);
  } catch {
    return res.sendStatus(500);
  }
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const productData: IProduct = {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.filename : null,
    };

    const product = new Product(productData);
    await product.save();

    return res.send(product);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError){
      return res.status(400).send(error);
    }
    next(error);
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send('Not Found!');
    }

    await Product.findByIdAndRemove(id);

    if (product.image) {
      const filePath = config.publicPath + '/' + product.image;
      fs.unlinkSync(filePath);
    }

    res.send('Deleted');
  } catch (e) {
    res.status(500).send('error');
  }
});

export default productsRouter;