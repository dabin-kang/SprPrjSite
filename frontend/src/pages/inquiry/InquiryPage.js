import React, { useState } from 'react';
import { inquiryApi } from '../../api';
import './InquiryPage.css';

const CATEGORIES = [
  '일반 문의',
  '서비스 문의',
  '파트너십',
  '기술 지원',
  '기타',
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  category: '',
  title: '',
  content: '',
};

function InquiryPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      form: '',
    }));

    setSuccess('');
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = '올바른 이메일을 입력해주세요.';
    }

    if (!form.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!form.content.trim() || form.content.trim().length < 10) {
      newErrors.content = '문의 내용을 10자 이상 입력해주세요.';
    }

    return newErrors;
  };

  // 문의 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await inquiryApi.createInquiry(form);

      setSuccess(
        '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.'
      );

      setForm(INITIAL_FORM);
    } catch (err) {
      setErrors({
        form:
          typeof err === 'string'
            ? err
            : '문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="inquiry-page">

      {/* PAGE HEADER */}
      <header className="inquiry-header">
        <div className="container">
          <p className="inquiry-label">CONTACT</p>

          <h1>문의하기</h1>

          <p className="inquiry-description">
            궁금한 점이나 함께하고 싶은 이야기가 있다면
            <br />
            편하게 문의해주세요.
          </p>
        </div>
      </header>


      {/* CONTENT */}
      <section className="inquiry-section">
        <div className="container inquiry-container">

          {/* LEFT : CONTACT INFORMATION */}
          <div className="inquiry-info">

            <div className="inquiry-info-header">
              <p className="section-label">CONTACT INFO</p>

              <h2>연락처 정보</h2>

              <p>
                아래 연락처를 통해서도
                <br />
                문의하실 수 있습니다.
              </p>
            </div>


            <div className="contact-list">

              <div className="contact-item">
                <div className="contact-icon">✉</div>

                <div className="contact-content">
                  <span>EMAIL</span>
                  <strong>ekqlskwkd287@naver.com</strong>
                </div>
              </div>


              <div className="contact-item">
                <div className="contact-icon">☎</div>

                <div className="contact-content">
                  <span>PHONE</span>
                  <strong>010-3756-3792</strong>
                </div>
              </div>


              <div className="contact-item">
                <div className="contact-icon">◷</div>

                <div className="contact-content">
                  <span>OFFICE HOURS</span>
                  <strong>평일 09:00 - 18:00</strong>
                </div>
              </div>


              <div className="contact-item">
                <div className="contact-icon">⌖</div>

                <div className="contact-content">
                  <span>ADDRESS</span>
                  <strong>경상남도 창원시 의창구</strong>
                </div>
              </div>

            </div>


            {/* RESPONSE TIME */}
            <div className="response-time">
              <div className="response-icon">→</div>

              <div>
                <span>AVERAGE RESPONSE TIME</span>

                <strong>영업일 기준 48시간 이내</strong>
              </div>
            </div>

          </div>


          {/* RIGHT : INQUIRY FORM */}
          <div className="inquiry-form-wrap">

            <div className="inquiry-form-header">
              <p className="section-label">SEND MESSAGE</p>

              <h2>문의 작성</h2>

              <p>
                아래 양식을 작성해주시면
                <br />
                확인 후 답변드리겠습니다.
              </p>
            </div>


            {/* ERROR */}
            {errors.form && (
              <div className="inquiry-alert inquiry-alert-error">
                {errors.form}
              </div>
            )}


            {/* SUCCESS */}
            {success && (
              <div className="inquiry-alert inquiry-alert-success">
                {success}
              </div>
            )}


            <form
              className="inquiry-form"
              onSubmit={handleSubmit}
            >

              {/* NAME / EMAIL */}
              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    이름
                    <span className="required">*</span>
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="이름을 입력해주세요"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? 'input-error' : ''}
                  />

                  {errors.name && (
                    <span className="form-error">
                      {errors.name}
                    </span>
                  )}
                </div>


                <div className="form-group">
                  <label htmlFor="email">
                    이메일
                    <span className="required">*</span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="jjanggu@naver.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />

                  {errors.email && (
                    <span className="form-error">
                      {errors.email}
                    </span>
                  )}
                </div>

              </div>


              {/* PHONE / CATEGORY */}
              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="phone">
                    전화번호
                  </label>

                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="category">
                    문의 유형
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      선택해주세요
                    </option>

                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

              </div>


              {/* TITLE */}
              <div className="form-group">
                <label htmlFor="title">
                  제목
                  <span className="required">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="문의 제목을 입력해주세요"
                  value={form.title}
                  onChange={handleChange}
                  className={errors.title ? 'input-error' : ''}
                />

                {errors.title && (
                  <span className="form-error">
                    {errors.title}
                  </span>
                )}
              </div>


              {/* CONTENT */}
              <div className="form-group">
                <label htmlFor="content">
                  문의 내용
                  <span className="required">*</span>
                </label>

                <textarea
                  id="content"
                  name="content"
                  rows={7}
                  placeholder="문의 내용을 자세히 입력해주세요. (10자 이상)"
                  value={form.content}
                  onChange={handleChange}
                  className={errors.content ? 'input-error' : ''}
                />

                <div className="form-bottom">
                  {errors.content ? (
                    <span className="form-error">
                      {errors.content}
                    </span>
                  ) : (
                    <span />
                  )}

                  <span className="character-count">
                    {form.content.length}자
                  </span>
                </div>
              </div>


              {/* SUBMIT */}
              <button
                type="submit"
                className="inquiry-submit"
                disabled={loading}
              >
                {loading ? '접수 중...' : '문의 접수하기'}

                {!loading && (
                  <span className="submit-arrow">
                    →
                  </span>
                )}
              </button>

            </form>

          </div>

        </div>
      </section>

    </main>
  );
}

export default InquiryPage;