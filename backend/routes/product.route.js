import express from 'express';
import { getAllProducts, getFeaturedProducts,createProducts ,deleteProduct,getRecommendedProducts,getProductsByCategory,toggleFeaturedProduct} from '../controllers/Product.controller.js';
import { protectRoute,adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//*protectRoute,adminRoute will ensure that if user is authorised and admin then only it will access getAllProducts.
router.get('/',protectRoute, adminRoute,getAllProducts);

//*get all the featured products.
router.get('/featured',getFeaturedProducts);

//*get recomded products.
// router.get('/featured',getFeaturedProducts);


//*going to createProduct using cloudinary.
router.post('/',protectRoute, adminRoute,createProducts);

//*going to deleteProduct  using cloudinary.
router.delete('/:id',protectRoute, adminRoute,deleteProduct);

//*to get recomded products.
router.get('/recommendations', getRecommendedProducts);

//*to get products by category..
router.get('/category/:category',getProductsByCategory);

//*to toggle the featureProduct.
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct);

export default router;
