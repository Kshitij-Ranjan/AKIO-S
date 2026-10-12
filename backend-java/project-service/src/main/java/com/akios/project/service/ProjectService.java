package com.akios.project.service;

import com.akios.project.dto.*;
import com.akios.project.exception.DuplicateResourceException;
import com.akios.project.exception.ResourceNotFoundException;
import com.akios.project.model.Project;
import com.akios.project.model.ProjectMedia;
import com.akios.project.repository.ProjectMediaRepository;
import com.akios.project.repository.ProjectRepository;
import com.akios.project.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMediaRepository projectMediaRepository;
    private final StorageService storageService;

    public ProjectService(ProjectRepository projectRepository, ProjectMediaRepository projectMediaRepository, StorageService storageService) {
        this.projectRepository = projectRepository;
        this.projectMediaRepository = projectMediaRepository;
        this.storageService = storageService;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(boolean admin) {
        List<Project> projects = admin ? 
            projectRepository.findAllByOrderBySortOrderAsc() :
            projectRepository.findByPublishedTrueOrderBySortOrderAsc();
        return projects.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return projectRepository.findById(id)
            .map(this::mapToResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectBySlug(String slug, boolean admin) {
        return projectRepository.findBySlug(slug)
            .filter(p -> admin || Boolean.TRUE.equals(p.getPublished()))
            .map(this::mapToResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));
    }

    public ProjectResponse createProject(ProjectCreateRequest request) {
        if (projectRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Project slug already exists: " + request.getSlug());
        }

        Project project = new Project();
        mapRequestToEntity(request, project);
        
        Integer maxSort = projectRepository.findMaxSortOrder();
        project.setSortOrder(maxSort == null ? 1 : maxSort + 1);

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public ProjectResponse updateProject(Long id, ProjectUpdateRequest request) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (request.getSlug() != null && !request.getSlug().equals(project.getSlug())) {
            if (projectRepository.existsBySlug(request.getSlug())) {
                throw new DuplicateResourceException("Project slug already exists: " + request.getSlug());
            }
            project.setSlug(request.getSlug());
        }

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getCategory() != null) project.setCategory(request.getCategory());
        if (request.getReleaseYear() != null) project.setReleaseYear(request.getReleaseYear());
        if (request.getRole() != null) project.setRole(request.getRole());
        if (request.getTools() != null) project.setTools(request.getTools());
        if (request.getClient() != null) project.setClient(request.getClient());
        if (request.getContext() != null) project.setContext(request.getContext());
        if (request.getEditingApproach() != null) project.setEditingApproach(request.getEditingApproach());
        if (request.getVisualStyle() != null) project.setVisualStyle(request.getVisualStyle());
        if (request.getCredits() != null) project.setCredits(request.getCredits());
        if (request.getAspectRatio() != null) project.setAspectRatio(request.getAspectRatio());
        if (request.getPreviewStart() != null) project.setPreviewStart(request.getPreviewStart());
        if (request.getPreviewDuration() != null) project.setPreviewDuration(request.getPreviewDuration());

        return mapToResponse(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
            
        // Clean up physical media before deletion
        for (ProjectMedia media : project.getMedia()) {
            storageService.deleteMedia(media.getMediaUrl());
        }
        
        projectRepository.delete(project);
    }

    public void publishProject(Long id, boolean published) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setPublished(published);
        projectRepository.save(project);
    }

    public void reorderProjects(List<ProjectReorderRequest> requests) {
        for (ProjectReorderRequest req : requests) {
            projectRepository.findById(req.getId()).ifPresent(p -> {
                p.setSortOrder(req.getSortOrder());
                projectRepository.save(p);
            });
        }
    }

    // Legacy JSON Mapping
    public ProjectResponse addMedia(Long id, ProjectMediaRequest request) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        ProjectMedia media = new ProjectMedia();
        media.setMediaType(ProjectMedia.MediaType.valueOf(request.getMediaType()));
        media.setMediaUrl(request.getMediaUrl());
        project.addMedia(media);

        return mapToResponse(projectRepository.save(project));
    }

    // New Physical File Upload
    public ProjectResponse uploadMedia(Long id, String mediaTypeStr, MultipartFile file) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
            
        ProjectMedia.MediaType type = ProjectMedia.MediaType.valueOf(mediaTypeStr);
        
        // Validate MIME type basically (Production should be more robust)
        String contentType = file.getContentType();
        if (type == ProjectMedia.MediaType.POSTER && contentType != null && !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File is not a valid image");
        }
        if (type == ProjectMedia.MediaType.VIDEO && contentType != null && !contentType.startsWith("video/")) {
            throw new IllegalArgumentException("File is not a valid video");
        }

        // Store new physical file
        String url = storageService.storeMedia(file, String.valueOf(project.getId()), mediaTypeStr);
        
        // Check if there is an existing media of the same type to replace
        Optional<ProjectMedia> existing = project.getMedia().stream()
                .filter(m -> m.getMediaType() == type).findFirst();
                
        if (existing.isPresent()) {
            ProjectMedia oldMedia = existing.get();
            String oldUrl = oldMedia.getMediaUrl();
            oldMedia.setMediaUrl(url); // Update mapping
            projectRepository.save(project); // Ensure mapping is saved before deleting old file
            storageService.deleteMedia(oldUrl); // Safe to delete old file now
        } else {
            ProjectMedia media = new ProjectMedia();
            media.setMediaType(type);
            media.setMediaUrl(url);
            project.addMedia(media);
            projectRepository.save(project);
        }

        return mapToResponse(project);
    }

    public ProjectResponse removeMedia(Long id, Long mediaId) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        ProjectMedia media = project.getMedia().stream()
            .filter(m -> m.getId().equals(mediaId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        // Delete the physical file securely
        storageService.deleteMedia(media.getMediaUrl());

        project.removeMedia(media);
        return mapToResponse(projectRepository.save(project));
    }

    private void mapRequestToEntity(ProjectCreateRequest request, Project project) {
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setReleaseYear(request.getReleaseYear());
        project.setRole(request.getRole());
        project.setTools(request.getTools());
        project.setClient(request.getClient());
        project.setContext(request.getContext());
        project.setEditingApproach(request.getEditingApproach());
        project.setVisualStyle(request.getVisualStyle());
        project.setCredits(request.getCredits());
        project.setAspectRatio(request.getAspectRatio());
        
        if (request.getPreviewStart() != null) project.setPreviewStart(request.getPreviewStart());
        if (request.getPreviewDuration() != null) project.setPreviewDuration(request.getPreviewDuration());
        if (request.getPublished() != null) project.setPublished(request.getPublished());
    }

    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setSlug(project.getSlug());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
        response.setReleaseYear(project.getReleaseYear());
        response.setRole(project.getRole());
        response.setTools(project.getTools());
        response.setClient(project.getClient());
        response.setContext(project.getContext());
        response.setEditingApproach(project.getEditingApproach());
        response.setVisualStyle(project.getVisualStyle());
        response.setCredits(project.getCredits());
        response.setAspectRatio(project.getAspectRatio());
        response.setPreviewStart(project.getPreviewStart());
        response.setPreviewDuration(project.getPreviewDuration());
        response.setSortOrder(project.getSortOrder());
        response.setPublished(project.getPublished());

        response.setMedia(project.getMedia().stream().map(m -> {
            ProjectMediaResponse mr = new ProjectMediaResponse();
            mr.setId(m.getId());
            mr.setMediaType(m.getMediaType().name());
            mr.setMediaUrl(m.getMediaUrl());
            return mr;
        }).collect(Collectors.toList()));

        project.getMedia().forEach(m -> {
            if (m.getMediaType() == ProjectMedia.MediaType.POSTER) {
                response.setPosterUrl(m.getMediaUrl());
            } else if (m.getMediaType() == ProjectMedia.MediaType.VIDEO) {
                response.setVideoUrl(m.getMediaUrl());
            }
        });

        return response;
    }
}
