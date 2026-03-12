# SPREVN 웹 애플리케이션

**React + Spring Boot + MySQL + MyBatis + JWT** 풀스택 웹 애플리케이션

---

## 📁 프로젝트 구조

```
sprevn/
├── backend/                          # Spring Boot 백엔드
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/sprevn/
│       │   ├── SprevnApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java        # Spring Security + JWT 설정
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── controller/
│       │   │   ├── AuthController.java        # 로그인/회원가입 API
│       │   │   ├── AdminController.java       # 관리자 API
│       │   │   ├── EventController.java       # 이벤트 API
│       │   │   ├── ProjectController.java     # 프로젝트 API
│       │   │   ├── InquiryController.java     # 문의하기 API
│       │   │   └── MagazineController.java    # 매거진 API
│       │   ├── dto/
│       │   │   ├── LoginRequest.java
│       │   │   ├── LoginResponse.java
│       │   │   ├── SignupRequest.java
│       │   │   └── ApiResponse.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   ├── Event.java
│       │   │   ├── Project.java
│       │   │   ├── Inquiry.java
│       │   │   └── Magazine.java
│       │   ├── mapper/                        # MyBatis Annotation 기반 (XML 없음)
│       │   │   ├── UserMapper.java
│       │   │   ├── EventMapper.java
│       │   │   ├── ProjectMapper.java
│       │   │   ├── InquiryMapper.java
│       │   │   └── MagazineMapper.java
│       │   ├── service/
│       │   │   ├── UserService.java
│       │   │   ├── EventService.java
│       │   │   ├── ProjectService.java
│       │   │   ├── InquiryService.java
│       │   │   └── MagazineService.java
│       │   ├── security/
│       │   │   ├── CustomUserDetails.java
│       │   │   ├── CustomUserDetailsService.java
│       │   │   └── JwtAuthenticationFilter.java
│       │   └── util/
│       │       └── JwtUtil.java
│       └── resources/
│           ├── application.yml
│           └── schema.sql
│
└── frontend/                         # React 프론트엔드
    ├── package.json
    ├── .env
    └── src/
        ├── App.js
        ├── index.js
        ├── api/index.js               # Axios API 클라이언트
        ├── hooks/useAuth.js           # 인증 Context/Hook
        ├── styles/global.css          # 전역 스타일
        ├── components/layout/
        │   ├── Layout.js
        │   ├── Header.js
        │   └── Footer.js
        └── pages/
            ├── main/MainPage.js       # 메인 페이지
            ├── auth/LoginPage.js      # 로그인 페이지
            ├── auth/SignupPage.js     # 회원가입 페이지
            ├── event/EventPage.js     # 이벤트 페이지
            ├── project/ProjectPage.js # 프로젝트 소개 페이지
            ├── inquiry/InquiryPage.js # 문의하기 페이지
            ├── magazine/MagazinePage.js # 매거진 페이지
            └── admin/AdminPage.js    # 관리자 페이지
```

---

## 🗄️ 데이터베이스 (MySQL - sprevn)

### spr_sign 테이블 (회원 정보)

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| user_id | BIGINT AUTO_INCREMENT | 사용자 고유 ID (PK) |
| id | VARCHAR(50) UNIQUE | 로그인 아이디 |
| pname | VARCHAR(100) | 이름 |
| email | VARCHAR(200) UNIQUE | 이메일 |
| gender | CHAR(1) | 성별 (M/F) |
| phone_number | VARCHAR(20) | 전화번호 |
| birthday | DATE | 생년월일 |
| address | VARCHAR(500) | 주소 |
| password | VARCHAR(255) | 비밀번호 (BCrypt) |
| status | TINYINT | 상태 (1:활성, 0:비활성, 2:정지) |
| created_at | DATETIME | 가입일시 |
| coming | DATETIME | 마지막 로그인 일시 |

### 추가 테이블
- `spr_event` - 이벤트
- `spr_project` - 프로젝트
- `spr_inquiry` - 문의하기
- `spr_magazine` - 매거진

---

## 🚀 실행 방법

### 1. MySQL 설정

```sql
-- schema.sql 실행
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. 백엔드 실행

```bash
# application.yml에서 DB 비밀번호 수정
cd backend
mvn spring-boot:run
# 실행: http://localhost:8080/api
```

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm start
# 실행: http://localhost:3000
```

---

## 🔐 JWT 인증 방식

- 로그인 성공 시 **Access Token** 발급 (Bearer JWT)
- 모든 인증 요청 Header: `Authorization: Bearer {token}`
- 토큰 만료: **24시간**
- `admin` 아이디는 ADMIN 권한 부여

### 초기 관리자 계정
- **아이디**: `admin`
- **비밀번호**: `admin1234`

---

## 📡 API 엔드포인트

### 인증 (공개)
| Method | URL | 설명 |
|---|---|---|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/signup | 회원가입 |
| GET | /api/auth/check-id | 아이디 중복 확인 |
| GET | /api/auth/check-email | 이메일 중복 확인 |

### 이벤트
| Method | URL | 권한 | 설명 |
|---|---|---|---|
| GET | /api/events | 공개 | 이벤트 목록 |
| GET | /api/events/{id} | 공개 | 이벤트 상세 |
| POST | /api/events | ADMIN | 이벤트 등록 |
| PUT | /api/events/{id} | ADMIN | 이벤트 수정 |
| DELETE | /api/events/{id} | ADMIN | 이벤트 삭제 |

### 프로젝트, 문의, 매거진도 동일한 패턴

### 관리자
| Method | URL | 설명 |
|---|---|---|
| GET | /api/admin/users | 회원 목록 |
| PATCH | /api/admin/users/{id}/status | 회원 상태 변경 |
| DELETE | /api/admin/users/{id} | 회원 삭제 |
| GET | /api/admin/stats | 통계 |

---

## 🖥️ 화면 구성

| 페이지 | URL | 설명 |
|---|---|---|
| 메인 | `/` | Hero, Stats, Features, 이벤트 미리보기, CTA |
| 로그인 | `/login` | JWT 로그인 |
| 회원가입 | `/signup` | 전체 회원 정보 입력 |
| 이벤트 | `/events` | 이벤트 목록 + 상세 모달 |
| 프로젝트 | `/projects` | 프로젝트 카드 + 상세 모달 |
| 문의하기 | `/inquiry` | 문의 폼 + 연락처 정보 |
| 매거진 | `/magazine` | 카테고리 필터 + 매거진 목록 |
| 관리자 | `/admin` | 대시보드 + 전체 CRUD 관리 |

---

## 🛠️ 기술 스택

### 백엔드
- **Java 17** + **Spring Boot 3.2.3**
- **Spring Security** + **JWT** (jjwt 0.11.5)
- **MyBatis** (Annotation 기반, XML 없음)
- **MySQL 8.x**
- **Lombok**, Bean Validation

### 프론트엔드
- **React 18** + **JavaScript**
- **React Router v6**
- **Axios** (JWT 인터셉터)
- **CSS Modules** + 커스텀 CSS 변수
