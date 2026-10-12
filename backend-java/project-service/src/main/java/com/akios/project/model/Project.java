package com.akios.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String slug;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    private Integer releaseYear; // 'year' is a reserved keyword in some SQL dialects
    private String role;
    private String tools;
    private String client;
    
    @Column(columnDefinition = "TEXT")
    private String context;
    
    @Column(columnDefinition = "TEXT")
    private String editingApproach;
    
    @Column(columnDefinition = "TEXT")
    private String visualStyle;
    
    @Column(columnDefinition = "TEXT")
    private String credits;
    
    private String aspectRatio;
    private Integer previewStart = 0;
    private Integer previewDuration = 15;
    
    @Column(nullable = false)
    private Integer sortOrder = 0;
    
    @Column(nullable = false)
    private Boolean published = false;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMedia> media = new ArrayList<>();
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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
    public List<ProjectMedia> getMedia() { return media; }
    public void setMedia(List<ProjectMedia> media) { this.media = media; }
    
    public void addMedia(ProjectMedia projectMedia) {
        media.add(projectMedia);
        projectMedia.setProject(this);
    }
    
    public void removeMedia(ProjectMedia projectMedia) {
        media.remove(projectMedia);
        projectMedia.setProject(null);
    }
}
