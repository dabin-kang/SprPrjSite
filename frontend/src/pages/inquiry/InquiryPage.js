import React, { useState } from 'react';
import { inquiryApi } from '../../api';
import './InquiryPage.css';

const CATEGORIES = ['일반 문의', '서비스 문의', '파트너십', '기술 지원', '기타'];

function InquiryPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', category: '',
    title: '', content: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = '이름을 입력해주세요';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일을 입력해주세요';
    if (!form.title) errs.title = '제목을 입력해주세요';
    if (!form.content || form.content.length < 10) errs.content = '문의 내용을 10자 이상 입력해주세요';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await inquiryApi.createInquiry(form);
      setSuccess('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
      setForm({ name: '', email: '', phone: '', category: '', title: '', content: '' });
    } catch (err) {
      setErrors({ form: typeof err === 'string' ? err : '문의 접수에 실패했습니다' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-page">
      <div className="page-header">
        <div className="container">
          <h1>문의하기</h1>
          <p>궁금한 점이 있으신가요? 언제든지 문의해 주세요</p>
        </div>
      </div>

      <section className="section">
        <div className="container inquiry-container">
          {/* 연락처 정보 */}
          <div className="inquiry-info">
            <h2>연락처 정보</h2>
            <p>아래 정보로도 문의하실 수 있습니다</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <strong>이메일</strong>
                  <p>contact@sprevn.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <strong>전화번호</strong>
                  <p>02-0000-0000</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div>
                  <strong>운영 시간</strong>
                  <p>평일 09:00 - 18:00</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <strong>주소</strong>
                  <p>서울특별시 강남구 테헤란로</p>
                </div>
              </div>
            </div>

            <div className="response-time">
              <div className="rt-icon">⚡</div>
              <div>
                <strong>평균 응답 시간</strong>
                <p>영업일 기준 24시간 이내</p>
              </div>
            </div>
          </div>

          {/* 문의 폼 */}
          <div className="inquiry-form-wrap card">
            <div className="card-body">
              <h2>문의 작성</h2>
              <p>아래 양식을 작성하여 문의해 주세요</p>

              {errors.form && <div className="alert alert-error">{errors.form}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">이름 <span style={{color:'var(--accent)'}}>*</span></label>
                    <input type="text" name="name" className={`form-control ${errors.name ? 'error' : ''}`}
                      placeholder="이름" value={form.name} onChange={handleChange} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">이메일 <span style={{color:'var(--accent)'}}>*</span></label>
                    <input type="email" name="email" className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="example@email.com" value={form.email} onChange={handleChange} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">전화번호</label>
                    <input type="text" name="phone" className="form-control"
                      placeholder="010-0000-0000" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">문의 유형</label>
                    <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                      <option value="">선택해주세요</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">제목 <span style={{color:'var(--accent)'}}>*</span></label>
                  <input type="text" name="title" className={`form-control ${errors.title ? 'error' : ''}`}
                    placeholder="문의 제목" value={form.title} onChange={handleChange} />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">문의 내용 <span style={{color:'var(--accent)'}}>*</span></label>
                  <textarea name="content" className={`form-control ${errors.content ? 'error' : ''}`}
                    rows={6} placeholder="문의 내용을 자세히 입력해주세요 (10자 이상)"
                    value={form.content} onChange={handleChange} style={{resize:'vertical'}} />
                  {errors.content && <span className="form-error">{errors.content}</span>}
                  <div style={{textAlign:'right', fontSize:'0.8rem', color:'var(--text-light)', marginTop:'4px'}}>
                    {form.content.length}자
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{width:'100%', padding:'14px'}} disabled={loading}>
                  {loading ? '접수 중...' : '문의 접수하기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InquiryPage;
