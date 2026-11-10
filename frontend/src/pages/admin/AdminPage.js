
import React, { useState, useEffect, useCallback } from 'react';
import {
  adminApi,
  eventApi,
  projectApi,
  inquiryApi,
  magazineApi,
} from '../../api';
import './AdminPage.css';

/* =========================================
   관리자 메뉴
========================================= */

const TABS = [
  { key: 'dashboard', label: '📊 대시보드' },
  { key: 'users', label: '👥 회원 관리' },
  { key: 'events', label: '🎉 이벤트 관리' },
  { key: 'projects', label: '🚀 프로젝트 관리' },
  { key: 'inquiries', label: '💬 문의 관리' },
  { key: 'magazines', label: '📰 매거진 관리' },
];

/* =========================================
   관리자 메인 페이지
========================================= */

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
  const [modal, setModal] = useState({
    open: false,
    type: '',
    data: null,
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  /* 데이터 불러오기 */
  const loadData = useCallback(async (tab) => {
    setLoading(true);

    try {
      if (tab === 'dashboard') {
        const res = await adminApi.getStats();
        setStats(res.data || { totalUsers: 0 });
      }

      if (tab === 'users') {
        const res = await adminApi.getUsers();
        setUsers(res.data?.users || DUMMY_USERS);
      }

      if (tab === 'events') {
        const res = await eventApi.getEvents(1, 20);
        setEvents(res.data?.events || DUMMY_EVENTS);
      }

      if (tab === 'projects') {
        const res = await projectApi.getAdminProjects(1, 20);
        setProjects(res.data?.projects ?? []);
      }

      if (tab === 'inquiries') {
        const res = await inquiryApi.getInquiries(1, 20);
        setInquiries(res.data?.inquiries || DUMMY_INQUIRIES);
      }

      if (tab === 'magazines') {
        const res = await magazineApi.getMagazines(1, 20);
        setMagazines(res.data?.magazines || DUMMY_MAGAZINES);
      }
    } catch (error) {
      console.error(`${tab} 데이터 로딩 오류:`, error);

      if (tab === 'users') setUsers(DUMMY_USERS);
      if (tab === 'events') setEvents(DUMMY_EVENTS);
      if (tab === 'projects') setProjects([]);
      if (tab === 'inquiries') setInquiries(DUMMY_INQUIRIES);
      if (tab === 'magazines') setMagazines(DUMMY_MAGAZINES);

      if (tab === 'projects') {
        showMessage('error', '프로젝트 목록을 불러오지 못했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  /* 회원 삭제 */
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await adminApi.deleteUser(userId);

      setUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );

      showMessage('success', '회원이 삭제되었습니다.');
    } catch (error) {
      showMessage('error', '회원 삭제에 실패했습니다.');
    }
  };

  /* 회원 상태 변경 */
  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await adminApi.updateUserStatus(userId, status);

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId
            ? { ...user, status }
            : user
        )
      );

      showMessage('success', '회원 상태가 변경되었습니다.');
    } catch (error) {
      showMessage('error', '상태 변경에 실패했습니다.');
    }
  };

  /* 이벤트 삭제 */
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('이벤트를 삭제하시겠습니까?')) return;

    try {
      await eventApi.deleteEvent(eventId);

      setEvents((prev) =>
        prev.filter((event) => event.eventId !== eventId)
      );

      showMessage('success', '이벤트가 삭제되었습니다.');
    } catch (error) {
      showMessage('error', '이벤트 삭제에 실패했습니다.');
    }
  };

  /* 프로젝트 삭제 */
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('프로젝트를 삭제하시겠습니까?')) return;

    try {
      await projectApi.deleteProject(projectId);

      setProjects((prev) =>
        prev.filter((project) => project.projectId !== projectId)
      );

      showMessage('success', '프로젝트가 삭제되었습니다.');
    } catch (error) {
      showMessage('error', '프로젝트 삭제에 실패했습니다.');
    }
  };

  /* 문의 답변 */
  const handleAnswerInquiry = async (inquiryId, answer) => {
    try {
      await inquiryApi.answerInquiry(inquiryId, answer);

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.inquiryId === inquiryId
            ? { ...inquiry, answer, status: 1 }
            : inquiry
        )
      );

      setModal({
        open: false,
        type: '',
        data: null,
      });

      showMessage('success', '답변이 등록되었습니다.');
    } catch (error) {
      showMessage('error', '답변 등록에 실패했습니다.');
    }
  };

  /* 매거진 삭제 */
  const handleDeleteMagazine = async (magazineId) => {
    if (!window.confirm('매거진을 삭제하시겠습니까?')) return;

    try {
      await magazineApi.deleteMagazine(magazineId);

      setMagazines((prev) =>
        prev.filter((magazine) => magazine.magazineId !== magazineId)
      );

      showMessage('success', '매거진이 삭제되었습니다.');
    } catch (error) {
      showMessage('error', '매거진 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="admin-page">

      {/* 사이드바 */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-sp">SP</span>REVN
          <br />
          <small>관리자</small>
        </div>

        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-nav-item ${
                activeTab === tab.key ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 관리자 콘텐츠 */}
      <div className="admin-content">

        <div className="admin-topbar">
          <h1>
            {TABS.find((tab) => tab.key === activeTab)?.label}
          </h1>
        </div>

        {message.text && (
          <div
            className={`alert alert-${
              message.type === 'success' ? 'success' : 'error'
            }`}
            style={{ margin: '0 24px 16px' }}
          >
            {message.text}
          </div>
        )}

        <div className="admin-body">

          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardTab
                  stats={stats}
                  users={users.length || 3}
                />
              )}

              {activeTab === 'users' && (
                <UsersTab
                  users={users}
                  onDelete={handleDeleteUser}
                  onStatusChange={handleUpdateUserStatus}
                />
              )}

              {activeTab === 'events' && (
                <EventsTab
                  events={events}
                  onDelete={handleDeleteEvent}
                  onRefresh={() => loadData('events')}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  onDelete={handleDeleteProject}
                  onRefresh={() => loadData('projects')}
                />
              )}

              {activeTab === 'inquiries' && (
                <InquiriesTab
                  inquiries={inquiries}
                  onAnswer={(inquiry) =>
                    setModal({
                      open: true,
                      type: 'answer',
                      data: inquiry,
                    })
                  }
                />
              )}

              {activeTab === 'magazines' && (
                <MagazinesTab
                  magazines={magazines}
                  onDelete={handleDeleteMagazine}
                  onRefresh={() => loadData('magazines')}
                />
              )}
            </>
          )}

        </div>
      </div>

      {/* 문의 답변 모달 */}
      {modal.open && modal.type === 'answer' && (
        <AnswerModal
          inquiry={modal.data}
          onClose={() =>
            setModal({
              open: false,
              type: '',
              data: null,
            })
          }
          onSubmit={handleAnswerInquiry}
        />
      )}

    </div>
  );
}

/* =========================================
   대시보드
========================================= */

function DashboardTab({ stats, users }) {
  const cards = [
    {
      label: '총 회원 수',
      value: stats.totalUsers || users,
      icon: '👥',
      color: '#667eea',
    },
    {
      label: '총 이벤트',
      value: '3',
      icon: '🎉',
      color: '#f093fb',
    },
    {
      label: '총 프로젝트',
      value: '6',
      icon: '🚀',
      color: '#4facfe',
    },
    {
      label: '미답변 문의',
      value: '2',
      icon: '💬',
      color: '#fa709a',
    },
  ];

  return (
    <div>
      <div className="stats-cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderLeft: `4px solid ${card.color}` }}
          >
            <div
              className="stat-card-icon"
              style={{
                background: card.color + '20',
                color: card.color,
              }}
            >
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

/* =========================================
   회원 관리
========================================= */

function UsersTab({ users, onDelete, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디</th>
            <th>이름</th>
            <th>이메일</th>
            <th>성별</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>가입일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td><strong>{user.id}</strong></td>
              <td>{user.pname}</td>
              <td>{user.email}</td>
              <td>
                {user.gender === 'M'
                  ? '남'
                  : user.gender === 'F'
                    ? '여'
                    : '-'}
              </td>
              <td>{user.phoneNumber || '-'}</td>

              <td>
                {user.status === 1 ? (
                  <span className="badge badge-success">활성</span>
                ) : user.status === 0 ? (
                  <span className="badge badge-warning">비활성</span>
                ) : (
                  <span className="badge badge-danger">정지</span>
                )}
              </td>

              <td>{user.createdAt?.split('T')[0] || '-'}</td>

              <td>
                <div className="action-buttons">
                  {user.status !== 1 && (
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => onStatusChange(user.userId, 1)}
                    >
                      활성화
                    </button>
                  )}

                  {user.status === 1 && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onStatusChange(user.userId, 2)}
                    >
                      정지
                    </button>
                  )}

                  <button
                    className="btn btn-sm"
                    style={{ background: '#dc3545', color: 'white' }}
                    onClick={() => onDelete(user.userId)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================
   이벤트 관리
========================================= */

function EventsTab({ events, onDelete, onRefresh }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
  });

  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await eventApi.createEvent(form);

      setShowForm(false);

      setForm({
        title: '',
        content: '',
        startDate: '',
        endDate: '',
      });

      await onRefresh();
    } catch (error) {
      alert(
        error?.response?.data?.message || '이벤트 등록에 실패했습니다.'
      );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
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
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">시작일</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">종료일</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                등록
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td>{event.eventId}</td>
                <td><strong>{event.title}</strong></td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>

                <td>
                  {event.status === 1 ? (
                    <span className="badge badge-success">활성</span>
                  ) : (
                    <span className="badge badge-danger">비활성</span>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#dc3545', color: 'white' }}
                    onClick={() => onDelete(event.eventId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================
   프로젝트 관리
   중복 없이 이 함수 하나만 사용
========================================= */

function ProjectsTab({ projects = [], onDelete, onRefresh }) {
  const emptyForm = {
    title: '',
    description: '',
    slug: '',
    projectNo: '',
    category: '',
    techStack: '',
    projectUrl: '',
    imageUrl: '',
    sortOrder: '0',
    status: '0',
  };

  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* 신규 프로젝트 폼 */
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setError('');
    setShowForm(true);
  };

  /* 기존 프로젝트 수정 폼 */
  const openEditForm = (project) => {
    setEditingId(project.projectId);

    setForm({
      title: project.title || '',
      description: project.description || '',
      slug: project.slug || '',
      projectNo: String(project.projectNo ?? ''),
      category: project.category || '',
      techStack: project.techStack || '',
      projectUrl: project.projectUrl || '',
      imageUrl: project.imageUrl || '',
      sortOrder: String(project.sortOrder ?? 0),
      status: String(project.status ?? 0),
    });

    setImageFile(null);
    setError('');
    setShowForm(true);
  };

  /* 프로젝트 등록 및 수정 */
  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    const title = form.title.trim();
    const slug = form.slug.trim();

    /* 필수값 검사 */
    if (!title) {
      setError('프로젝트 제목을 입력해 주세요.');
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        'URL 식별자는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
      );
      return;
    }

    if (!form.projectNo || Number(form.projectNo) < 1) {
      setError('프로젝트 번호를 1 이상으로 입력해 주세요.');
      return;
    }

    if (![0, 1].includes(Number(form.status))) {
      setError('공개 상태를 확인해 주세요.');
      return;
    }

    if (Number(form.sortOrder) < 0) {
      setError('정렬 순서는 0 이상으로 입력해 주세요.');
      return;
    }

    setSaving(true);
    setError('');

   
    try {
      /* 기존 이미지 경로 */
      let imageUrl = form.imageUrl;

     
      
/* 새 이미지가 선택되었을 때 백엔드를 통해 업로드 */
if (imageFile) {
  const uploadResult = await projectApi.uploadProjectImage(
    imageFile,
    slug
  );

  if (!uploadResult?.imageUrl) {
    throw new Error(
      uploadResult?.message || '이미지 업로드 결과를 확인할 수 없습니다.'
    );
  }

  imageUrl = uploadResult.imageUrl;
}


      /* MySQL에 저장할 데이터 */
      const payload = {
        title,
        description: form.description.trim(),
        slug,
        projectNo: Number(form.projectNo),
        category: form.category.trim(),
        techStack: form.techStack.trim(),
        projectUrl: form.projectUrl.trim(),
        imageUrl,
        sortOrder: Number(form.sortOrder || 0),
        status: Number(form.status),
      };

      /* 신규 등록 또는 수정 API */
      if (editingId !== null) {
        await projectApi.updateProject(editingId, payload);
      } else {
        await projectApi.createProject(payload);
      }

      /* 저장 성공 후 폼 초기화 */
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      setImageFile(null);
      setError('');

      alert(
        editingId !== null
          ? '프로젝트가 수정되었습니다.'
          : '프로젝트가 등록되었습니다.'
      );

      /* 프로젝트 목록 새로고침 */
      await onRefresh();

    } catch (err) {
      console.error('프로젝트 저장 오류:', err);

      

      setError(
        err?.response?.data?.message ||
        err?.message ||
        '프로젝트 저장에 실패했습니다.'
      );

    } finally {
      setSaving(false);
    }
  };

  /* 취소 */
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setError('');
  };

  return (
    <div className="projects-admin">

      {/* 상단 */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3>프로젝트 관리</h3>
          <p
            style={{
              color: 'var(--text-gray)',
              fontSize: '0.85rem',
            }}
          >
            총 {projects.length}개의 프로젝트
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateForm}
        >
          + 프로젝트 등록
        </button>
      </div>

      {/* 등록 및 수정 폼 */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body">

            <h3 style={{ marginBottom: '20px' }}>
              {editingId !== null
                ? '프로젝트 수정'
                : '새 프로젝트 등록'}
            </h3>

            <form onSubmit={handleSave}>

              {/* 프로젝트 제목 */}
              <div className="form-group">
                <label className="form-label">
                  프로젝트 제목 *
                </label>

                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="예: 창원 비엔날레"
                  required
                />
              </div>

              {/* 설명 */}
              <div className="form-group">
                <label className="form-label">
                  프로젝트 설명
                </label>

                <textarea
                  className="form-control"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="프로젝트 설명을 입력해 주세요."
                />
              </div>

              {/* 대표 이미지 */}
              <div className="form-group">
                <label className="form-label">
                  대표 이미지
                </label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] || null);
                  }}
                />

                {imageFile && (
                  <small>
                    선택한 파일: {imageFile.name}
                  </small>
                )}

                {form.imageUrl && !imageFile && (
                  <small>
                    새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                  </small>
                )}
              </div>

              {/* URL 식별자 / 프로젝트 번호 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    URL 식별자 *
                  </label>

                  <input
                    className="form-control"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="changwon-biennale"
                    required
                  />

                  <small>
                    영문 소문자, 숫자, 하이픈만 사용합니다.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    프로젝트 번호 *
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="projectNo"
                    value={form.projectNo}
                    onChange={handleChange}
                    placeholder="예: 3"
                    required
                  />
                </div>
              </div>

              {/* 카테고리 */}
              <div className="form-group">
                <label className="form-label">
                  카테고리
                </label>

                <input
                  className="form-control"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="예: 문화, 디자인, 상품개발"
                />
              </div>

              {/* 기술 스택 */}
              <div className="form-group">
                <label className="form-label">
                  기술 스택
                </label>

                <input
                  className="form-control"
                  name="techStack"
                  value={form.techStack}
                  onChange={handleChange}
                  placeholder="React, Spring Boot, MySQL"
                />
              </div>

              {/* 외부 URL */}
              <div className="form-group">
                <label className="form-label">
                  외부 프로젝트 URL
                </label>

                <input
                  type="url"
                  className="form-control"
                  name="projectUrl"
                  value={form.projectUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              {/* 정렬 / 공개 상태 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    정렬 순서
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    공개 상태
                  </label>

                  <select
                    className="form-control"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="0">비공개</option>
                    <option value="1">공개</option>
                  </select>
                </div>
              </div>

              {/* 오류 메시지 */}
              {error && (
                <div
                  style={{
                    padding: '12px',
                    marginBottom: '16px',
                    background: '#fff0f0',
                    color: '#c62828',
                    borderRadius: '6px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* 저장 / 취소 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? '저장 중...'
                    : editingId !== null
                      ? '수정 저장'
                      : '프로젝트 등록'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 프로젝트 목록 */}
      <div className="table-wrap">
        <table className="table">

          <thead>
            <tr>
              <th>번호</th>
              <th>프로젝트</th>
              <th>URL 식별자</th>
              <th>카테고리</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: 'center',
                    padding: '30px',
                  }}
                >
                  등록된 프로젝트가 없습니다.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.projectId}>
                  <td>{project.projectNo ?? '-'}</td>

                  <td>
                    <strong>{project.title}</strong>

                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-gray)',
                      }}
                    >
                      {project.description}
                    </div>
                  </td>

                  <td>{project.slug || '-'}</td>
                  <td>{project.category || '-'}</td>

                  <td>
                    {Number(project.status) === 1 ? (
                      <span className="badge badge-success">
                        공개
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        비공개
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => openEditForm(project)}
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{
                          background: '#dc3545',
                          color: 'white',
                        }}
                        onClick={() => onDelete(project.projectId)}
                      >
                        삭제
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

/* =========================================
   문의 관리
========================================= */

function InquiriesTab({ inquiries, onAnswer }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>상태</th>
            <th>문의일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.inquiryId}>
              <td>{inquiry.inquiryId}</td>
              <td>{inquiry.name}</td>
              <td>{inquiry.email}</td>
              <td>{inquiry.category || '-'}</td>
              <td><strong>{inquiry.title}</strong></td>

              <td>
                {inquiry.status === 1 ? (
                  <span className="badge badge-success">
                    답변완료
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    미답변
                  </span>
                )}
              </td>

              <td>{inquiry.createdAt?.split('T')[0] || '-'}</td>

              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onAnswer(inquiry)}
                >
                  {inquiry.status === 1 ? '답변보기' : '답변하기'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================
   매거진 관리
========================================= */

function MagazinesTab({ magazines, onDelete, onRefresh }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
  });

  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await magazineApi.createMagazine(form);

      setShowForm(false);

      setForm({
        title: '',
        content: '',
        category: '',
      });

      await onRefresh();
    } catch (error) {
      alert(
        error?.response?.data?.message || '매거진 등록에 실패했습니다.'
      );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '+ 매거진 등록'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '20px' }}>
              매거진 등록
            </h3>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">제목</label>

                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">카테고리</label>

                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">선택</option>
                  {['트렌드', '기술', '비즈니스', '디자인'].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">내용</label>

                <textarea
                  className="form-control"
                  rows={5}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary">
                등록
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>조회수</th>
              <th>상태</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {magazines.map((magazine) => (
              <tr key={magazine.magazineId}>
                <td>{magazine.magazineId}</td>
                <td><strong>{magazine.title}</strong></td>
                <td>{magazine.category}</td>
                <td>{magazine.viewCount?.toLocaleString()}</td>

                <td>
                  {magazine.status === 1 ? (
                    <span className="badge badge-success">
                      활성
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      비활성
                    </span>
                  )}
                </td>

                <td>{magazine.createdAt?.split('T')[0] || '-'}</td>

                <td>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#dc3545', color: 'white' }}
                    onClick={() => onDelete(magazine.magazineId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================
   문의 답변 모달
========================================= */

function AnswerModal({ inquiry, onClose, onSubmit }) {
  const [answer, setAnswer] = useState(inquiry.answer || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px' }}
      >
        <button
          className="modal-close"
          style={{
            top: '14px',
            right: '14px',
            background: '#666',
          }}
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-body" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>
            문의 답변
          </h2>

          <div className="inquiry-detail">
            <div>
              <strong>문의자:</strong> {inquiry.name} ({inquiry.email})
            </div>

            <div>
              <strong>제목:</strong> {inquiry.title}
            </div>

            <div className="inquiry-content-box">
              {inquiry.content}
            </div>
          </div>

          <div
            className="form-group"
            style={{ marginTop: '20px' }}
          >
            <label className="form-label">
              답변 내용
            </label>

            <textarea
              className="form-control"
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="답변을 입력해 주세요."
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => onSubmit(inquiry.inquiryId, answer)}
            disabled={!answer.trim()}
          >
            답변 등록
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   더미 데이터
========================================= */

const DUMMY_USERS = [
  {
    userId: 1,
    id: 'admin',
    pname: '관리자',
    email: 'admin@sprevn.com',
    gender: 'M',
    phoneNumber: '010-0000-0000',
    status: 1,
    createdAt: '2024-01-01',
  },
  {
    userId: 2,
    id: 'user01',
    pname: '홍길동',
    email: 'hong@example.com',
    gender: 'M',
    phoneNumber: '010-1234-5678',
    status: 1,
    createdAt: '2024-02-15',
  },
  {
    userId: 3,
    id: 'user02',
    pname: '김민지',
    email: 'kim@example.com',
    gender: 'F',
    phoneNumber: '010-9876-5432',
    status: 1,
    createdAt: '2024-03-01',
  },
];

const DUMMY_EVENTS = [
  {
    eventId: 1,
    title: '봄맞이 특별 이벤트',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    status: 1,
  },
  {
    eventId: 2,
    title: '회원가입 축하 이벤트',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 1,
  },
];

const DUMMY_INQUIRIES = [
  {
    inquiryId: 1,
    name: '홍길동',
    email: 'hong@example.com',
    category: '일반 문의',
    title: '서비스 이용 방법 문의',
    content: '서비스 이용 방법이 궁금합니다.',
    status: 0,
    createdAt: '2024-03-10',
  },
  {
    inquiryId: 2,
    name: '김민지',
    email: 'kim@example.com',
    category: '기술 지원',
    title: '로그인 오류 문의',
    content: '로그인이 안됩니다.',
    status: 1,
    answer: '확인 후 처리하겠습니다.',
    createdAt: '2024-03-05',
  },
];

const DUMMY_MAGAZINES = [
  {
    magazineId: 1,
    title: '2024 웹 트렌드',
    category: '트렌드',
    viewCount: 1250,
    status: 1,
    createdAt: '2024-03-01',
  },
  {
    magazineId: 2,
    title: 'React 18 총정리',
    category: '기술',
    viewCount: 890,
    status: 1,
    createdAt: '2024-02-20',
  },
];

export default AdminPage;
