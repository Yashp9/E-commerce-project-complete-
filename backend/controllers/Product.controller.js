import Product from "../model/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//* This function retrieves featured products, first trying to fetch from Redis for speed.
//* If not found in Redis, it fetches from MongoDB, stores them in Redis for future use, and sends the response.

export const getFeaturedProducts = async (req, res) => {
  try {
    //* Step 1: Attempt to fetch featured products from Redis.
    //* "featured_products" key is case-sensitive.
    let featuredProducts = await redis.get("featured_products");

    //* Step 2: If data exists in Redis, parse the JSON string to an object and send it in the response.
    if (featuredProducts) {
      //* JSON.parse is required because Redis stores data as strings; we need to convert it back to an object.
      return res.json(JSON.parse(featuredProducts));
    }

    //* Step 3: If not found in Redis, fetch featured products from MongoDB.
    //* Use .lean() for better performance by returning plain JavaScript objects.
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    //* Step 4: If MongoDB does not return any products, send an appropriate response.
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(400).json({ message: "No featured products found" });
    }

    //* Step 5: If products are found in MongoDB, store them in Redis for faster access next time.
    //* Corrected Redis key to match the first retrieval key: "featured_products".
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    //* Step 6: Send the fetched products as the response.
    res.json(featuredProducts);
  } catch (error) {
    //* Step 7: Handle errors, log them, and send a 500 server error response.
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

