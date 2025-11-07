import express from 'express';
import { protect } from '../middleware/auth.js';
import { getIdCard, generateIdCard, updateIdCardValidity, downloadIdCard } from '../controllers/idCardController.js';

const idCardRoute = express.Router();

idCardRoute.use(protect);

// Get user's ID card information
idCardRoute.get('/', getIdCard);

// Generate new ID card
idCardRoute.post('/generate', generateIdCard);

// Update ID card validity status
idCardRoute.patch('/:idCardId', updateIdCardValidity);

// Download ID card as PDF
idCardRoute.get('/download', downloadIdCard);

export default idCardRoute;