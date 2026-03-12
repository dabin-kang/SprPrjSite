import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: '홈' },
    { path: '/events', label: '이벤트' },
    { path: '/projects', label: '프로젝트' },
    { path: '/magazine', label: '매거진' },
    { path: '/inquiry', label: '문의하기' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-sp">SP</span>REVN
        </Link>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user.pname}님</span>
              {isAdmin && (
                <Link to="/admin" className="btn btn-sm btn-dark" onClick={() => setMenuOpen(false)}>
                  관리자
                </Link>
              )}
              <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-sm btn-secondary">로그인</Link>
              <Link to="/signup" className="btn btn-sm btn-primary">회원가입</Link>
            </div>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="mobile-auth">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-dark" onClick={() => setMenuOpen(false)}>관리자</Link>
                )}
                <button className="btn btn-sm btn-secondary" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setMenuOpen(false)}>로그인</Link>
                <Link to="/signup" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
