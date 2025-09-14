import express from 'express';
import { signup, login } from '../controllers/authController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, (req, res) => {
  res.json({ fullName: req.user.fullName });
});

export default router;
