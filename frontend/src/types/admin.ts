export interface ProjectMedia {
  id: number;
  mediaType: 'POSTER' | 'VIDEO';
  mediaUrl: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  releaseYear: number | null;
  role: string | null;
  tools: string | null;
  client: string | null;
  context: string | null;
  editingApproach: string | null;
  visualStyle: string | null;
  credits: string | null;
  aspectRatio: string | null;
  previewStart: number;
  previewDuration: number;
  sortOrder: number;
  published: boolean;
  posterUrl: string | null;
  videoUrl: string | null;
  media: ProjectMedia[];
}

export interface ProjectCreateRequest {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  releaseYear?: number;
  role?: string;
  tools?: string;
  client?: string;
  context?: string;
  editingApproach?: string;
  visualStyle?: string;
  credits?: string;
  aspectRatio?: string;
  previewStart?: number;
  previewDuration?: number;
  published?: boolean;
}

export interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {}
