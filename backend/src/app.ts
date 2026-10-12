import express from 'express';
import cors from 'cors';
import { projectsRouter } from './routes/projects.js';
import { contactRouter } from './routes/contact.js';

export const app = express();

app.use(cors({
  origin: process.env.VITE_SITE_URL || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
