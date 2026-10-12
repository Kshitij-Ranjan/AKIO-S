package com.akios.project.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectMediaRequest {
    @NotBlank
    private String mediaType; // POSTER or VIDEO
    
    @NotBlank
    private String mediaUrl;

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
}
