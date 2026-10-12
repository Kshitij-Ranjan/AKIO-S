import { Request, Response, NextFunction } from 'express';
import { fetchAllProjects, fetchProjectBySlug } from '../services/projects.js';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await fetchAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getProjectBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await fetchProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};
