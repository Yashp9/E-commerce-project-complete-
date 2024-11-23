import express from 'express';
import { getAllProducts, getFeaturedProducts } from '../controllers/Product.controller.js';
import { protectRoute,adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//*protectRoute,adminRoute will ensure that if user is authorised and admin then only it will access getAllProducts.
router.get('/',protectRoute, adminRoute,getAllProducts);

//*get all the featured products.
router.get('/featured',getFeaturedProducts);


export default router;
