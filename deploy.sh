#!/bin/bash
# =====================================================
# SPREVN 배포 스크립트
# 사용법: bash deploy.sh "커밋 메시지"
# 예시:   bash deploy.sh "feat: 메인 페이지 디자인 수정"
# =====================================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 커밋 메시지 확인
COMMIT_MSG="${1}"
if [ -z "$COMMIT_MSG" ]; then
  echo -e "${RED}❌ 커밋 메시지를 입력하세요!${NC}"
  echo -e "   사용법: ${CYAN}bash deploy.sh \"feat: 변경 내용 설명\"${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  SPREVN 배포 시작  ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# ── STEP 1: 변경 파일 확인 ──────────────────────────
echo -e "${YELLOW}[1/4] 변경된 파일 확인 중...${NC}"
git status --short
echo ""

# ── STEP 2: 스테이징 & 커밋 ─────────────────────────
echo -e "${YELLOW}[2/4] 변경사항 커밋 중...${NC}"
git add -A
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ 커밋할 변경사항이 없거나 오류가 발생했습니다${NC}"
  exit 1
fi
echo -e "${GREEN}✅ 커밋 완료: \"$COMMIT_MSG\"${NC}"
echo ""

# ── STEP 3: GitHub 푸시 ──────────────────────────────
echo -e "${YELLOW}[3/4] GitHub에 푸시 중...${NC}"
git push origin main
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ 푸시 실패! 아래 명령어로 수동 실행하세요:${NC}"
  echo -e "   ${CYAN}git push origin main${NC}"
  exit 1
fi
echo -e "${GREEN}✅ GitHub 푸시 완료!${NC}"
echo ""

# ── STEP 4: 배포 안내 ────────────────────────────────
echo -e "${YELLOW}[4/4] 자동 배포 대기 중...${NC}"
echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  ✅ GitHub 업로드 완료!  ${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "  📌 ${CYAN}Vercel (프론트엔드)${NC}"
echo -e "     → GitHub 푸시 감지 후 ${YELLOW}자동으로 1~3분 내 배포됩니다${NC}"
echo -e "     → Vercel 대시보드에서 배포 진행상황 확인 가능"
echo ""
echo -e "  📌 ${CYAN}Railway (백엔드)${NC}"
echo -e "     → GitHub 푸시 감지 후 ${YELLOW}자동으로 2~5분 내 재시작됩니다${NC}"
echo -e "     → Railway 대시보드 → Deployments 탭에서 확인 가능"
echo ""
echo -e "  🔗 배포 확인 URL"
echo -e "     → 프론트엔드: https://여러분사이트.vercel.app/check"
echo -e "     → 백엔드 상태: https://여러분백엔드.railway.app/api/health"
echo ""
echo -e "  📋 커밋: ${COMMIT_MSG}"
echo -e "  🕐 시각: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
