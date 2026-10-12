package com.akios.project.dto;

public class ProjectMediaResponse {
    private Long id;
    private String mediaType;
    private String mediaUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
}
