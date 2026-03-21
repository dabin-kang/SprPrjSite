import React, { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../../api';
import './EventPage.css';

const DUMMY_EVENTS = [
  { eventId: 1, title: '용지호수 산책', content: '봄을 맞아 특별한 혜택을 드립니다.', startDate: '2024-03-01', endDate: '2024-04-30', status: 1 },
  { eventId: 2, title: '회원가입 축하 이벤트', content: '신규 회원가입 시 특별 포인트를 드립니다.', startDate: '2024-01-01', endDate: '2024-12-31', status: 1 },
  { eventId: 3, title: '프리미엄 멤버십 론칭', content: '프리미엄 멤버십 출시를 기념하는 특별 이벤트입니다.', startDate: '2024-02-01', endDate: '2024-03-31', status: 1 },
];

function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const size = 9;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventApi.getEvents(page, size);
      setEvents(res.data?.events || DUMMY_EVENTS);
      setTotal(res.data?.total || DUMMY_EVENTS.length);
    } catch {
      setEvents(DUMMY_EVENTS);
      setTotal(DUMMY_EVENTS.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <span className="badge badge-success">진행중</span>;
      case 0: return <span className="badge badge-danger">종료</span>;
      default: return <span className="badge badge-warning">예정</span>;
    }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="event-page">
      <div className="page-header">
        <div className="container">
          <h1>이벤트</h1>
          <p>창원 용지호수 산책</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.eventId} className="event-card card" onClick={() => setSelected(event)}>
                    <div className="event-img" style={{ background: `hsl(${event.eventId * 40 + 200}, 55%, 65%)` }}>
                      <div className="event-date">
                        {event.startDate && event.startDate.split('T')[0]}
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ marginBottom: '8px' }}>{getStatusBadge(event.status)}</div>
                      <h3 className="card-title">{event.title}</h3>
                      <p className="card-text">{event.content?.substring(0, 80)}...</p>
                      <div className="event-period">
                        <span>📅 {event.startDate} ~ {event.endDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 이벤트 상세 모달 */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-img" style={{ background: `hsl(${selected.eventId * 40 + 200}, 55%, 65%)` }}>
              <span>EVENT</span>
            </div>
            <div className="modal-body">
              {getStatusBadge(selected.status)}
              <h2>{selected.title}</h2>
              <p className="modal-date">📅 {selected.startDate} ~ {selected.endDate}</p>
              <p className="modal-desc">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPage;
