package com.akios.project.dto;

import jakarta.validation.constraints.Min;
import org.hibernate.validator.constraints.Length;

public class ProjectUpdateRequest {
    @Length(max = 255)
    private String title;
    
    @Length(max = 255)
    private String slug;
    
    private String description;
    private String category;
    private Integer releaseYear;
    private String role;
    private String tools;
    private String client;
    private String context;
    private String editingApproach;
    private String visualStyle;
    private String credits;
    private String aspectRatio;
    
    @Min(0)
    private Integer previewStart;
    
    @Min(0)
    private Integer previewDuration;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getTools() { return tools; }
    public void setTools(String tools) { this.tools = tools; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public String getEditingApproach() { return editingApproach; }
    public void setEditingApproach(String editingApproach) { this.editingApproach = editingApproach; }
    public String getVisualStyle() { return visualStyle; }
    public void setVisualStyle(String visualStyle) { this.visualStyle = visualStyle; }
    public String getCredits() { return credits; }
    public void setCredits(String credits) { this.credits = credits; }
    public String getAspectRatio() { return aspectRatio; }
    public void setAspectRatio(String aspectRatio) { this.aspectRatio = aspectRatio; }
    public Integer getPreviewStart() { return previewStart; }
    public void setPreviewStart(Integer previewStart) { this.previewStart = previewStart; }
    public Integer getPreviewDuration() { return previewDuration; }
    public void setPreviewDuration(Integer previewDuration) { this.previewDuration = previewDuration; }
}
