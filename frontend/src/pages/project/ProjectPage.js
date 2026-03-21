import React, { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../../api';
import './ProjectPage.css';

const DUMMY_PROJECTS = [
  { projectId: 1, title: 'AI 챗봇 플랫폼', description: 'GPT 기반 고객 서비스 자동화 솔루션입니다.', techStack: 'React, Spring Boot, Python, OpenAI', imageUrl: null, projectUrl: '#' },
  { projectId: 2, title: '스마트 쇼핑몰', description: '개인화 추천 알고리즘이 적용된 이커머스 플랫폼입니다.', techStack: 'Vue.js, Node.js, MySQL, Redis', imageUrl: null, projectUrl: '#' },
  { projectId: 3, title: '의료 데이터 분석', description: '빅데이터 기술을 활용한 의료 데이터 시각화 대시보드입니다.', techStack: 'React, Django, PostgreSQL, Tableau', imageUrl: null, projectUrl: '#' },
  { projectId: 4, title: '스마트 홈 IoT', description: 'IoT 기기 연동 홈 자동화 시스템입니다.', techStack: 'React Native, MQTT, Spring Boot, AWS', imageUrl: null, projectUrl: '#' },
  { projectId: 5, title: '핀테크 앱', description: '간편결제 및 자산관리 모바일 애플리케이션입니다.', techStack: 'Flutter, Spring Boot, MySQL, Blockchain', imageUrl: null, projectUrl: '#' },
  { projectId: 6, title: '교육 LMS 플랫폼', description: '온라인 강의 및 학습 관리 시스템입니다.', techStack: 'React, Spring Boot, MongoDB, WebRTC', imageUrl: null, projectUrl: '#' },
];

const TECH_COLORS = {
  React: '#61dafb', 'Spring Boot': '#6db33f', Python: '#3776ab',
  'Node.js': '#339933', MySQL: '#4479a1', Vue: '#42b883',
};

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const size = 9;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectApi.getProjects(page, size);
      setProjects(res.data?.projects || DUMMY_PROJECTS);
      setTotal(res.data?.total || DUMMY_PROJECTS.length);
    } catch {
      setProjects(DUMMY_PROJECTS);
      setTotal(DUMMY_PROJECTS.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const totalPages = Math.ceil(total / size);
  const gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  ];

  return (
    <div className="project-page">
      <div className="page-header">
        <div className="container">
          <h1>프로젝트 소개</h1>
          <p>말랑뮤즈가 진행하는 다양한 프로젝트를 소개합니다</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <div className="projects-grid">
                {projects.map((proj, idx) => (
                  <div key={proj.projectId} className="proj-card card" onClick={() => setSelected(proj)}>
                    <div className="proj-thumbnail" style={{ background: gradients[idx % gradients.length] }}>
                      <span className="proj-num">0{idx + 1}</span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{proj.title}</h3>
                      <p className="card-text">{proj.description}</p>
                      <div className="tech-stack">
                        {proj.techStack?.split(',').slice(0, 3).map((t, i) => (
                          <span key={i} className="tech-tag">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content proj-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-img" style={{ background: gradients[projects.indexOf(selected) % gradients.length] }}>
              <span className="proj-modal-num">{selected.title}</span>
            </div>
            <div className="modal-body">
              <h2>{selected.title}</h2>
              <p className="modal-desc">{selected.description}</p>
              <div className="modal-stack">
                <strong>기술 스택</strong>
                <div className="tech-stack" style={{ marginTop: '10px' }}>
                  {selected.techStack?.split(',').map((t, i) => (
                    <span key={i} className="tech-tag">{t.trim()}</span>
                  ))}
                </div>
              </div>
              {selected.projectUrl && selected.projectUrl !== '#' && (
                <a href={selected.projectUrl} target="_blank" rel="noreferrer"
                  className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                  프로젝트 보기 →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
