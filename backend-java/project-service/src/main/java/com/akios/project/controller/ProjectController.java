package com.akios.project.controller;

import com.akios.project.dto.ProjectResponse;
import com.akios.project.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects(false));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(projectService.getProjectBySlug(slug, false));
    }
}
