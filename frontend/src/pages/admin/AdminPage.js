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
        <div className="admin-logo">
          <span className="logo-sp">SP</span>REVN
          <br />
          <small>관리자</small>
        </div>
        <nav className="admin-nav" aria-label="관리자 메뉴">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <h1>{active.label}</h1>
        </header>
        <div className="admin-body">
          <ActiveTab />
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
