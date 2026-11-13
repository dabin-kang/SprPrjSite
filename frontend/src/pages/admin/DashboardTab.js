import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { getErrorMessage } from './CmsShared';

const cards = [
  { key: 'totalUsers', label: '총 회원 수', icon: '👥', color: '#667eea' },
  { key: 'totalEvents', label: '총 이벤트', icon: '🎉', color: '#f093fb' },
  { key: 'totalProjects', label: '총 프로젝트', icon: '🚀', color: '#4facfe' },
  { key: 'unansweredInquiries', label: '미답변 문의', icon: '💬', color: '#fa709a' },
];

function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    adminApi.getStats()
      .then((response) => {
        if (active) setStats(response?.data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, '통계를 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="spinner" role="status">불러오는 중...</div>;
  if (error) return <div className="alert alert-error" role="alert">{error}</div>;

  return (
    <section>
      <div className="stats-cards">
        {cards.map((card) => (
          <article
            key={card.key}
            className="stat-card"
            style={{ borderLeft: `4px solid ${card.color}` }}
          >
            <div className="stat-card-icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-card-value">{stats?.[card.key] ?? 0}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </article>
        ))}
      </div>
      <div className="admin-welcome">
        <h2>관리자 페이지</h2>
        <p>각 메뉴에서 회원과 사이트 콘텐츠를 관리할 수 있습니다.</p>
      </div>
    </section>
  );
}

export default DashboardTab;
