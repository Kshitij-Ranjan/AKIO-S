import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    contactSchema.parse(req.body);
    // In a real app, call email service here
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    next(err);
  }
};
