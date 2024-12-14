import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addToCart, getCartItems, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/',protectRoute,addToCart);
router.delete('/',protectRoute,removeAllFromCart);
router.get('/',protectRoute,getCartItems)
router.put('/',protectRoute,updateQuantity)


export default router;