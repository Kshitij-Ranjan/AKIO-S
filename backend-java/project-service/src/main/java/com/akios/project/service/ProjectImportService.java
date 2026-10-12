package com.akios.project.service;

import com.akios.project.dto.ImportResultResponse;
import com.akios.project.model.Project;
import com.akios.project.model.ProjectMedia;
import com.akios.project.repository.ProjectRepository;
import com.akios.project.storage.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProjectImportService {

    private final ProjectRepository projectRepository;
    private final StorageService storageService;

    @Value("${import.source.dir:../../../MediaSrc}")
    private String sourceDir;

    public ProjectImportService(ProjectRepository projectRepository, StorageService storageService) {
        this.projectRepository = projectRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ImportResultResponse runImport() {
        ImportResultResponse result = new ImportResultResponse();
        File rootDir = new File(sourceDir);
        if (!rootDir.exists() || !rootDir.isDirectory()) {
            throw new RuntimeException("Source directory not found: " + sourceDir);
        }

        for (int i = 1; i <= 9; i++) {
            String dirName = String.format("PROJECT_%02d", i);
            File projectDir = new File(rootDir, dirName);
            if (!projectDir.exists() || !projectDir.isDirectory()) continue;

            File detailsFile = new File(projectDir, "PROJECT_DETAILS.txt");
            if (!detailsFile.exists()) continue;

            try {
                String content = Files.readString(detailsFile.toPath());
                String title = extractField(content, "PROJECT TITLE:");
                if (title == null || title.isBlank()) continue;

                String slug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-");
                
                Project project;
                boolean isNew = false;
                Optional<Project> existing = projectRepository.findBySlug(slug);
                if (existing.isPresent()) {
                    project = existing.get();
                    result.setUpdated(result.getUpdated() + 1);
                } else {
                    project = new Project();
                    project.setSlug(slug);
                    isNew = true;
                    result.setImported(result.getImported() + 1);
                }

                project.setTitle(title);
                project.setReleaseYear(parseInteger(extractField(content, "YEAR:")));
                project.setCategory(extractField(content, "CATEGORY:"));
                project.setDescription(extractField(content, "DESCRIPTION:"));
                project.setRole(extractField(content, "MY ROLE:"));
                project.setTools(extractField(content, "TOOLS:"));
                project.setClient(extractField(content, "CLIENT / ORGANIZATION:"));
                project.setEditingApproach(extractField(content, "EDITING APPROACH:"));
                project.setVisualStyle(extractField(content, "VISUAL STYLE:"));
                project.setCredits(extractField(content, "CREDITS:"));
                project.setAspectRatio(extractField(content, "VIDEO ASPECT RATIO:"));
                
                Integer pStart = parseInteger(extractField(content, "PREVIEW START:"));
                project.setPreviewStart(pStart != null ? pStart : 0);
                
                Integer pDur = parseInteger(extractField(content, "PREVIEW DURATION:"));
                project.setPreviewDuration(pDur != null ? pDur : 15);
                
                project.setSortOrder(i);
                project.setPublished(true); // Assuming imported means published based on standard migration

                // Save project first to generate ID if new
                project = projectRepository.save(project);

                // Handle Media
                processMedia(project, projectDir, result);

                projectRepository.save(project);

            } catch (Exception e) {
                System.err.println("Failed to import " + dirName + ": " + e.getMessage());
                // Rethrowing to ensure transactional rollback on failure as requested
                throw new RuntimeException("Import failed for " + dirName, e);
            }
        }
        return result;
    }

    private void processMedia(Project project, File projectDir, ImportResultResponse result) {
        // Find Poster
        File[] files = projectDir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.getName().toLowerCase().startsWith("poster.")) {
                    String url = storageService.storeMedia(file, "PROJECT_" + project.getSortOrder(), "POSTER");
                    addMediaIfMissing(project, ProjectMedia.MediaType.POSTER, url);
                    result.setMediaProcessed(result.getMediaProcessed() + 1);
                } else if (file.getName().equalsIgnoreCase("VIDEO.mp4")) {
                    String url = storageService.storeMedia(file, "PROJECT_" + project.getSortOrder(), "VIDEO");
                    addMediaIfMissing(project, ProjectMedia.MediaType.VIDEO, url);
                    result.setMediaProcessed(result.getMediaProcessed() + 1);
                }
            }
        }
    }

    private void addMediaIfMissing(Project project, ProjectMedia.MediaType type, String url) {
        boolean exists = project.getMedia().stream()
                .anyMatch(m -> m.getMediaType() == type && m.getMediaUrl().equals(url));
        if (!exists) {
            // Check if there is an existing one of this type, and update it instead to prevent duplicates
            Optional<ProjectMedia> existing = project.getMedia().stream()
                    .filter(m -> m.getMediaType() == type).findFirst();
            if (existing.isPresent()) {
                existing.get().setMediaUrl(url);
            } else {
                ProjectMedia pm = new ProjectMedia();
                pm.setMediaType(type);
                pm.setMediaUrl(url);
                project.addMedia(pm);
            }
        }
    }

    private String extractField(String content, String fieldName) {
        Pattern pattern = Pattern.compile(fieldName + "\\s*\\n(.*?)(?=\\n[A-Z0-9 /]+:|$)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private Integer parseInteger(String val) {
        if (val == null || val.isBlank()) return null;
        try {
            return Integer.parseInt(val.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
