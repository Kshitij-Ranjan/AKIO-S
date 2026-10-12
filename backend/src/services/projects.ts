import { getAllProjects, getProject } from '../repositories/projects.js';

export const fetchAllProjects = async () => {
  return getAllProjects();
};

export const fetchProjectBySlug = async (slug: string) => {
  return getProject(slug);
};
