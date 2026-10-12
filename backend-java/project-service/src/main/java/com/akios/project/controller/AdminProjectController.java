package com.akios.project.controller;

import com.akios.project.dto.*;
import com.akios.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects(true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable("id") Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        return new ResponseEntity<>(projectService.createProject(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable("id") Long id, @Valid @RequestBody ProjectUpdateRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<Void> publishProject(@PathVariable("id") Long id) {
        projectService.publishProject(id, true);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<Void> unpublishProject(@PathVariable("id") Long id) {
        projectService.publishProject(id, false);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorderProjects(@Valid @RequestBody List<ProjectReorderRequest> requests) {
        projectService.reorderProjects(requests);
        return ResponseEntity.ok().build();
    }

    // Legacy JSON Mapping for import tools
    @PostMapping("/{id}/media")
    public ResponseEntity<ProjectResponse> addMedia(@PathVariable("id") Long id, @Valid @RequestBody ProjectMediaRequest request) {
        return ResponseEntity.ok(projectService.addMedia(id, request));
    }
    
    // NEW Physical Multipart Upload
    @PostMapping(value = "/{id}/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponse> uploadMedia(
            @PathVariable("id") Long id,
            @RequestParam("mediaType") String mediaType,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(projectService.uploadMedia(id, mediaType, file));
    }

    @DeleteMapping("/{id}/media/{mediaId}")
    public ResponseEntity<ProjectResponse> removeMedia(@PathVariable("id") Long id, @PathVariable("mediaId") Long mediaId) {
        return ResponseEntity.ok(projectService.removeMedia(id, mediaId));
    }
}
