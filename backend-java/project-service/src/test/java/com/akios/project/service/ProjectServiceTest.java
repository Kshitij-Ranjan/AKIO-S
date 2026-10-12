package com.akios.project.service;

import com.akios.project.dto.*;
import com.akios.project.exception.DuplicateResourceException;
import com.akios.project.exception.ResourceNotFoundException;
import com.akios.project.model.Project;
import com.akios.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project mockProject;

    @BeforeEach
    void setUp() {
        mockProject = new Project();
        mockProject.setId(1L);
        mockProject.setTitle("Test Project");
        mockProject.setSlug("test-project");
        mockProject.setSortOrder(1);
        mockProject.setPublished(true);
    }

    @Test
    void testCreateProjectSuccess() {
        ProjectCreateRequest req = new ProjectCreateRequest();
        req.setTitle("New Project");
        req.setSlug("new-project");

        when(projectRepository.existsBySlug("new-project")).thenReturn(false);
        when(projectRepository.findMaxSortOrder()).thenReturn(1);
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> {
            Project p = i.getArgument(0);
            p.setId(2L);
            return p;
        });

        ProjectResponse res = projectService.createProject(req);
        assertNotNull(res);
        assertEquals("new-project", res.getSlug());
        assertEquals(2, res.getSortOrder());
    }

    @Test
    void testCreateProjectDuplicateSlugThrowsException() {
        ProjectCreateRequest req = new ProjectCreateRequest();
        req.setSlug("test-project");

        when(projectRepository.existsBySlug("test-project")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> projectService.createProject(req));
    }

    @Test
    void testGetPublicProject() {
        when(projectRepository.findBySlug("test-project")).thenReturn(Optional.of(mockProject));
        ProjectResponse res = projectService.getProjectBySlug("test-project", false);
        assertNotNull(res);
        assertEquals("test-project", res.getSlug());
    }

    @Test
    void testGetPublicProjectUnpublishedThrowsNotFound() {
        mockProject.setPublished(false);
        when(projectRepository.findBySlug("test-project")).thenReturn(Optional.of(mockProject));
        assertThrows(ResourceNotFoundException.class, () -> projectService.getProjectBySlug("test-project", false));
    }

    @Test
    void testDeleteProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject));
        projectService.deleteProject(1L);
        verify(projectRepository, times(1)).delete(mockProject);
    }
}
