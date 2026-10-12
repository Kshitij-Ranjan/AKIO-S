package com.akios.project.dto;

public class ImportResultResponse {
    private int imported;
    private int updated;
    private int skipped;
    private int mediaProcessed;

    public int getImported() { return imported; }
    public void setImported(int imported) { this.imported = imported; }
    public int getUpdated() { return updated; }
    public void setUpdated(int updated) { this.updated = updated; }
    public int getSkipped() { return skipped; }
    public void setSkipped(int skipped) { this.skipped = skipped; }
    public int getMediaProcessed() { return mediaProcessed; }
    public void setMediaProcessed(int mediaProcessed) { this.mediaProcessed = mediaProcessed; }
}
