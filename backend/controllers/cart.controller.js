
import Product from "../model/product.model.js";
import User from "../model/user.model.js"; // Assuming there's a User model..

export const getCartItems = async (req, res) => {
  try {
    // Check if the user and their cart items are available
    if (!req.user || !req.user.cartItems) {
      return res.status(400).json({ message: "User cart is empty or not found." });
    }

    // Fetching products based on user cartItem IDs
    const UserProducts = await Product.find({
      _id: { $in: req.user.cartItems.map(item => item.id) }, // Mapping IDs to ensure we fetch the correct products
    });

    // If no products are found, return a 404 error
    if (!UserProducts || UserProducts.length === 0) {
      return res.status(404).json({ message: "No products found in the cart." });
    }

    // Map each product to include its quantity
    const UserCartItems = UserProducts.map((product) => {
      // Find the cart item corresponding to the product
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      // Return the product with its quantity
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(UserCartItems); // Send the final array of cart items
  } catch (error) {
    // Log any errors and send a server error response
    console.error("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
	try {
		const { productID } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.id === productID);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push(productID);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productID } = req.body; // Extract the product ID from the request body
    const user = req.user; // Get the authenticated user

    if (!productID) {
      // If no productID is provided, empty the user's entire cart
      user.cartItems = [];
    } else {
      // If a productID is provided, remove that specific product from the cart
      const productExists = user.cartItems.some(item => item.id === productID);
      
      // If the product doesn't exist in the cart, send a 404 error
      if (!productExists) {
        return res.status(404).json({ message: "Product not found in cart." });
      }

      // Filter out the product from the cart
      user.cartItems = user.cartItems.filter((item) => item.id !== productID);
    }

    // Save the updated user cart to the database
    await user.save();
    res.json(user.cartItems); // Return the updated cart items
  } catch (error) {
    // Log any errors and send a server error response
    console.error("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productID } = req.params; // Extract productID from URL params
    const { quantity } = req.body; // Extract the new quantity from the request body

    // Check if the quantity is valid (it should not be negative)
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative." });
    }

    const user = req.user; // Get the authenticated user

    // Find the cart item corresponding to the productID
    const existingItem = user.cartItems.find((item) => item.id === productID);

    if (!existingItem) {
      // If the product is not found in the cart, return a 404 error
      return res.status(404).json({ message: "Product not found in cart." });
    }

    // If quantity is set to 0, remove the product from the cart
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productID);
    } else {
      // Otherwise, update the product's quantity
      existingItem.quantity = quantity;
    }

    // Save the updated user cart to the database
    await user.save();
    res.json(user.cartItems); // Return the updated cart items
  } catch (error) {
    // Log any errors and send a server error response
    console.error("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//!------old code ------
// export const getCartItems = async (req, res) => {
//   try {
//     //getting the products which has the id same as user cartItems id. In simple words getting the products from the particular user db.
//     const UserProducts = await Product.find({
//       _id: { $in: req.user.cartItems },
//     });

//     //adding quantity for each product..
//     const UserCartItems = UserProducts.map((product) => {
//       //item will contain the array of object each object [{quantity,product}]
//       const item = req.user.cartItems.find(
//         (cartItem) => cartItem.id === product.id
//       );

//       return { ...product.toJSON(), quantity: item.quantity };
//     });
//     res.json(UserCartItems);
//   } catch (error) {
//     console.log("Error in getCartProducts controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const addToCart = async (req, res) => {
//   try {
//     const { productID } = req.body;
//     //user data came from the middleware [protected route]
//     const user = req.user;

//     //check if the product is already available in the userCart.
//     const existingItem = user.cartItems.find((item) => item.id === productID);

//     //if already present than just add +1.
//     if (existingItem) {
//       existingItem += 1;
//     }
//     //if not then add it to the user cart.
//     else {
//       user.cartItems.push(productID);
//     }
//     //save into the database.
//     await user.save();
//     res.json(user.cartItems);
//   } catch (error) {
//     console.log("Error in addToCart controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const removeAllFromCart = async (req, res) => {
//   try {
//     const { productID } = req.body;
//     //getting user from the protectedRoute middleware.
//     const user = req.user;
//     //if productID is not avilable the empty the user cartItem.
//     if (!productID) {
//       user.cartItems = [];
//     }
//     //if product is available then remove the product from the userCart.
//     else {
//       user.cartItems = user.cartItems.filter((item) => item.id !== productID); //.id is the string version of objectId.
//     }
//     //save the updated user data.
//     await user.save();
//     res.json(user.cartItems);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const updateQuantity = async (req, res) => {
//   try {
//     //getting id from url params.
//     const { id: productID } = req.params;

//     //getting quantity from request body.
//     const { quantity } = req.body;

//     //getting user from the protectedRoute middleware.
//     const user = req.user;

//     //getting the first item which matched with the productID in user cartItem.
//     const existingItems = user.cartItems.find((item) => item.id === productID);

//     if (existingItems) {
//       if (quantity === 0) {
//         user.cartItems = user.cartItems.filter((item) => item.id !== productID);
//         await user.save();
//         return res.json(user.cartItems);
//       }
//       existingItems.quantity = quantity;
//       await user.save();
//       res.json(user.cartItems);
//     } else {
//       res.status(404).json({ message: "Product not found" });
//     }
//   } catch (error) {
//     console.log("Error in updateQuantity controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

