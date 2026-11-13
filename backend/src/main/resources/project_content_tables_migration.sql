USE sprevn;

CREATE TABLE IF NOT EXISTS spr_project_section (
    section_id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NULL,
    section_type VARCHAR(50) NOT NULL DEFAULT 'TEXT',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (section_id),
    INDEX idx_project_section_order (project_id, sort_order),
    CONSTRAINT fk_project_section
        FOREIGN KEY (project_id)
        REFERENCES spr_project(project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS spr_project_image (
    image_id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    section_id BIGINT NULL,
    storage_path VARCHAR(1000) NOT NULL,
    image_alt VARCHAR(300) NULL,
    image_type VARCHAR(50) NOT NULL DEFAULT 'CONTENT',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id),
    INDEX idx_project_image_order (project_id, sort_order),
    INDEX idx_project_image_section (section_id),
    CONSTRAINT fk_project_image
        FOREIGN KEY (project_id)
        REFERENCES spr_project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_image_section
        FOREIGN KEY (section_id)
        REFERENCES spr_project_section(section_id)
        ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
