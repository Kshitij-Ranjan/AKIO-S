import { apiClient } from './client';
import { Project, ProjectCreateRequest, ProjectUpdateRequest } from '../types/admin';

export const projectApi = {
  getAll: () => apiClient.fetch('/api/admin/projects') as Promise<Project[]>,
  getById: (id: number) => apiClient.fetch(`/api/admin/projects/${id}`) as Promise<Project>,
  create: (data: ProjectCreateRequest) => apiClient.fetch('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }) as Promise<Project>,
  update: (id: number, data: ProjectUpdateRequest) => apiClient.fetch(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }) as Promise<Project>,
  delete: (id: number) => apiClient.fetch(`/api/admin/projects/${id}`, {
    method: 'DELETE'
  }),
  publish: (id: number) => apiClient.fetch(`/api/admin/projects/${id}/publish`, { method: 'PATCH' }),
  unpublish: (id: number) => apiClient.fetch(`/api/admin/projects/${id}/unpublish`, { method: 'PATCH' }),
  reorder: (updates: { id: number; sortOrder: number }[]) => apiClient.fetch('/api/admin/projects/reorder', {
    method: 'PATCH',
    body: JSON.stringify(updates)
  }),
  // Legacy JSON link
  addMediaLink: (id: number, mediaType: 'POSTER'|'VIDEO', mediaUrl: string) => apiClient.fetch(`/api/admin/projects/${id}/media`, {
    method: 'POST',
    body: JSON.stringify({ mediaType, mediaUrl })
  }),
  // New Physical Binary Upload
  uploadMedia: (id: number, mediaType: 'POSTER'|'VIDEO', file: File) => {
    const formData = new FormData();
    formData.append('mediaType', mediaType);
    formData.append('file', file);
    return apiClient.fetch(`/api/admin/projects/${id}/media/upload`, {
      method: 'POST',
      body: formData
    });
  },
  removeMedia: (id: number, mediaId: number) => apiClient.fetch(`/api/admin/projects/${id}/media/${mediaId}`, {
    method: 'DELETE'
  })
};
