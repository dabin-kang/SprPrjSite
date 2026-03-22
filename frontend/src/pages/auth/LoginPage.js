import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.password) {
      setError('아이디와 비밀번호를 입력해주세요');
      return;
    }
    setLoading(true);
    try {
      await login(form.id, form.password);
      navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <span className="logo-sp">SP</span>REVN
            </div>
            <h2>다시 만나서 반갑습니다!</h2>
            <p>말랑뮤즈의 다양한 서비스를<br />로그인하고 경험해보세요.</p>
            <div className="auth-visual-deco">
              <div className="deco-circle" />
              <div className="deco-circle deco-2" />
            </div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <h1 className="auth-title">로그인</h1>
            <p className="auth-sub">계정에 로그인하세요</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">아이디</label>
                <input
                  type="text"
                  name="id"
                  className="form-control"
                  placeholder="아이디를 입력하세요"
                  value={form.id}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', padding: '14px' }}
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="auth-footer">
              <p>계정이 없으신가요?
                <Link to="/signup"> 회원가입</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
