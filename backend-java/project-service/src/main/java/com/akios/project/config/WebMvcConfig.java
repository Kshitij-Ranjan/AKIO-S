package com.akios.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${storage.local.dir:./uploads}")
    private String storageDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(storageDir).toAbsolutePath().toUri().toString();
        if (!absolutePath.endsWith("/")) {
            absolutePath += "/";
        }
        registry.addResourceHandler("/api/projects/media/**")
                .addResourceLocations(absolutePath);
    }
}
