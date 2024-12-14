import mongoose from "mongoose"; 

//const userSchema = new mongoose.Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"], 
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product",productSchema);

export default Product;


//* {
//*   "_id": "6483b2cd1234567890abcdef",
//*   "name": "Wireless Headphones",
//*   "description": "High-quality wireless headphones with noise cancellation.",
//*   "price": 129.99,
//*   "image": "https://example.com/images/headphones.jpg",
//*   "category": "Electronics",
//*   "isFeatured": true,
//*   "createdAt": "2024-12-06T12:00:00.000Z",
//*   "updatedAt": "2024-12-06T12:00:00.000Z"
//* }
