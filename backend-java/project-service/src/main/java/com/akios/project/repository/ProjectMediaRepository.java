package com.akios.project.repository;

import com.akios.project.model.ProjectMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMediaRepository extends JpaRepository<ProjectMedia, Long> {
}
