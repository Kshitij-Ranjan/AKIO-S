package com.akios.project.dto;

import java.util.List;

public class ProjectResponse {
    private Long id;
    private String slug;
    private String title;
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
    private Integer previewStart;
    private Integer previewDuration;
    private Integer sortOrder;
    private Boolean published;
    private String posterUrl;
    private String videoUrl;
    private List<ProjectMediaResponse> media;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
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
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public List<ProjectMediaResponse> getMedia() { return media; }
    public void setMedia(List<ProjectMediaResponse> media) { this.media = media; }
}
