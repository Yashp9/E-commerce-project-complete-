import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import axios from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";

//creating stripe instance.
const stripePromise = loadStripe("pk_test_51NiLgJSDVhYU3gCCLaPrqIG5fMBsSTZo7PEU4BxtXC3rSKGLNYEr0V1YgHVkgLrI9SsN60c0HqcIHWetFYOrE5Kd00rPFN1Mau")

const OrderSummary  = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  // Function to handle the payment process
const handlePayment = async () => {
    console.log("handled payment");

    // Load the Stripe instance (initialized earlier with the public key)
    const stripe = await stripePromise;

    try {
        // Send a POST request to the backend to create a Stripe checkout session
        const res = await axios.post("/payments/create-checkout-session", {
            products: cart, // Send the list of products from the cart
            couponCode: coupon ? coupon.code : null, // Include the coupon code if it exists, otherwise send null
        });

        // Retrieve the Stripe session data from the backend response
        const session = res.data;

        // Use the Stripe instance to redirect the user to the Stripe Checkout page
        const result = await stripe.redirectToCheckout({
            sessionId: session.id, // Pass the session ID returned by the backend
        });

        // If there's an error during the redirection, log it to the console
        if (result.error) {
            console.error("Error:", result.error);
        }
    } catch (error) {
        // Log any errors that occur during the request or redirection process
        console.error("Payment initiation failed:", error.message);
    }
};



  return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className='text-xl font-semibold text-emerald-400'>Order summary</p>
  
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300'>Original price</dt>
                        <dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
                    </dl>
  
                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Savings</dt>
                            <dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
                        </dl>
                    )}
  
                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
                            <dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
                        <dt className='text-base font-bold text-white'>Total</dt>
                        <dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
                    </dl>
                </div>
  
                <motion.button
                    className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                >
                    Proceed to Checkout
                </motion.button>
  
                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>or</span>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default OrderSummary 