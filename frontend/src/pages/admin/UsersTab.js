import React, { useState } from 'react';
import { adminApi } from '../../api';
import { Field, FormError, getErrorMessage, ListState, Pagination, useAdminList } from './CmsShared';

const EMPTY_USER = {
  id: '',
  pname: '',
  email: '',
  gender: '',
  phoneNumber: '',
  birthday: '',
  address: '',
  password: '',
};

function UsersTab() {
  const list = useAdminList(adminApi.getUsers, 'users');
  const [form, setForm] = useState(EMPTY_USER);
  const [editingUser, setEditingUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingUser(null);
    setForm({ ...EMPTY_USER });
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      id: user.id || '',
      pname: user.pname || '',
      email: user.email || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
      birthday: user.birthday ? String(user.birthday).split('T')[0] : '',
      address: user.address || '',
      password: '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser.userId, {
          pname: form.pname.trim(),
          email: form.email.trim(),
          gender: form.gender,
          phoneNumber: form.phoneNumber,
          birthday: form.birthday,
          address: form.address,
          password: form.password,
        });
      } else {
        await adminApi.createUser({
          ...form,
          id: form.id.trim(),
          pname: form.pname.trim(),
          email: form.email.trim(),
          gender: form.gender || null,
          phoneNumber: form.phoneNumber || null,
          birthday: form.birthday || null,
          address: form.address || null,
        });
      }
      setFormOpen(false);
      setEditingUser(null);
      await list.reload();
    } catch (error) {
      setFormError(getErrorMessage(error, '회원 정보를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (user, status) => {
    try {
      await adminApi.updateUserStatus(user.userId, status);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '회원 상태를 변경하지 못했습니다.'));
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`${user.id} 회원을 삭제할까요?`)) return;
    try {
      await adminApi.deleteUser(user.userId);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '회원을 삭제하지 못했습니다.'));
    }
  };

  return (
    <section>
      <div className="admin-panel-header">
        <div>
          <h2>회원 관리</h2>
          <p>총 {list.total}명</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          회원 등록
        </button>
      </div>

      {formOpen && (
        <form className="card admin-editor" onSubmit={handleSave}>
          <div className="card-body">
            <h3>{editingUser ? '회원 정보 수정' : '회원 등록'}</h3>
            <div className="admin-form-grid">
              <Field label="아이디">
                <input
                  className="form-control"
                  required
                  minLength={4}
                  maxLength={50}
                  disabled={Boolean(editingUser)}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </Field>
              <Field label="이름">
                <input
                  className="form-control"
                  required
                  maxLength={100}
                  value={form.pname}
                  onChange={(e) => setForm({ ...form, pname: e.target.value })}
                />
              </Field>
              <Field label="이메일">
                <input
                  className="form-control"
                  type="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label={editingUser ? '비밀번호 변경 (선택)' : '비밀번호'}>
                <input
                  className="form-control"
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  maxLength={100}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Field>
              <Field label="성별">
                <select
                  className="form-control"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">선택 안 함</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </Field>
              <Field label="전화번호">
                <input
                  className="form-control"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
              </Field>
              <Field label="생년월일">
                <input
                  className="form-control"
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />
              </Field>
              <Field label="주소">
                <input
                  className="form-control"
                  maxLength={500}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
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

      <ListState loading={list.loading} error={list.error} empty={list.rows.length === 0 && '등록된 회원이 없습니다.'}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>아이디</th><th>이름</th><th>이메일</th><th>상태</th><th>가입일</th><th>관리</th></tr>
            </thead>
            <tbody>
              {list.rows.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.id}</td>
                  <td>{user.pname}</td>
                  <td>{user.email}</td>
                  <td>{user.status === 1 ? '활성' : user.status === 2 ? '정지' : '비활성'}</td>
                  <td>{user.createdAt ? String(user.createdAt).split('T')[0] : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => openEdit(user)}>수정</button>
                      {user.id !== 'admin' && user.status !== 1 && (
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => changeStatus(user, 1)}>활성화</button>
                      )}
                      {user.id !== 'admin' && user.status === 1 && (
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => changeStatus(user, 2)}>정지</button>
                      )}
                      {user.id !== 'admin' && (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteUser(user)}>삭제</button>
                      )}
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

export default UsersTab;
