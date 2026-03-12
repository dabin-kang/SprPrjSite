-- ====================================
-- SPREVN Database Schema
-- ====================================

CREATE DATABASE IF NOT EXISTS sprevn
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sprevn;

-- ====================================
-- 회원 테이블 (spr_sign)
-- ====================================
CREATE TABLE IF NOT EXISTS spr_sign (
    user_id     BIGINT          NOT NULL AUTO_INCREMENT  COMMENT '사용자 고유 ID',
    id          VARCHAR(50)     NOT NULL                 COMMENT '로그인 아이디',
    pname       VARCHAR(100)    NOT NULL                 COMMENT '이름',
    email       VARCHAR(200)    NOT NULL                 COMMENT '이메일',
    gender      CHAR(1)         NULL                     COMMENT '성별 (M/F)',
    phone_number VARCHAR(20)    NULL                     COMMENT '전화번호',
    birthday    DATE            NULL                     COMMENT '생년월일',
    address     VARCHAR(500)    NULL                     COMMENT '주소',
    password    VARCHAR(255)    NOT NULL                 COMMENT '비밀번호 (BCrypt)',
    status      TINYINT         NOT NULL DEFAULT 1       COMMENT '상태 (1:활성, 0:비활성, 2:정지)',
    created_at  DATETIME        NOT NULL DEFAULT NOW()   COMMENT '가입일시',
    coming      DATETIME        NULL                     COMMENT '마지막 로그인 일시',
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_spr_sign_id    (id),
    UNIQUE KEY uk_spr_sign_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='회원 정보 테이블';

-- ====================================
-- 이벤트 테이블 (spr_event)
-- ====================================
CREATE TABLE IF NOT EXISTS spr_event (
    event_id    BIGINT          NOT NULL AUTO_INCREMENT  COMMENT '이벤트 ID',
    title       VARCHAR(200)    NOT NULL                 COMMENT '이벤트 제목',
    content     TEXT            NULL                     COMMENT '이벤트 내용',
    image_url   VARCHAR(500)    NULL                     COMMENT '이벤트 이미지 URL',
    start_date  DATE            NULL                     COMMENT '이벤트 시작일',
    end_date    DATE            NULL                     COMMENT '이벤트 종료일',
    status      TINYINT         NOT NULL DEFAULT 1       COMMENT '상태 (1:활성, 0:비활성)',
    created_by  BIGINT          NULL                     COMMENT '작성자 user_id',
    created_at  DATETIME        NOT NULL DEFAULT NOW()   COMMENT '등록일시',
    PRIMARY KEY (event_id),
    FOREIGN KEY fk_event_user (created_by) REFERENCES spr_sign(user_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='이벤트 테이블';

-- ====================================
-- 프로젝트 테이블 (spr_project)
-- ====================================
CREATE TABLE IF NOT EXISTS spr_project (
    project_id  BIGINT          NOT NULL AUTO_INCREMENT  COMMENT '프로젝트 ID',
    title       VARCHAR(200)    NOT NULL                 COMMENT '프로젝트 제목',
    description TEXT            NULL                     COMMENT '프로젝트 설명',
    tech_stack  VARCHAR(500)    NULL                     COMMENT '기술 스택',
    image_url   VARCHAR(500)    NULL                     COMMENT '대표 이미지 URL',
    project_url VARCHAR(500)    NULL                     COMMENT '프로젝트 링크',
    status      TINYINT         NOT NULL DEFAULT 1       COMMENT '상태',
    created_by  BIGINT          NULL                     COMMENT '작성자 user_id',
    created_at  DATETIME        NOT NULL DEFAULT NOW()   COMMENT '등록일시',
    PRIMARY KEY (project_id),
    FOREIGN KEY fk_project_user (created_by) REFERENCES spr_sign(user_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='프로젝트 소개 테이블';

-- ====================================
-- 문의하기 테이블 (spr_inquiry)
-- ====================================
CREATE TABLE IF NOT EXISTS spr_inquiry (
    inquiry_id  BIGINT          NOT NULL AUTO_INCREMENT  COMMENT '문의 ID',
    user_id     BIGINT          NULL                     COMMENT '회원 user_id (비회원 NULL)',
    name        VARCHAR(100)    NOT NULL                 COMMENT '문의자 이름',
    email       VARCHAR(200)    NOT NULL                 COMMENT '문의자 이메일',
    phone       VARCHAR(20)     NULL                     COMMENT '문의자 전화번호',
    category    VARCHAR(50)     NULL                     COMMENT '문의 카테고리',
    title       VARCHAR(200)    NOT NULL                 COMMENT '문의 제목',
    content     TEXT            NOT NULL                 COMMENT '문의 내용',
    answer      TEXT            NULL                     COMMENT '답변',
    status      TINYINT         NOT NULL DEFAULT 0       COMMENT '상태 (0:미답변, 1:답변완료)',
    created_at  DATETIME        NOT NULL DEFAULT NOW()   COMMENT '문의일시',
    answered_at DATETIME        NULL                     COMMENT '답변일시',
    PRIMARY KEY (inquiry_id),
    FOREIGN KEY fk_inquiry_user (user_id) REFERENCES spr_sign(user_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='문의하기 테이블';

-- ====================================
-- 매거진 테이블 (spr_magazine)
-- ====================================
CREATE TABLE IF NOT EXISTS spr_magazine (
    magazine_id BIGINT          NOT NULL AUTO_INCREMENT  COMMENT '매거진 ID',
    title       VARCHAR(200)    NOT NULL                 COMMENT '매거진 제목',
    content     TEXT            NULL                     COMMENT '내용',
    category    VARCHAR(100)    NULL                     COMMENT '카테고리',
    thumbnail   VARCHAR(500)    NULL                     COMMENT '썸네일 URL',
    view_count  INT             NOT NULL DEFAULT 0       COMMENT '조회수',
    status      TINYINT         NOT NULL DEFAULT 1       COMMENT '상태',
    created_by  BIGINT          NULL                     COMMENT '작성자 user_id',
    created_at  DATETIME        NOT NULL DEFAULT NOW()   COMMENT '등록일시',
    PRIMARY KEY (magazine_id),
    FOREIGN KEY fk_magazine_user (created_by) REFERENCES spr_sign(user_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='매거진 테이블';

-- ====================================
-- 초기 관리자 계정 삽입 (password: admin1234)
-- ====================================
INSERT INTO spr_sign (id, pname, email, gender, phone_number, birthday, address, password, status, created_at)
VALUES (
    'admin',
    '관리자',
    'admin@sprevn.com',
    'M',
    '010-0000-0000',
    '1990-01-01',
    '서울특별시',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTpyuI.Azou',
    1,
    NOW()
);
