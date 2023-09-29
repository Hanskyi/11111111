import mongoose from "mongoose";
import Category from "./Category";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate:{
      validator: async (value: mongoose.Types.ObjectId) => await Category.findById(value),
      message: 'Category does not exist!',
    }
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  image: String,
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;

