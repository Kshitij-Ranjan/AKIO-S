package com.akios.project.controller;

import com.akios.project.dto.ImportResultResponse;
import com.akios.project.service.ProjectImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/import")
public class ImportController {

    private final ProjectImportService importService;

    public ImportController(ProjectImportService importService) {
        this.importService = importService;
    }

    @PostMapping
    public ResponseEntity<ImportResultResponse> runImport() {
        return ResponseEntity.ok(importService.runImport());
    }
}
