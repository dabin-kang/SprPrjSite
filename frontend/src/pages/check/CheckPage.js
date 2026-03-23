import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './CheckPage.css';

/* 개별 체크 항목 컴포넌트 */
function CheckItem({ label, status, detail, hint }) {
  const icon =
    status === 'loading' ? '⏳' :
    status === 'ok'      ? '✅' :
    status === 'warn'    ? '⚠️' : '❌';

  const cls =
    status === 'loading' ? 'loading' :
    status === 'ok'      ? 'ok' :
    status === 'warn'    ? 'warn' : 'fail';

  return (
    <div className={`check-item ${cls}`}>
      <div className="check-header">
        <span className="check-icon">{icon}</span>
        <span className="check-label">{label}</span>
        <span className={`check-badge ${cls}`}>
          {status === 'loading' ? '확인중...' :
           status === 'ok'      ? '정상' :
           status === 'warn'    ? '경고' : '오류'}
        </span>
      </div>
      {detail && <div className="check-detail">{detail}</div>}
      {status !== 'ok' && status !== 'loading' && hint && (
        <div className="check-hint">💡 해결방법: {hint}</div>
      )}
    </div>
  );
}

/* 데이터 입력 테스트 컴포넌트 */
function DataTest({ onLog }) {
  const [testId]   = useState('testuser_' + Date.now().toString().slice(-4));
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (msg, ok) => {
    setResults(prev => [...prev, { msg, ok, time: new Date().toLocaleTimeString() }]);
    onLog && onLog(msg, ok);
  };

  const runTest = async () => {
    setRunning(true);
    setResults([]);

    /* --- 테스트 1: 회원가입 --- */
    addResult('🔄 회원가입 테스트 시작...', null);
    try {
      await api.post('/auth/signup', {
        id: testId,
        pname: '테스트유저',
        email: `${testId}@test.com`,
        gender: 'M',
        phoneNumber: '010-0000-0000',
        birthday: '1990-01-01',
        address: '서울시 테스트구',
        password: 'test1234',
      });
      addResult(`✅ 회원가입 성공 (id: ${testId})`, true);
    } catch (e) {
      addResult(`❌ 회원가입 실패: ${e}`, false);
      setRunning(false);
      return;
    }

    /* --- 테스트 2: 아이디 중복확인 --- */
    try {
      const res = await api.get(`/auth/check-id?id=${testId}`);
      if (res.data?.exists) {
        addResult('✅ 아이디 중복확인 정상 (DB에 저장 확인)', true);
      } else {
        addResult('❌ 중복확인 응답 이상 (DB 저장 실패 가능성)', false);
      }
    } catch (e) {
      addResult(`❌ 아이디 중복확인 실패: ${e}`, false);
    }

    /* --- 테스트 3: 로그인 --- */
    let token = null;
    try {
      const res = await api.post('/auth/login', { id: testId, password: 'test1234' });
      token = res.data?.accessToken;
      addResult(`✅ 로그인 성공 (JWT 토큰 발급 확인)`, true);
      addResult(`   토큰: ${token ? token.substring(0, 30) + '...' : '없음'}`, !!token);
    } catch (e) {
      addResult(`❌ 로그인 실패: ${e}`, false);
    }

    /* --- 테스트 4: 문의하기 DB 입력 --- */
    try {
      await api.post('/inquiries', {
        name: '테스트유저',
        email: `${testId}@test.com`,
        title: '자동 테스트 문의',
        content: '배포 연결 확인용 자동 테스트입니다.',
        category: '일반 문의',
      });
      addResult('✅ 문의 데이터 DB 저장 성공', true);
    } catch (e) {
      addResult(`❌ 문의 저장 실패: ${e}`, false);
    }

    /* --- 테스트 5: 이벤트 조회 --- */
    try {
      await api.get('/events');
      addResult('✅ 이벤트 API 조회 성공 (GET /events)', true);
    } catch (e) {
      addResult(`❌ 이벤트 조회 실패: ${e}`, false);
    }

    addResult('🏁 전체 테스트 완료!', null);
    setRunning(false);
  };

  return (
    <div className="data-test card">
      <div className="card-body">
        <div className="test-header">
          <h3>🧪 데이터 입력 테스트</h3>
          <p>실제로 DB에 데이터가 들어가는지 자동으로 테스트합니다</p>
        </div>
        <div className="test-info">
          <span>테스트 아이디: <code>{testId}</code></span>
        </div>
        <button
          className="btn btn-primary"
          onClick={runTest}
          disabled={running}
          style={{ marginBottom: '16px' }}
        >
          {running ? '⏳ 테스트 실행중...' : '▶ 전체 테스트 실행'}
        </button>

        {results.length > 0 && (
          <div className="test-log">
            {results.map((r, i) => (
              <div key={i} className={`log-line ${r.ok === true ? 'log-ok' : r.ok === false ? 'log-fail' : 'log-info'}`}>
                <span className="log-time">{r.time}</span>
                <span className="log-msg">{r.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 메인 체크 페이지 */
function CheckPage() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const [checks, setChecks] = useState({
    frontend: { status: 'loading', detail: '', hint: '' },
    apiUrl:   { status: 'loading', detail: '', hint: '' },
    backend:  { status: 'loading', detail: '', hint: '' },
    database: { status: 'loading', detail: '', hint: '' },
    login:    { status: 'loading', detail: '', hint: '' },
  });

  const setCheck = (key, val) =>
    setChecks(prev => ({ ...prev, [key]: { ...prev[key], ...val } }));

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    /* 초기화 */
    Object.keys(checks).forEach(k => setCheck(k, { status: 'loading', detail: '', hint: '' }));

    /* 체크 1: 프론트엔드 자체 */
    setCheck('frontend', { status: 'ok', detail: `React 앱 정상 실행 중 | 환경: ${process.env.NODE_ENV}` });

    /* 체크 2: API URL 설정 */
    const isLocalhost = API_URL.includes('localhost');
    setCheck('apiUrl', {
      status: isLocalhost ? 'warn' : 'ok',
      detail: `REACT_APP_API_URL = ${API_URL}`,
      hint: isLocalhost ? 'Vercel 환경변수에 실제 백엔드 주소를 설정했는지 확인하세요' : '',
    });

    /* 체크 3: 백엔드 헬스체크 */
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        const h = data.data || {};
        setCheck('backend', {
          status: 'ok',
          detail: `서버 응답 정상 | 시각: ${h.timestamp || '-'}`,
        });
        /* 체크 4: DB */
        setCheck('database', {
          status: h.database?.startsWith('✅') ? 'ok' : 'fail',
          detail: `DB 상태: ${h.database} | 회원 수: ${h.totalUsers}명 | ${h.dbUrl || ''}`,
          hint: 'Railway Variables에서 SPRING_DATASOURCE_URL / USERNAME / PASSWORD 를 확인하세요',
        });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      setCheck('backend', {
        status: 'fail',
        detail: `연결 실패: ${e.message}`,
        hint: '① Railway에서 Spring Boot가 실행 중인지 확인 ② CORS 설정에 프론트엔드 주소가 포함됐는지 확인',
      });
      setCheck('database', {
        status: 'fail',
        detail: '백엔드 연결 실패로 DB 확인 불가',
        hint: '백엔드 먼저 정상화 후 다시 확인하세요',
      });
    }

    /* 체크 5: 로그인 API */
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'aaaa', password: '1234567' }),
      });
      const data = await res.json();
      if (data.success && data.data?.accessToken) {
        setCheck('login', {
          status: 'ok',
          detail: `관리자 로그인 성공 | JWT 토큰 발급 확인`,
        });
      } else {
        setCheck('login', {
          status: 'warn',
          detail: `로그인 응답: ${data.message || '알 수 없음'}`,
          hint: 'admin 계정이 DB에 없을 수 있습니다. schema.sql의 INSERT 문을 다시 실행하세요',
        });
      }
    } catch (e) {
      setCheck('login', {
        status: 'fail',
        detail: `로그인 API 실패: ${e.message}`,
        hint: '백엔드 서버가 실행 중인지 먼저 확인하세요',
      });
    }
  };

  const allOk = Object.values(checks).every(c => c.status === 'ok' || c.status === 'warn');
  const okCount = Object.values(checks).filter(c => c.status === 'ok').length;
  const total = Object.keys(checks).length;

  return (
    <div className="check-page">
      <div className="page-header">
        <div className="container">
          <h1>🔍 배포 연결 확인</h1>
          <p>프론트엔드 ↔ 백엔드 ↔ DB 연결 상태를 한눈에 확인합니다</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>

          {/* 요약 카드 */}
          <div className={`summary-card ${allOk ? 'summary-ok' : 'summary-fail'}`}>
            <div className="summary-icon">{allOk ? '✅' : '⚠️'}</div>
            <div>
              <div className="summary-title">
                {allOk ? '전체 연결 정상!' : '일부 항목을 확인하세요'}
              </div>
              <div className="summary-sub">
                {okCount} / {total} 항목 정상 &nbsp;|&nbsp; API: {API_URL}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={runChecks} style={{ marginLeft: 'auto' }}>
              🔄 다시 확인
            </button>
          </div>

          {/* 체크 항목 */}
          <div className="checks-list">
            <CheckItem label="① 프론트엔드 실행"   {...checks.frontend} />
            <CheckItem label="② API 주소 설정"     {...checks.apiUrl} />
            <CheckItem label="③ 백엔드 서버 응답"  {...checks.backend} />
            <CheckItem label="④ 데이터베이스 연결" {...checks.database} />
            <CheckItem label="⑤ 로그인 API 확인"   {...checks.login} />
          </div>

          {/* 데이터 입력 테스트 */}
          <DataTest />

          {/* 빠른 링크 */}
          <div className="quick-links card" style={{ marginTop: 24 }}>
            <div className="card-body">
              <h3>🔗 빠른 링크</h3>
              <div className="link-grid">
                <a href={`${API_URL}/health`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  백엔드 헬스체크 API
                </a>
                <a href="https://railway.app" target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
                  Railway 대시보드
                </a>
                <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
                  Vercel 대시보드
                </a>
                <Link to="/admin" className="btn btn-primary btn-sm">관리자 페이지</Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default CheckPage;
