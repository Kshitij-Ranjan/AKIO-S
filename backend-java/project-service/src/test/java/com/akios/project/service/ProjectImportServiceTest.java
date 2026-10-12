package com.akios.project.service;

import com.akios.project.dto.ImportResultResponse;
import com.akios.project.model.Project;
import com.akios.project.model.ProjectMedia;
import com.akios.project.repository.ProjectRepository;
import com.akios.project.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectImportServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private StorageService storageService;

    private ProjectImportService importService;

    @TempDir
    File tempDir;

    @BeforeEach
    void setUp() throws IOException {
        importService = new ProjectImportService(projectRepository, storageService);
        ReflectionTestUtils.setField(importService, "sourceDir", tempDir.getAbsolutePath());

        // Create PROJECT_01 with missing fields
        File p1 = new File(tempDir, "PROJECT_01");
        p1.mkdirs();
        File txt1 = new File(p1, "PROJECT_DETAILS.txt");
        Files.writeString(txt1.toPath(), "PROJECT TITLE:\nTest Project\n\nYEAR:\n2025\n\n");
        new File(p1, "POSTER.png").createNewFile();
        new File(p1, "VIDEO.mp4").createNewFile();

        // Create PROJECT_02
        File p2 = new File(tempDir, "PROJECT_02");
        p2.mkdirs();
        File txt2 = new File(p2, "PROJECT_DETAILS.txt");
        Files.writeString(txt2.toPath(), "PROJECT TITLE:\nAnother One\n\n");
    }

    @Test
    void testFirstImport() {
        when(projectRepository.findBySlug(anyString())).thenReturn(Optional.empty());
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArgument(0));
        when(storageService.storeMedia(any(File.class), anyString(), anyString())).thenReturn("/media/test.jpg");

        ImportResultResponse res = importService.runImport();

        assertEquals(2, res.getImported());
        assertEquals(0, res.getUpdated());
        assertEquals(2, res.getMediaProcessed()); // 2 media files in PROJECT_01

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(projectRepository, atLeast(2)).save(captor.capture());
        
        Project savedP1 = captor.getAllValues().get(1); // Second save (after media)
        assertEquals("test-project", savedP1.getSlug());
        assertEquals(2025, savedP1.getReleaseYear());
        assertEquals(1, savedP1.getSortOrder());
        assertEquals(0, savedP1.getPreviewStart());
        assertEquals(15, savedP1.getPreviewDuration());
    }

    @Test
    void testSecondImportIdempotency() {
        Project existing = new Project();
        existing.setSlug("test-project");
        existing.setTitle("Old Title");
        
        when(projectRepository.findBySlug("test-project")).thenReturn(Optional.of(existing));
        when(projectRepository.findBySlug("another-one")).thenReturn(Optional.empty());
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArgument(0));

        ImportResultResponse res = importService.runImport();

        assertEquals(1, res.getImported());
        assertEquals(1, res.getUpdated());
        
        // Assert it updated the title of the existing project
        assertEquals("Test Project", existing.getTitle());
    }
}
