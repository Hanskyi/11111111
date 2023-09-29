import express from 'express';
import cors from 'cors';
import productsRouter from "./routers/products";
import * as mongoose from "mongoose";

import usersRouter from "./routers/users";
import categoriesRouter from "./routers/categories";
import config from "./config";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  // ToDo: Not working
  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));