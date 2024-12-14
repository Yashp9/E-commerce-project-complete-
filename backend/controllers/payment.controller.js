
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    // Extracting products and couponCode from the request body.
    const { products, couponCode } = req.body;

    // Validating if 'products' is an array and contains items.
    if (!Array.isArray(products) || products.length === 0) {
      // Respond with a 400 status code if products are invalid or empty.
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0; // Variable to keep track of the total payment amount in cents.

    // Creating line items in the format required by Stripe.
    const lineItems = products.map((product) => {
      // Converting the product price from dollars to cents.
      const amount = Math.round(product.price * 100);

      // Adding the total price for the product to the overall amount.
      totalAmount += amount * product.quantity;

      // Returning each product in Stripe's expected line item format.
      return {
        price_data: {
          currency: "usd", // Currency of the payment (USD).
          product_data: {
            name: product.name, // Name of the product.
            images: [product.image], // Array of image URLs for the product.
          },
          unit_amount: amount, // Price of a single unit in cents.
        },
        quantity: product.quantity || 1, // Quantity of the product.
      };
    });

    let coupon = null; // Placeholder for a coupon if applicable.

    // If a coupon code is provided, check its validity in the database.
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode, // Matching the coupon code.
        userID: req.user._id, // Ensuring the coupon belongs to the user.
        isActive: true, // Ensuring the coupon is active.
      });

      // If a valid coupon is found, apply its discount.
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100 // Calculate the discount amount.
        );
      }
    }

    // Creating a Stripe checkout session with the provided details.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Accepting card payments.
      line_items: lineItems, // Passing the line items for the payment.
      mode: "payment", // Setting the payment mode to "payment".
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL after successful payment.
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`, // Redirect URL if payment is canceled.

      // Adding discounts if a coupon is applied.
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],

      // Attaching metadata for reference in the session.
      metadata: {
        userID: req.user._id.toString(), // Storing the user ID.
        couponCode: couponCode || "", // Storing the coupon code if provided.
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id, // Product ID.
            quantity: p.quantity, // Quantity of the product.
            price: p.price, // Price of the product.
          }))
        ),
      },
    });

    // If the total amount exceeds $200 (20,000 cents), create a new coupon for the user.
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user.id);
    }

    // Responding with the created session ID and total amount in dollars.
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    // Logging any errors and responding with a 500 status code.
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

// Controller function to handle successful checkouts.
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionID } = req.body; // Extracting the session ID from the request body.

    // Retrieving the checkout session details from Stripe.
    const session = await stripe.checkout.sessions.retrieve(sessionID);

    // Checking if the payment was successful.
    if (session.payment_status === "paid") {
      // If a coupon code was used, deactivate it in the database.
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode, // Matching the coupon code.
            userID: session.metadata.userID, // Matching the user ID.
          },
          {
            isActive: false, // Marking the coupon as inactive.
          }
        );
      }
    }

    // Parsing the products metadata stored in the session.
    const products = JSON.parse(session.metadata.products);

    // Creating a new order in the database.
    const newOrder = new Order({
      user: session.metadata.userID, // User ID for the order.
      products: products.map((product) => ({
        product: product.id, // Product ID.
        quantity: product.quantity, // Product quantity.
        price: product.price, // Product price.
      })),
      totalAmount: session.amount_total / 100, // Converting total amount from cents to dollars.
      stripeSessionId: sessionID, // Storing the Stripe session ID.
    });

    await newOrder.save(); // Saving the new order to the database.

    // Responding with a success message and the created order ID.
    res.status(200).json({
      success: true,
      message:
        "Payment successful, order created, and coupon deactivated if used.",
      orderId: newOrder._id,
    });
  } catch (error) {
    // Logging any errors and responding with a 500 status code.
    console.error("Error processing successful checkout:", error);
    res
      .status(500)
      .json({
        message: "Error processing successful checkout",
        error: error.message,
      });
  }
};

// Function to create a new coupon for a user.
async function createNewCoupon(userID) {
  // Deleting any existing coupon for the user.
  await Coupon.findOneAndDelete({ userID });

  // Generating a new coupon with a 10% discount and a 30-day expiration.
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // Generating a unique code.
    discountPercentage: 10, // Setting a 10% discount.
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiring in 30 days.
    userID: userID, // Associating the coupon with the user.
  });

  await newCoupon.save(); // Saving the new coupon to the database.
  return newCoupon; // Returning the created coupon.
}

// Function to create a Stripe coupon with a given discount percentage.
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage, // Setting the discount percentage.
    duration: "once", // Coupon is valid for a single use.
  });

  return coupon.id; // Returning the Stripe coupon ID.
}
