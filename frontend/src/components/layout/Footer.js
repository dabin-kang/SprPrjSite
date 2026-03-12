import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-sp">SP</span>REVN
            </div>
            <p className="footer-desc">
              스프레브은 혁신적인 디지털 경험을 만들어가는<br />
              크리에이티브 스튜디오입니다.
            </p>
          </div>

          <div className="footer-links">
            <h4>메뉴</h4>
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/events">이벤트</Link></li>
              <li><Link to="/projects">프로젝트</Link></li>
              <li><Link to="/magazine">매거진</Link></li>
              <li><Link to="/inquiry">문의하기</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>계정</h4>
            <ul>
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/signup">회원가입</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>연락처</h4>
            <p>📧 contact@sprevn.com</p>
            <p>📞 02-0000-0000</p>
            <p>📍 서울특별시 강남구</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Sprevn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
