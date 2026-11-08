
USE sprevn;

-- 기존 프로젝트 기본정보 확장
ALTER TABLE spr_project
    ADD COLUMN slug VARCHAR(200) NULL COMMENT '프로젝트 URL 식별자',
    ADD COLUMN project_no INT NULL COMMENT '프로젝트 표시 번호',
    ADD COLUMN category VARCHAR(100) NULL COMMENT '프로젝트 분류',
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0 COMMENT '표시 순서',
    ADD COLUMN published_at DATETIME NULL COMMENT '공개 일시';

-- 기존 프로젝트 URL 식별자 채우기
UPDATE spr_project
SET slug = CONCAT('project-', project_id)
WHERE slug IS NULL OR slug = '';

-- 기존 프로젝트 번호 채우기
UPDATE spr_project
SET project_no = project_id
WHERE project_no IS NULL;

-- URL 식별자 중복 방지
ALTER TABLE spr_project
    ADD UNIQUE KEY uk_spr_project_slug (slug);

-- 프로젝트 번호 중복 방지
ALTER TABLE spr_project
    ADD UNIQUE KEY uk_spr_project_no (project_no);

-- 상태 설명
-- 0: 임시저장
-- 1: 공개
-- 2: 비공개


--본문 섹션 테이블 생성
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


  --섹션 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS spr_project_image (
    image_id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    section_id BIGINT NULL,

    image_url VARCHAR(1000) NOT NULL,
    image_alt VARCHAR(300) NULL,

    image_type VARCHAR(50) NOT NULL DEFAULT 'CONTENT',
    sort_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (image_id),

    INDEX idx_project_image_order (project_id, sort_order),

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

