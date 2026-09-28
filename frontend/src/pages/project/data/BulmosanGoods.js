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
    paths: [
      'KakaoTalk_2026_bs.jpg',
      'FvDZIP7akAI7MZr.jpg',
      '1682221947960.jpg',
      '20231021_132925.jpg',
    ],
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

  




  sections: [
    {
      title: '상품개발',

      products: [
        {
          title: '불모산 석고 방향제',
          text: `
            불모산의 형태를 모티브로 제작한
            석고 방향제입니다.
          `,
          image: 'KakaoTalk_2026_bs.jpg',
        },

        {
          title: '성주사 곰모형 종',
          text: `
            성주사와 불모산의 이야기를 담은
            곰 모형 풍경입니다.
          `,
          image: 'FvDZIP7akAI7MZr.jpg',
        },

        {
          title: '돌탑 모형',
          text: `
            불모산과 성주사의 돌탑에서 착안한
            작은 오브제 상품입니다.
          `,
          image: 'FvDZIP7akAI7MZr.jpg',
        },
      ],
    },
  ],
};

export default project;