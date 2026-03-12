import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api';
import './Auth.css';

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '', pname: '', email: '', gender: '', phoneNumber: '',
    birthday: '', address: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.id || form.id.length < 4) errs.id = '아이디는 4자 이상이어야 합니다';
    if (!form.pname) errs.pname = '이름을 입력해주세요';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일을 입력해주세요';
    if (!form.password || form.password.length < 6) errs.password = '비밀번호는 6자 이상이어야 합니다';
    if (form.password !== form.confirmPassword) errs.confirmPassword = '비밀번호가 일치하지 않습니다';
    return errs;
  };

  const checkDuplicate = async () => {
    try {
      const idRes = await authApi.checkId(form.id);
      if (idRes.data?.exists) return { id: '이미 사용 중인 아이디입니다' };
      const emailRes = await authApi.checkEmail(form.email);
      if (emailRes.data?.exists) return { email: '이미 사용 중인 이메일입니다' };
    } catch {}
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validErrs = validate();
    if (Object.keys(validErrs).length > 0) { setErrors(validErrs); return; }

    setLoading(true);
    try {
      const dupErrs = await checkDuplicate();
      if (Object.keys(dupErrs).length > 0) { setErrors(dupErrs); return; }

      const { confirmPassword, ...signupData } = form;
      await signup(signupData);
      setSuccess('회원가입이 완료되었습니다!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrors({ form: typeof err === 'string' ? err : '회원가입에 실패했습니다' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container signup-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <span className="logo-sp">SP</span>REVN
            </div>
            <h2>스프레브에 오신 것을<br />환영합니다!</h2>
            <p>회원가입하고 스프레브의<br />모든 서비스를 이용하세요.</p>
            <div className="auth-visual-deco">
              <div className="deco-circle" />
              <div className="deco-circle deco-2" />
            </div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <h1 className="auth-title">회원가입</h1>
            <p className="auth-sub">새 계정을 만들어보세요</p>

            {errors.form && <div className="alert alert-error">{errors.form}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">아이디 <span className="required">*</span></label>
                  <input type="text" name="id" className={`form-control ${errors.id ? 'error' : ''}`}
                    placeholder="4자 이상" value={form.id} onChange={handleChange} />
                  {errors.id && <span className="form-error">{errors.id}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">이름 <span className="required">*</span></label>
                  <input type="text" name="pname" className={`form-control ${errors.pname ? 'error' : ''}`}
                    placeholder="실명을 입력하세요" value={form.pname} onChange={handleChange} />
                  {errors.pname && <span className="form-error">{errors.pname}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">이메일 <span className="required">*</span></label>
                <input type="email" name="email" className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="example@email.com" value={form.email} onChange={handleChange} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">성별</label>
                  <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                    <option value="">선택</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">생년월일</label>
                  <input type="date" name="birthday" className="form-control"
                    value={form.birthday} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">전화번호</label>
                <input type="text" name="phoneNumber" className="form-control"
                  placeholder="010-0000-0000" value={form.phoneNumber} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">주소</label>
                <input type="text" name="address" className="form-control"
                  placeholder="주소를 입력하세요" value={form.address} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">비밀번호 <span className="required">*</span></label>
                  <input type="password" name="password" className={`form-control ${errors.password ? 'error' : ''}`}
                    placeholder="6자 이상" value={form.password} onChange={handleChange} />
                  {errors.password && <span className="form-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">비밀번호 확인 <span className="required">*</span></label>
                  <input type="password" name="confirmPassword" className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="비밀번호 재입력" value={form.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', padding: '14px' }} disabled={loading}>
                {loading ? '처리 중...' : '회원가입'}
              </button>
            </form>

            <div className="auth-footer">
              <p>이미 계정이 있으신가요?
                <Link to="/login"> 로그인</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
