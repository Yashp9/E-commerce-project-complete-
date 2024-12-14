import express from 'express';
import { getProfile, login, logout, refreshToken, signup } from '../controllers/auth.controller.js'; 
import { protectRoute } from '../middleware/auth.middleware.js';

//create Routers
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout); 
router.post('/refresh-token',refreshToken)
router.get('/profile',protectRoute,getProfile);

export default router;