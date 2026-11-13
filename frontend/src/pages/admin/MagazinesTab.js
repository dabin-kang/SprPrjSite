import React, { useState } from 'react';
import { magazineApi } from '../../api';
import { Field, FormError, getErrorMessage, ListState, Pagination, useAdminList } from './CmsShared';

const EMPTY_MAGAZINE = {
  title: '',
  content: '',
  category: '',
  thumbnail: '',
  status: '0',
};

const CATEGORIES = ['트렌드', '기술', '비즈니스', '디자인'];

function MagazinesTab() {
  const list = useAdminList(magazineApi.getAdminMagazines, 'magazines');
  const [form, setForm] = useState(EMPTY_MAGAZINE);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_MAGAZINE });
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (magazine) => {
    setEditingId(magazine.magazineId);
    setForm({
      title: magazine.title || '',
      content: magazine.content || '',
      category: magazine.category || '',
      thumbnail: magazine.thumbnail || '',
      status: String(magazine.status ?? 0),
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
      category: form.category || null,
      thumbnail: form.thumbnail.trim() || null,
      status: Number(form.status),
    };
    try {
      if (editingId === null) await magazineApi.createMagazine(payload);
      else await magazineApi.updateMagazine(editingId, payload);
      setFormOpen(false);
      setEditingId(null);
      await list.reload();
    } catch (error) {
      setFormError(getErrorMessage(error, '매거진을 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (magazineId) => {
    if (!window.confirm('이 매거진을 삭제할까요?')) return;
    try {
      await magazineApi.deleteMagazine(magazineId);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '매거진을 삭제하지 못했습니다.'));
    }
  };

  return (
    <section>
      <div className="admin-panel-header">
        <div>
          <h2>매거진 관리</h2>
          <p>총 {list.total}개</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          매거진 등록
        </button>
      </div>

      {formOpen && (
        <form className="card admin-editor" onSubmit={handleSave}>
          <div className="card-body">
            <h3>{editingId === null ? '새 매거진 등록' : '매거진 수정'}</h3>
            <Field label="제목">
              <input
                className="form-control"
                maxLength={200}
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <div className="admin-form-grid">
              <Field label="카테고리">
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">선택 안 함</option>
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </Field>
              <Field label="공개 상태">
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="0">비공개</option>
                  <option value="1">공개</option>
                </select>
              </Field>
            </div>
            <Field label="썸네일 URL">
              <input
                className="form-control"
                type="url"
                maxLength={500}
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              />
            </Field>
            <Field label="내용">
              <textarea
                className="form-control"
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </Field>
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

      <ListState loading={list.loading} error={list.error} empty={list.rows.length === 0 && '등록된 매거진이 없습니다.'}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>제목</th><th>카테고리</th><th>조회수</th><th>상태</th><th>관리</th></tr>
            </thead>
            <tbody>
              {list.rows.map((magazine) => (
                <tr key={magazine.magazineId}>
                  <td>{magazine.magazineId}</td>
                  <td>{magazine.title}</td>
                  <td>{magazine.category || '-'}</td>
                  <td>{magazine.viewCount ?? 0}</td>
                  <td>{magazine.status === 1 ? '공개' : '비공개'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => openEdit(magazine)}>수정</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(magazine.magazineId)}>삭제</button>
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

export default MagazinesTab;
