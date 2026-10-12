package com.akios.project.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class ProjectReorderRequest {
    @NotNull
    private Long id;
    
    @NotNull
    @Min(0)
    private Integer sortOrder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
