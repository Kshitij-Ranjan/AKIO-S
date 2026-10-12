package com.akios.project.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    @Value("${storage.local.dir:./uploads}")
    private String storageDir;

    @Override
    public String storeMedia(File sourceFile, String projectId, String mediaType) {
        try {
            File projectDir = new File(storageDir, projectId);
            if (!projectDir.exists()) {
                projectDir.mkdirs();
            }

            File destFile = new File(projectDir, sourceFile.getName());
            if (!destFile.exists() || destFile.length() != sourceFile.length()) {
                FileCopyUtils.copy(sourceFile, destFile);
            }

            return "/api/projects/media/" + projectId + "/" + destFile.getName();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store media file: " + sourceFile.getName(), e);
        }
    }

    @Override
    public String storeMedia(MultipartFile file, String projectId, String mediaType) {
        try {
            File projectDir = new File(storageDir, projectId);
            if (!projectDir.exists()) {
                projectDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Generate unique filename to prevent collisions and execution vulnerabilities
            String safeFilename = UUID.randomUUID().toString() + extension.toLowerCase();
            File destFile = new File(projectDir, safeFilename);

            file.transferTo(destFile);

            return "/api/projects/media/" + projectId + "/" + safeFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload media file", e);
        }
    }

    @Override
    public void deleteMedia(String mediaUrl) {
        if (mediaUrl == null || !mediaUrl.startsWith("/api/projects/media/")) {
            return;
        }
        
        // mediaUrl is like /api/projects/media/1/xxx.jpg
        String relativePath = mediaUrl.substring("/api/projects/media/".length());
        File targetFile = new File(storageDir, relativePath);
        
        // Ensure the path does not traverse outside storageDir
        try {
            Path targetPath = targetFile.toPath().normalize().toAbsolutePath();
            Path storagePath = Paths.get(storageDir).normalize().toAbsolutePath();
            if (targetPath.startsWith(storagePath) && targetFile.exists()) {
                targetFile.delete();
            }
        } catch (Exception e) {
            // Log and ignore to prevent blocking DB operations
            System.err.println("Failed to delete physical media: " + e.getMessage());
        }
    }
}
