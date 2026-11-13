import React, { useState } from 'react';
import { inquiryApi } from '../../api';
import { Field, FormError, getErrorMessage, ListState, Pagination, useAdminList } from './CmsShared';

function InquiriesTab() {
  const list = useAdminList(inquiryApi.getInquiries, 'inquiries');
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const openInquiry = (inquiry) => {
    setSelected(inquiry);
    setAnswer(inquiry.answer || '');
    setActionError('');
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setActionError('');
    try {
      await inquiryApi.answerInquiry(selected.inquiryId, answer.trim());
      setSelected(null);
      await list.reload();
    } catch (error) {
      setActionError(getErrorMessage(error, '문의 답변을 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (inquiry) => {
    if (!window.confirm(`문의 #${inquiry.inquiryId}을(를) 삭제할까요?`)) return;
    try {
      await inquiryApi.deleteInquiry(inquiry.inquiryId);
      if (selected?.inquiryId === inquiry.inquiryId) setSelected(null);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '문의를 삭제하지 못했습니다.'));
    }
  };

  return (
    <section>
      <div className="admin-panel-header">
        <div>
          <h2>문의 관리</h2>
          <p>총 {list.total}건</p>
        </div>
      </div>

      <ListState loading={list.loading} error={list.error} empty={list.rows.length === 0 && '접수된 문의가 없습니다.'}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>문의자</th><th>제목</th><th>상태</th><th>접수일</th><th>관리</th></tr>
            </thead>
            <tbody>
              {list.rows.map((inquiry) => (
                <tr key={inquiry.inquiryId}>
                  <td>{inquiry.inquiryId}</td>
                  <td>{inquiry.name}<br /><small>{inquiry.email}</small></td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.status === 1 ? '답변 완료' : '미답변'}</td>
                  <td>{inquiry.createdAt ? String(inquiry.createdAt).split('T')[0] : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => openInquiry(inquiry)}>
                        {inquiry.status === 1 ? '답변 보기/수정' : '상세/답변'}
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteInquiry(inquiry)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListState>
      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} />

      {selected && (
        <div className="modal-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !saving) setSelected(null);
        }}>
          <section className="modal-content admin-inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="닫기">×</button>
            <h2 id="inquiry-title">{selected.title}</h2>
            <div className="inquiry-detail">
              <span>문의자: {selected.name}</span>
              <span>이메일: {selected.email}</span>
              <span>전화번호: {selected.phone || '-'}</span>
              <span>분류: {selected.category || '-'}</span>
              <div className="inquiry-content-box">{selected.content}</div>
            </div>
            <form onSubmit={submitAnswer}>
              <Field label="답변">
                <textarea
                  className="form-control"
                  rows={6}
                  maxLength={10000}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Field>
              <FormError>{actionError}</FormError>
              <div className="admin-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)} disabled={saving}>닫기</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '저장 중...' : '답변 저장'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default InquiriesTab;
