# 01. SprPrjSite Project Overview

> 프로젝트 전체 구조와 개발 방향을 정의하는 기준 문서입니다.
>
> 작성일: 2026-11-13
> 기준: 저장소 소스 코드 분석 결과
> 상태: CMS 구현 후 소스 기준 갱신

---

## 1. Project Introduction

### 1.1 프로젝트명

- 프로젝트명: SprPrjSite
- 서비스 브랜드: 말랑뮤즈 (화면에서 확인)
- 저장소: dabin-kang/SprPrjSite
- 서비스 유형: 문화 콘텐츠 및 프로젝트 포트폴리오 웹사이트

### 1.2 프로젝트 목적

SprPrjSite는 지역 문화, 예술, 디자인 프로젝트를 소개하고 관리하기 위한 웹 플랫폼이다.

주요 목적은 다음과 같다.

1. 문화·예술 프로젝트의 온라인 전시
2. 지역 기반 콘텐츠 및 프로젝트 소개
3. 프로젝트별 상세 정보 관리
4. 관리자 CMS를 통한 콘텐츠 등록 및 관리
5. 인터넷 소원연등 프로젝트 운영
6. 향후 다양한 문화 콘텐츠를 지속적으로 확장할 수 있는 시스템 구축

### 1.3 서비스명 확인 사항

README.md에서는 SPREVN이라는 명칭을 사용하며, 실제 화면에서는 말랑뮤즈라는 브랜드명이 확인된다.

공식 서비스명과 브랜드의 관계는 추후 확정이 필요하다.

---

## 2. Main Services

현재 프로젝트에서 확인된 주요 서비스는 다음과 같다.

| 서비스 | 주요 기능 | 확인 상태 |
|---|---|---|
| 메인 페이지 | 이미지 슬라이더, 프로젝트 소개, YouTube | 구현 코드 확인 |
| 프로젝트 | 프로젝트 목록 및 카드 | 구현 코드 확인 |
| 프로젝트 상세 | 개별 프로젝트 콘텐츠 | 정적 콘텐츠 구현 |
| 관리자 | 로그인 및 관리자 페이지 | 구현 코드 확인 |
| 프로젝트 CMS | 프로젝트 등록, 수정, 삭제 | 구현 코드 확인 |
| 이벤트 | 이벤트 콘텐츠 관리 | 구현 코드 확인 |
| 문의 | 문의 페이지 및 관련 API | 구현 코드 확인 |
| 매거진 | 매거진 콘텐츠 | 구현 코드 확인 |
| 인터넷 소원연등 | 연등 조회 및 등록 | 구현 코드 확인 |
| 회원 인증 | 로그인 및 JWT 인증 | 구현 코드 확인 |

※ 구현 코드 확인은 실제 운영 환경에서의 정상 동작을 보증하지 않는다.

---

## 3. User Types

### 3.1 일반 사용자

- 메인 페이지 방문
- 프로젝트 목록 조회
- 프로젝트 상세 콘텐츠 열람
- 이벤트 및 매거진 콘텐츠 열람
- 문의 기능 이용
- 인터넷 소원연등 참여

### 3.2 관리자

- 관리자 로그인
- 프로젝트 등록 및 수정
- 프로젝트 삭제
- 프로젝트 공개 여부 관리
- 프로젝트 이미지 관리
- 이벤트 및 매거진 관리
- 콘텐츠 운영

※ 세부 권한은 실제 Security 설정과 API별 권한 검증을 기준으로 확정한다.

---

## 4. System Architecture

### 4.1 Overall Structure

```text
SprPrjSite
│
├── Frontend
│   ├── React
│   ├── React Router
│   ├── API Integration
│   └── User Interface
│
├── Backend
│   ├── Java 21
│   ├── Spring Boot 3.4.3
│   ├── Spring Security
│   ├── JWT
│   └── MyBatis
│
├── Database
│   └── MySQL
│
├── Image Storage
│   └── Supabase Storage
│
└── Deployment
    ├── Vercel
    └── Railway
```

### 4.2 Data Flow

```text
User
  ↓
React Frontend
  ↓
API Request
  ↓
Spring Boot Backend
  ↓
Controller
  ↓
Service
  ↓
Mapper
  ↓
MySQL Database
  ↓
API Response
  ↓
React Rendering
```

이미지 처리는 Supabase Storage를 사용하는 코드가 확인된다.

실제 운영 환경의 서비스 연결 상태는 별도 검증이 필요하다.

---

## 5. Frontend Structure

### 5.1 Main Directory

```text
frontend/
└── src/
    ├── api/
    ├── components/
    │   └── layout/
    ├── hooks/
    ├── libs/
    ├── pages/
    │   ├── about/
    │   ├── admin/
    │   ├── auth/
    │   ├── check/
    │   ├── event/
    │   ├── inquiry/
    │   ├── lantern/
    │   ├── magazine/
    │   ├── main/
    │   └── project/
    ├── App.js
    └── ...
```

### 5.2 Frontend Responsibilities

- 사용자 화면 렌더링
- 페이지 라우팅
- API 통신
- 사용자 인증 상태 관리
- 관리자 화면 제공
- 이미지 표시
- 프로젝트 콘텐츠 렌더링

### 5.3 Important Pages

- MainPage.js
- ProjectPage.js
- ProjectDetailPage.js
- AdminPage.js
- LoginPage.js
- LanternPage.js

실제 파일 위치는 frontend/src 하위 디렉터리를 기준으로 한다.

---

## 6. Backend Structure

### 6.1 Package Structure

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── sprevn/
        │           ├── config/
        │           ├── controller/
        │           ├── dto/
        │           ├── entity/
        │           ├── mapper/
        │           ├── security/
        │           ├── service/
        │           └── util/
        │
        └── resources/
            ├── application.yml
            └── ...
```

### 6.2 Backend Responsibilities

- REST API 제공
- 사용자 인증 및 권한 관리
- 프로젝트 데이터 처리
- CMS 데이터 처리
- 이미지 관련 API
- 인터넷 소원연등 데이터 처리
- MySQL 연동

### 6.3 Development Environment

- Java: 21
- Spring Boot: 3.4.3
- Build Tool: Gradle
- ORM / SQL: MyBatis
- Database Driver: MySQL Connector

---

## 7. CMS System

### 7.1 CMS Purpose

관리자가 개발자에게 프로젝트별 코드 작성을 요청하지 않고도 웹사이트에 프로젝트를 등록하고 관리할 수 있도록 구축한다.

### 7.2 CMS Features and Status

| 기능 | 현재 소스 상태 |
|---|---|
| 대시보드 | 회원·이벤트·프로젝트 합계와 미답변 문의 수를 API에서 조회 |
| 회원 관리 | 목록·등록·수정·상태 변경·삭제 화면 및 관리자 API |
| 이벤트 관리 | 관리자 목록·등록·수정·삭제, 공개 상태 및 기간 관리 |
| 프로젝트 CMS | 등록·수정·삭제, 임시저장/공개/비공개, 정렬 및 섹션 편집 |
| 프로젝트 이미지 | Supabase Storage 업로드 API와 대표/섹션 이미지 경로 관리 |
| 문의 관리 | 목록·상세·답변 등록/수정·삭제 |
| 매거진 관리 | 관리자 목록·등록·수정·삭제 및 공개 상태 관리 |
| 공개 프로젝트 상세 | 공개 프로젝트 API의 본문 섹션·이미지를 렌더링 |
| 매거진 | 공개 헤더 메뉴에서 진입, API 기반 목록·카테고리·상세 표시 |
| 미리보기 | 별도 미리보기 기능은 아직 구현되지 않음 |

### 7.3 Current Implementation

소스 코드에 다음 관리자 메뉴와 API 연동이 구현되어 있으며, 프런트엔드 빌드와 백엔드 컴파일이 확인되었다.

- 대시보드 실제 집계 조회
- 회원 CRUD 및 상태 관리
- 이벤트 CRUD와 공개/기간 관리
- 프로젝트 CRUD, 상세 섹션/이미지 편집, 상태 관리
- 문의 답변 및 삭제
- 매거진 CRUD와 공개 상태 관리
- 프로젝트 이미지 Supabase Storage 업로드 경로
- 공개 프로젝트 목록과 DB 프로젝트 상세 연결

위 검증은 코드 빌드/컴파일 범위다. 실제 운영 DB 연결, migration 적용, 인증 후 관리자 API 동작은 별도로 확인되지 않았다.

### 7.4 Outstanding Issues

1. `project_cms_migration.sql`이 실제 개발/운영 MySQL에 적용되었는지 확인해야 한다.
2. 운영 API에서 프로젝트 목록은 응답하지만 공개 프로젝트 상세는 500을 반환했다. 콘텐츠 테이블 migration 적용 여부 확인과 상세 API 재검증이 필요하다.
3. 실제 DB와 Supabase 설정을 사용한 CMS 등록·업로드·공개 상세 end-to-end 검증이 필요하다.
4. Vercel/Railway 운영 환경의 환경변수와 실제 배포 상태는 저장소만으로 확인할 수 없다.
5. 프로젝트 게시 전 미리보기 기능은 미구현이다.
6. 콘텐츠에서 이미지 참조를 제거해도 Supabase Storage의 실제 파일은 자동 삭제되지 않는다.
7. Backend 테스트는 추가했지만 전체 서비스 통합 테스트 및 Frontend 자동 테스트는 아직 구성되지 않았다.

---

## 8. Database

### 8.1 Database System

- Database: MySQL
- Connection: Spring Boot DataSource
- SQL Mapper: MyBatis
- Connection Configuration: application.yml

### 8.2 Main Database Tables

현재 SQL 파일에서 확인된 테이블 범위:

- 회원
- 프로젝트
- 이벤트
- 문의
- 매거진
- 프로젝트 CMS 관련 추가 테이블

### 8.3 Database Migration

관련 SQL 파일:

- schema.sql
- project_cms_migration.sql

주의 사항:

1. SQL 파일이 존재한다고 실제 DB에 적용된 것은 아니다.
2. 프로젝트 CMS migration 적용 여부를 확인해야 한다.
3. LanternMapper가 사용하는 lanterns 테이블 생성 SQL이 확인되지 않았다.
4. 프로젝트 상태 값의 정의와 Service 검증 규칙을 통일해야 한다.

### 8.4 Database Policy

- 기존 DB 데이터를 보호한다.
- 스키마 변경 전에 기존 테이블을 확인한다.
- 데이터 삭제 SQL은 사용자 승인 없이 실행하지 않는다.
- Migration 적용 상태를 기록한다.
- 데이터베이스 변경 사항은 03_DATABASE.md에 기록한다.

---

## 9. Deployment Environment

### 9.1 Frontend

- Platform: Vercel
- Build Tool: React Scripts (실제 package.json 기준)
- Build Configuration: frontend/package.json

### 9.2 Backend

- Platform: Railway
- Framework: Spring Boot
- Build: Gradle
- Container: Docker
- Health Check: /api/health

### 9.3 Database

- Platform: Railway MySQL
- Connection: Environment Variables

### 9.4 Image Storage

- Service: Supabase Storage
- Usage: 프로젝트 이미지 및 관련 콘텐츠 이미지

### 9.5 Deployment Verification

저장소의 설정 파일만으로 실제 운영 환경의 연결 및 배포 성공 여부를 보증할 수 없다.

다음 항목을 별도 검증해야 한다.

- Vercel Root Directory
- Vercel 환경변수
- Railway 환경변수
- Railway MySQL 연결
- Supabase Storage 접근 권한
- Frontend와 Backend API 통신
- 실제 운영 사이트 기능 테스트

---

## 10. Current Development Status

### 10.1 Implemented in Source Code

- React 기반 페이지 구성
- 메인 페이지
- 정적 및 DB 프로젝트 목록
- 정적 상세 페이지와 DB 공개 프로젝트 상세
- 관리자 로그인 및 JWT 인증 흐름
- 대시보드 통계 조회
- 회원 관리(목록, 등록, 수정, 상태 변경, 삭제)
- 이벤트 관리(목록, 등록, 수정, 삭제)
- 프로젝트 CMS(등록, 수정, 삭제, 공개 상태, 섹션/이미지 관리)
- Supabase Storage 프로젝트 이미지 업로드 경로
- 문의 관리(목록, 답변, 삭제)
- 매거진 관리(목록, 등록, 수정, 삭제)
- 이벤트 및 문의 관련 페이지/API
- 매거진 관련 페이지/API
- 인터넷 소원연등 조회 및 등록 코드
- MySQL 연결 설정
- Vercel 및 Railway 배포 설정 일부

### 10.2 Needs Improvement

| 우선순위 | 항목 | 개선 방향 |
|---|---|---|
| 높음 | DB 스키마 검증 | CMS migration 적용 상태 확인 및 실제 MySQL CRUD 검증 |
| 높음 | 운영 통합 검증 | 관리자 인증, 이미지 업로드, 공개 상세 흐름을 실제 환경에서 검증 |
| 중간 | 프로젝트 미리보기 | 게시 전 미리보기 기능 추가 여부 결정 및 구현 |
| 중간 | 테스트 체계 | 추가 API/서비스와 프런트엔드에 대한 자동 테스트 확대 |
| 중간 | 운영 배포 검증 | Vercel/Railway 환경변수 및 배포 상태 확인 |
| 낮음 | README/문서 정합성 | README의 기술 스택과 현재 소스 비교 후 갱신 |

### 10.3 Important Technical Issues

1. CMS 테이블 migration이 운영 DB에 적용되었는지는 확인되지 않았다.
2. Lantern DB 테이블 생성 SQL 및 연등 삭제 권한은 별도 검증이 필요하다.
3. Vercel/Railway 배포와 외부 Supabase 설정은 저장소에서 운영 동작 여부를 확인할 수 없다.
4. Frontend 자동 테스트 스크립트는 없고, Backend 테스트는 이번 작업에서 일부 단위 테스트를 추가했다.
5. README와 실제 개발 환경의 차이는 별도 대조가 필요하다.

---

## 11. Future Development Direction

### Phase 1. Documentation

- AGENTS.md 개발 규칙 구축
- 프로젝트 개요 작성
- 기술 스택 문서화
- DB 구조 문서화
- API 명세 작성

### Phase 2. CMS Completion

- 프로젝트 CRUD 완성
- 프로젝트 상세 데이터 연동
- 이미지 업로드 및 관리
- 프로젝트 미리보기
- 공개 및 비공개 처리
- 관리자 대시보드 개선

### Phase 3. Content Management

- 이벤트 관리 개선
- 매거진 관리 개선
- 인터넷 소원연등 DB 검증
- 콘텐츠 관리 기능 통합

### Phase 4. System Stabilization

- 보안 검증
- API 테스트
- DB 무결성 검증
- Frontend 테스트
- Backend 테스트
- 배포 환경 검증

### Phase 5. Continuous Expansion

- 프로젝트 콘텐츠 확장
- 관리 기능 고도화
- 사용자 경험 개선
- 모바일 반응형 개선
- 문화 콘텐츠 서비스 확장

---

## 12. Documentation Maintenance

이 문서는 프로젝트 전체 구조를 이해하기 위한 최상위 안내 문서다.

세부 정보는 다음 문서를 참고한다.

| 문서 | 설명 |
|---|---|
| AGENTS.md | Codex 개발 규칙 |
| 01_PROJECT_OVERVIEW.md | 프로젝트 전체 개요 |
| 02_TECH_STACK.md | 기술 스택 |
| 03_DATABASE.md | DB 구조 |
| 04_FRONTEND.md | 프론트엔드 구조 |
| 05_BACKEND.md | 백엔드 구조 |
| 06_CMS_DESIGN.md | CMS 설계 |
| 07_API_SPECIFICATION.md | API 명세 |
| 08_DEVELOPMENT_PLAN.md | 개발 계획 |
| 09_TODO.md | 작업 목록 |
| 10_CHANGELOG.md | 변경 기록 |

### Documentation Principles

- 실제 구현된 내용만 완료로 표시한다.
- 변경된 코드와 문서를 함께 관리한다.
- 확인되지 않은 정보는 미확인으로 표시한다.
- 데이터베이스 변경은 별도 기록한다.
- 운영 환경 검증 결과를 소스 코드 분석 결과와 구분한다.

---

**Document Status:** Initial Analysis Completed

**Next Document:** 02_TECH_STACK.md