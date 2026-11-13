import React, { useState } from 'react';
import { eventApi } from '../../api';
import { Field, FormError, getErrorMessage, ListState, Pagination, useAdminList } from './CmsShared';

const EMPTY_EVENT = {
  title: '',
  content: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  status: '1',
};

const dateValue = (value) => value ? String(value).split('T')[0] : '';

function EventsTab() {
  const list = useAdminList(eventApi.getAdminEvents, 'events');
  const [form, setForm] = useState(EMPTY_EVENT);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_EVENT });
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setEditingId(event.eventId);
    setForm({
      title: event.title || '',
      content: event.content || '',
      imageUrl: event.imageUrl || '',
      startDate: dateValue(event.startDate),
      endDate: dateValue(event.endDate),
      status: String(event.status ?? 1),
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const payload = {
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim() || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      status: Number(form.status),
    };
    try {
      if (editingId === null) await eventApi.createEvent(payload);
      else await eventApi.updateEvent(editingId, {
        ...payload,
        clearImageUrl: !form.imageUrl.trim(),
        clearStartDate: !form.startDate,
        clearEndDate: !form.endDate,
      });
      setFormOpen(false);
      setEditingId(null);
      await list.reload();
    } catch (error) {
      setFormError(getErrorMessage(error, '이벤트를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('이 이벤트를 삭제할까요?')) return;
    try {
      await eventApi.deleteEvent(eventId);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '이벤트를 삭제하지 못했습니다.'));
    }
  };

  return (
    <section>
      <div className="admin-panel-header">
        <div>
          <h2>이벤트 관리</h2>
          <p>총 {list.total}개</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          이벤트 등록
        </button>
      </div>

      {formOpen && (
        <form className="card admin-editor" onSubmit={handleSave}>
          <div className="card-body">
            <h3>{editingId === null ? '새 이벤트 등록' : '이벤트 수정'}</h3>
            <Field label="제목">
              <input
                className="form-control"
                maxLength={200}
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="내용">
              <textarea
                className="form-control"
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </Field>
            <Field label="이미지 URL">
              <input
                className="form-control"
                type="url"
                maxLength={500}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </Field>
            <div className="admin-form-grid">
              <Field label="시작일">
                <input
                  className="form-control"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="종료일">
                <input
                  className="form-control"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
              <Field label="공개 상태">
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="1">공개</option>
                  <option value="0">비공개</option>
                </select>
              </Field>
            </div>
            <FormError>{formError}</FormError>
            <div className="admin-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)} disabled={saving}>
                취소
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      )}

      <ListState loading={list.loading} error={list.error} empty={list.rows.length === 0 && '등록된 이벤트가 없습니다.'}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>제목</th><th>기간</th><th>상태</th><th>관리</th></tr>
            </thead>
            <tbody>
              {list.rows.map((event) => (
                <tr key={event.eventId}>
                  <td>{event.eventId}</td>
                  <td>{event.title}</td>
                  <td>{dateValue(event.startDate) || '-'} ~ {dateValue(event.endDate) || '-'}</td>
                  <td>{event.status === 1 ? '공개' : '비공개'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => openEdit(event)}>수정</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(event.eventId)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListState>
      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} />
    </section>
  );
}

export default EventsTab;
