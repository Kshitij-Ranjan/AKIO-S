export const projectService = {
  async getProjects() {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.map((p: any) => ({
      ...p,
      id: String(p.id),
      // Ensure camelCase is explicitly handled if backend used snake_case, 
      // but Java DTO is already camelCase (posterUrl, videoUrl).
    }));
  },
  
  async getProjectBySlug(slug: string) {
    const res = await fetch(`/api/projects/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch project");
    const data = await res.json();
    return {
      ...data,
      id: String(data.id),
    };
  }
};
