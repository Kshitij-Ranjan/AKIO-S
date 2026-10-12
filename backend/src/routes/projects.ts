import { Router } from 'express';
import { getProjects, getProjectBySlug } from '../controllers/projects.js';

export const projectsRouter = Router();
projectsRouter.get('/', getProjects);
projectsRouter.get('/:slug', getProjectBySlug);
