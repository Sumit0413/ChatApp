import express from 'express';
import { register ,Login ,Logout,getOtherUsers, getMe } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuth.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/users', isAuthenticated, getOtherUsers);
router.get('/me', isAuthenticated, getMe);

export default router;