const project = {
  id: 'bulmosan-goods',
  number: '02',
  title: '불모산 굿즈',
  description: '창원의 불모산과 지역의 이야기를 담은 문화상품 개발',

  // 여기에는 로컬 이미지 경로를 넣지 않음
  image: null,

  // Supabase Storage 이미지 경로 정보
  storage: {
    bucket: 'spr_sg',
    path:'KakaoTalk_2026_bs.jpg',
  },

  intro: `
    불모산과 성주사의 이야기를 담은
    지역문화상품 개발 프로젝트.
  `,

  content: `
    창원의 불모산과 성주사를 소재로 한
    지역문화상품 개발 프로젝트입니다.

    산의 형태와 지역의 이야기를 바탕으로
    일상에서 사용할 수 있는 상품을 디자인합니다.
  `,

  
  storage: {
    bucket: 'spr_sg',
    path:'FvDZIP7akAI7MZr.jpg',
  },



  sections: [
    {
      title: '상품개발',
      text: `
        1. 불모산 석고 방향제
        2. 성주사 곰모형 종
        3. 돌탑 모형
      `,
    },
  ],
};

export default project;