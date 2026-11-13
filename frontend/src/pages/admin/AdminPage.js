import React, { useState } from 'react';
import './AdminPage.css';
import DashboardTab from './DashboardTab';
import EventsTab from './EventsTab';
import InquiriesTab from './InquiriesTab';
import MagazinesTab from './MagazinesTab';
import ProjectsTab from './ProjectsTab';
import UsersTab from './UsersTab';

const TABS = [
  { key: 'dashboard', label: '대시보드', Component: DashboardTab },
  { key: 'users', label: '회원 관리', Component: UsersTab },
  { key: 'events', label: '이벤트 관리', Component: EventsTab },
  { key: 'projects', label: '프로젝트 관리', Component: ProjectsTab },
  { key: 'inquiries', label: '문의 관리', Component: InquiriesTab },
  { key: 'magazines', label: '매거진 관리', Component: MagazinesTab },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const active = TABS.find((tab) => tab.key === activeTab);
  const ActiveTab = active.Component;

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">S</span>
          <span className="admin-brand-copy">
            <strong>SPREVN</strong>
            <small>CONTROL CENTER</small>
          </span>
        </div>
        <p className="admin-nav-caption">WORKSPACE</p>
        <nav className="admin-nav" aria-label="관리자 메뉴">
          {TABS.map((tab, index) => (
            <button
              key={tab.key}
              type="button"
              className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="admin-nav-index">{String(index + 1).padStart(2, '0')}</span>
              <span>{tab.label}</span>
              <span className="admin-nav-arrow" aria-hidden="true">›</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-status">
          <span className="admin-status-dot" />
          <span>
            <strong>관리자 작업 공간</strong>
            <small>콘텐츠 운영 콘솔</small>
          </span>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">관리자 콘솔 <span>/</span> {active.label}</p>
            <h1>{active.label}</h1>
          </div>
          <div className="admin-profile">
            <span className="admin-profile-avatar">관</span>
            <span>
              <strong>관리자</strong>
              <small>Administrator</small>
            </span>
          </div>
        </header>
        <div className="admin-body">
          <ActiveTab />
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
