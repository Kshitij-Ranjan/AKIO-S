package com.akios.project.repository;

import com.akios.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Project> findAllByOrderBySortOrderAsc();
    List<Project> findByPublishedTrueOrderBySortOrderAsc();
    
    @Query("SELECT COALESCE(MAX(p.sortOrder), -1) FROM Project p")
    Integer findMaxSortOrder();
}
