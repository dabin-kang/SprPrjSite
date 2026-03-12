import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, eventApi, projectApi, inquiryApi, magazineApi } from '../../api';
import './AdminPage.css';

const TABS = [
  { key: 'dashboard', label: '📊 대시보드' },
  { key: 'users', label: '👥 회원 관리' },
  { key: 'events', label: '🎉 이벤트 관리' },
  { key: 'projects', label: '🚀 프로젝트 관리' },
  { key: 'inquiries', label: '💬 문의 관리' },
  { key: 'magazines', label: '📰 매거진 관리' },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0 });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [modal, setModal] = useState({ open: false, type: '', data: null });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 데이터 로드
  const loadData = useCallback(async (tab) => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const res = await adminApi.getStats();
        setStats(res.data || { totalUsers: 5 });
      } else if (tab === 'users') {
        const res = await adminApi.getUsers();
        setUsers(res.data?.users || DUMMY_USERS);
      } else if (tab === 'events') {
        const res = await eventApi.getEvents(1, 20);
        setEvents(res.data?.events || DUMMY_EVENTS);
      } else if (tab === 'projects') {
        const res = await projectApi.getProjects(1, 20);
        setProjects(res.data?.projects || DUMMY_PROJECTS);
      } else if (tab === 'inquiries') {
        const res = await inquiryApi.getInquiries(1, 20);
        setInquiries(res.data?.inquiries || DUMMY_INQUIRIES);
      } else if (tab === 'magazines') {
        const res = await magazineApi.getMagazines(1, 20);
        setMagazines(res.data?.magazines || DUMMY_MAGAZINES);
      }
    } catch {
      if (tab === 'users') setUsers(DUMMY_USERS);
      if (tab === 'events') setEvents(DUMMY_EVENTS);
      if (tab === 'projects') setProjects(DUMMY_PROJECTS);
      if (tab === 'inquiries') setInquiries(DUMMY_INQUIRIES);
      if (tab === 'magazines') setMagazines(DUMMY_MAGAZINES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(activeTab); }, [activeTab, loadData]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.userId !== userId));
      showMessage('success', '회원이 삭제되었습니다');
    } catch { showMessage('error', '삭제에 실패했습니다'); }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await adminApi.updateUserStatus(userId, status);
      setUsers(users.map(u => u.userId === userId ? { ...u, status } : u));
      showMessage('success', '상태가 변경되었습니다');
    } catch { showMessage('error', '상태 변경에 실패했습니다'); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('이벤트를 삭제하시겠습니까?')) return;
    try {
      await eventApi.deleteEvent(eventId);
      setEvents(events.filter(e => e.eventId !== eventId));
      showMessage('success', '이벤트가 삭제되었습니다');
    } catch { showMessage('error', '삭제에 실패했습니다'); }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('프로젝트를 삭제하시겠습니까?')) return;
    try {
      await projectApi.deleteProject(projectId);
      setProjects(projects.filter(p => p.projectId !== projectId));
      showMessage('success', '프로젝트가 삭제되었습니다');
    } catch { showMessage('error', '삭제에 실패했습니다'); }
  };

  const handleAnswerInquiry = async (inquiryId, answer) => {
    try {
      await inquiryApi.answerInquiry(inquiryId, answer);
      setInquiries(inquiries.map(i => i.inquiryId === inquiryId ? { ...i, answer, status: 1 } : i));
      setModal({ open: false, type: '', data: null });
      showMessage('success', '답변이 등록되었습니다');
    } catch { showMessage('error', '답변 등록에 실패했습니다'); }
  };

  const handleDeleteMagazine = async (magazineId) => {
    if (!window.confirm('매거진을 삭제하시겠습니까?')) return;
    try {
      await magazineApi.deleteMagazine(magazineId);
      setMagazines(magazines.filter(m => m.magazineId !== magazineId));
      showMessage('success', '매거진이 삭제되었습니다');
    } catch { showMessage('error', '삭제에 실패했습니다'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-sp">SP</span>REVN<br />
          <small>관리자</small>
        </div>
        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-topbar">
          <h1>{TABS.find(t => t.key === activeTab)?.label}</h1>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}
            style={{ margin: '0 24px 16px' }}>
            {message.text}
          </div>
        )}

        <div className="admin-body">
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab stats={stats} users={users.length || 3} />}
              {activeTab === 'users' && (
                <UsersTab users={users} onDelete={handleDeleteUser} onStatusChange={handleUpdateUserStatus} />
              )}
              {activeTab === 'events' && (
                <EventsTab events={events} onDelete={handleDeleteEvent} onRefresh={() => loadData('events')} />
              )}
              {activeTab === 'projects' && (
                <ProjectsTab projects={projects} onDelete={handleDeleteProject} onRefresh={() => loadData('projects')} />
              )}
              {activeTab === 'inquiries' && (
                <InquiriesTab inquiries={inquiries} onAnswer={(inq) => setModal({ open: true, type: 'answer', data: inq })} />
              )}
              {activeTab === 'magazines' && (
                <MagazinesTab magazines={magazines} onDelete={handleDeleteMagazine} onRefresh={() => loadData('magazines')} />
              )}
            </>
          )}
        </div>
      </div>

      {/* 답변 모달 */}
      {modal.open && modal.type === 'answer' && (
        <AnswerModal
          inquiry={modal.data}
          onClose={() => setModal({ open: false, type: '', data: null })}
          onSubmit={handleAnswerInquiry}
        />
      )}
    </div>
  );
}

/* ========== 대시보드 탭 ========== */
function DashboardTab({ stats, users }) {
  const cards = [
    { label: '총 회원 수', value: stats.totalUsers || users, icon: '👥', color: '#667eea' },
    { label: '총 이벤트', value: '3', icon: '🎉', color: '#f093fb' },
    { label: '총 프로젝트', value: '6', icon: '🚀', color: '#4facfe' },
    { label: '미답변 문의', value: '2', icon: '💬', color: '#fa709a' },
  ];
  return (
    <div>
      <div className="stats-cards">
        {cards.map((card, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <div className="stat-card-icon" style={{ background: card.color + '20', color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-welcome">
        <h3>관리자 페이지에 오신 것을 환영합니다</h3>
        <p>왼쪽 메뉴에서 각 섹션을 관리하실 수 있습니다.</p>
      </div>
    </div>
  );
}

/* ========== 회원 관리 탭 ========== */
function UsersTab({ users, onDelete, onStatusChange }) {
  return (
    <div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>아이디</th><th>이름</th><th>이메일</th>
              <th>성별</th><th>전화번호</th><th>상태</th><th>가입일</th><th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td><strong>{user.id}</strong></td>
                <td>{user.pname}</td>
                <td>{user.email}</td>
                <td>{user.gender === 'M' ? '남' : user.gender === 'F' ? '여' : '-'}</td>
                <td>{user.phoneNumber || '-'}</td>
                <td>
                  {user.status === 1 ? <span className="badge badge-success">활성</span>
                    : user.status === 0 ? <span className="badge badge-warning">비활성</span>
                    : <span className="badge badge-danger">정지</span>}
                </td>
                <td>{user.createdAt?.split('T')[0] || '-'}</td>
                <td>
                  <div className="action-buttons">
                    {user.status !== 1 && (
                      <button className="btn btn-sm btn-dark" onClick={() => onStatusChange(user.userId, 1)}>활성화</button>
                    )}
                    {user.status === 1 && (
                      <button className="btn btn-sm btn-secondary" onClick={() => onStatusChange(user.userId, 2)}>정지</button>
                    )}
                    <button className="btn btn-sm" style={{background:'#dc3545',color:'white'}} onClick={() => onDelete(user.userId)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== 이벤트 관리 탭 ========== */
function EventsTab({ events, onDelete, onRefresh }) {
  const [form, setForm] = useState({ title: '', content: '', startDate: '', endDate: '' });
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await eventApi.createEvent(form);
      setShowForm(false);
      setForm({ title: '', content: '', startDate: '', endDate: '' });
      onRefresh();
    } catch (err) { alert(typeof err === 'string' ? err : '등록 실패'); }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '취소' : '+ 이벤트 등록'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>이벤트 등록</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">제목</label>
                <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea className="form-control" rows={3} value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">시작일</label>
                  <input type="date" className="form-control" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">종료일</label>
                  <input type="date" className="form-control" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>제목</th><th>시작일</th><th>종료일</th><th>상태</th><th>관리</th></tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td>{event.eventId}</td>
                <td><strong>{event.title}</strong></td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>
                <td>{event.status === 1 ? <span className="badge badge-success">활성</span> : <span className="badge badge-danger">비활성</span>}</td>
                <td>
                  <button className="btn btn-sm" style={{background:'#dc3545',color:'white'}} onClick={() => onDelete(event.eventId)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== 프로젝트 관리 탭 ========== */
function ProjectsTab({ projects, onDelete, onRefresh }) {
  const [form, setForm] = useState({ title: '', description: '', techStack: '', projectUrl: '' });
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectApi.createProject(form);
      setShowForm(false);
      setForm({ title: '', description: '', techStack: '', projectUrl: '' });
      onRefresh();
    } catch (err) { alert(typeof err === 'string' ? err : '등록 실패'); }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '취소' : '+ 프로젝트 등록'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>프로젝트 등록</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">제목</label>
                <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">설명</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">기술 스택 (쉼표로 구분)</label>
                <input className="form-control" value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} placeholder="React, Spring Boot, MySQL" />
              </div>
              <div className="form-group">
                <label className="form-label">프로젝트 URL</label>
                <input className="form-control" value={form.projectUrl} onChange={e => setForm({...form, projectUrl: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>제목</th><th>기술 스택</th><th>상태</th><th>관리</th></tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj.projectId}>
                <td>{proj.projectId}</td>
                <td><strong>{proj.title}</strong></td>
                <td><span style={{fontSize:'0.82rem',color:'var(--text-gray)'}}>{proj.techStack}</span></td>
                <td>{proj.status === 1 ? <span className="badge badge-success">활성</span> : <span className="badge badge-danger">비활성</span>}</td>
                <td>
                  <button className="btn btn-sm" style={{background:'#dc3545',color:'white'}} onClick={() => onDelete(proj.projectId)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== 문의 관리 탭 ========== */
function InquiriesTab({ inquiries, onAnswer }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>ID</th><th>이름</th><th>이메일</th><th>카테고리</th><th>제목</th><th>상태</th><th>문의일</th><th>관리</th></tr>
        </thead>
        <tbody>
          {inquiries.map((inq) => (
            <tr key={inq.inquiryId}>
              <td>{inq.inquiryId}</td>
              <td>{inq.name}</td>
              <td>{inq.email}</td>
              <td>{inq.category || '-'}</td>
              <td><strong>{inq.title}</strong></td>
              <td>{inq.status === 1 ? <span className="badge badge-success">답변완료</span> : <span className="badge badge-warning">미답변</span>}</td>
              <td>{inq.createdAt?.split('T')[0] || '-'}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => onAnswer(inq)}>
                  {inq.status === 1 ? '답변보기' : '답변하기'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ========== 매거진 관리 탭 ========== */
function MagazinesTab({ magazines, onDelete, onRefresh }) {
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await magazineApi.createMagazine(form);
      setShowForm(false);
      setForm({ title: '', content: '', category: '' });
      onRefresh();
    } catch (err) { alert(typeof err === 'string' ? err : '등록 실패'); }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '취소' : '+ 매거진 등록'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>매거진 등록</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">제목</label>
                <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">카테고리</label>
                <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="">선택</option>
                  {['트렌드', '기술', '비즈니스', '디자인'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea className="form-control" rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>제목</th><th>카테고리</th><th>조회수</th><th>상태</th><th>등록일</th><th>관리</th></tr>
          </thead>
          <tbody>
            {magazines.map((mag) => (
              <tr key={mag.magazineId}>
                <td>{mag.magazineId}</td>
                <td><strong>{mag.title}</strong></td>
                <td>{mag.category}</td>
                <td>{mag.viewCount?.toLocaleString()}</td>
                <td>{mag.status === 1 ? <span className="badge badge-success">활성</span> : <span className="badge badge-danger">비활성</span>}</td>
                <td>{mag.createdAt?.split('T')[0] || '-'}</td>
                <td>
                  <button className="btn btn-sm" style={{background:'#dc3545',color:'white'}} onClick={() => onDelete(mag.magazineId)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== 답변 모달 ========== */
function AnswerModal({ inquiry, onClose, onSubmit }) {
  const [answer, setAnswer] = useState(inquiry.answer || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth:'560px'}}>
        <button className="modal-close" style={{top:'14px',right:'14px',background:'#666'}} onClick={onClose}>✕</button>
        <div className="modal-body" style={{padding:'32px'}}>
          <h2 style={{marginBottom:'8px'}}>문의 답변</h2>
          <div className="inquiry-detail">
            <div><strong>문의자:</strong> {inquiry.name} ({inquiry.email})</div>
            <div><strong>제목:</strong> {inquiry.title}</div>
            <div className="inquiry-content-box">{inquiry.content}</div>
          </div>
          <div className="form-group" style={{marginTop:'20px'}}>
            <label className="form-label">답변 내용</label>
            <textarea className="form-control" rows={5} value={answer}
              onChange={(e) => setAnswer(e.target.value)} placeholder="답변을 입력해주세요" />
          </div>
          <button className="btn btn-primary" style={{width:'100%'}}
            onClick={() => onSubmit(inquiry.inquiryId, answer)} disabled={!answer.trim()}>
            답변 등록
          </button>
        </div>
      </div>
    </div>
  );
}

// Dummy data
const DUMMY_USERS = [
  { userId: 1, id: 'admin', pname: '관리자', email: 'admin@sprevn.com', gender: 'M', phoneNumber: '010-0000-0000', status: 1, createdAt: '2024-01-01' },
  { userId: 2, id: 'user01', pname: '홍길동', email: 'hong@example.com', gender: 'M', phoneNumber: '010-1234-5678', status: 1, createdAt: '2024-02-15' },
  { userId: 3, id: 'user02', pname: '김민지', email: 'kim@example.com', gender: 'F', phoneNumber: '010-9876-5432', status: 1, createdAt: '2024-03-01' },
];
const DUMMY_EVENTS = [
  { eventId: 1, title: '봄맞이 특별 이벤트', startDate: '2024-03-01', endDate: '2024-04-30', status: 1 },
  { eventId: 2, title: '회원가입 축하 이벤트', startDate: '2024-01-01', endDate: '2024-12-31', status: 1 },
];
const DUMMY_PROJECTS = [
  { projectId: 1, title: 'AI 챗봇 플랫폼', techStack: 'React, Spring Boot, Python', status: 1 },
  { projectId: 2, title: '스마트 쇼핑몰', techStack: 'Vue.js, Node.js, MySQL', status: 1 },
];
const DUMMY_INQUIRIES = [
  { inquiryId: 1, name: '홍길동', email: 'hong@example.com', category: '일반 문의', title: '서비스 이용 방법 문의', content: '서비스 이용 방법이 궁금합니다.', status: 0, createdAt: '2024-03-10' },
  { inquiryId: 2, name: '김민지', email: 'kim@example.com', category: '기술 지원', title: '로그인 오류 문의', content: '로그인이 안됩니다.', status: 1, answer: '확인 후 처리하겠습니다.', createdAt: '2024-03-05' },
];
const DUMMY_MAGAZINES = [
  { magazineId: 1, title: '2024 웹 트렌드', category: '트렌드', viewCount: 1250, status: 1, createdAt: '2024-03-01' },
  { magazineId: 2, title: 'React 18 총정리', category: '기술', viewCount: 890, status: 1, createdAt: '2024-02-20' },
];

export default AdminPage;
