import { Router } from 'express';
import { submitContact } from '../controllers/contact.js';

export const contactRouter = Router();
contactRouter.post('/', submitContact);
