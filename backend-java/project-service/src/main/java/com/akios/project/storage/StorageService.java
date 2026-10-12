package com.akios.project.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;

public interface StorageService {
    String storeMedia(File sourceFile, String projectId, String mediaType);
    String storeMedia(MultipartFile file, String projectId, String mediaType);
    void deleteMedia(String mediaUrl);
}
