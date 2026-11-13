import { useCallback, useEffect, useState } from 'react';

export function getErrorMessage(error, fallback) {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || fallback;
}

export function useAdminList(fetchPage, dataKey, pageSize = 10) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchPage(page, pageSize);
      const data = response?.data;
      if (!Array.isArray(data?.[dataKey]) || !Number.isFinite(data?.total)) {
        throw new Error('서버 응답 형식이 올바르지 않습니다.');
      }
      setRows(data[dataKey]);
      setTotal(data.total);
      const lastPage = Math.max(1, Math.ceil(data.total / pageSize));
      if (page > lastPage) setPage(lastPage);
    } catch (requestError) {
      setRows([]);
      setTotal(0);
      setError(getErrorMessage(requestError, '목록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [dataKey, fetchPage, page, pageSize]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    rows,
    setRows,
    page,
    setPage,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    loading,
    error,
    setError,
    reload,
  };
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="admin-pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>
      <span>{page} / {totalPages}</span>
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </button>
    </div>
  );
}

export function ListState({ loading, error, empty, children }) {
  if (loading) return <div className="spinner" role="status">불러오는 중...</div>;
  if (error) return <div className="alert alert-error" role="alert">{error}</div>;
  if (empty) return <div className="admin-empty">{empty}</div>;
  return children;
}

export function Field({ label, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export function FormError({ children }) {
  return children ? <div className="alert alert-error" role="alert">{children}</div> : null;
}
