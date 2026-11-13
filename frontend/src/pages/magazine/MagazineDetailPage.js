import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { magazineApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { sanitizeMagazineContent } from '../../utils/sanitizeMagazineContent';
import './MagazineDetailPage.css';

function getErrorMessage(error, fallback) {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || fallback;
}

function MagazineDetailPage() {
  const { magazineId } = useParams();
  const { isAdmin } = useAuth();
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setMagazine(null);

    const request = isAdmin
      ? magazineApi.getAdminMagazine(magazineId)
      : magazineApi.getMagazine(magazineId);

    request
      .then((response) => {
        if (!response?.data?.magazineId) {
          throw new Error('매거진 상세 응답이 올바르지 않습니다.');
        }
        if (active) setMagazine(response.data);
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError, '매거진을 불러오지 못했습니다.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [magazineId, isAdmin]);

  return (
    <main className="magazine-detail-page">
      <div className="magazine-detail-container">
        <div className="magazine-detail-navigation">
          <Link className="magazine-back-link" to="/magazine">
            <span aria-hidden="true">←</span> 매거진 목록
          </Link>
          {isAdmin && (
            <Link className="magazine-back-link" to="/admin">
              관리자 페이지 <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="magazine-detail-state" role="status">
            매거진을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="magazine-detail-state magazine-detail-error" role="alert">
            <h1>매거진을 표시할 수 없습니다.</h1>
            <p>{error}</p>
            <Link to="/magazine" className="btn btn-primary">목록으로 돌아가기</Link>
          </div>
        ) : magazine ? (
          <article className="magazine-article">
            {magazine.thumbnail ? (
              <div className="magazine-article-cover">
                <img src={magazine.thumbnail} alt="" />
              </div>
            ) : (
              <div className="magazine-article-cover magazine-article-cover-empty">
                <span>{magazine.category || 'MAGAZINE'}</span>
              </div>
            )}

            <div className="magazine-article-content">
              <div className="magazine-article-meta">
                <span className="magazine-article-category">
                  {magazine.category || '미분류'}
                </span>
                {isAdmin && (
                  <span className={`magazine-status ${magazine.status === 1 ? 'published' : 'draft'}`}>
                    {magazine.status === 1 ? '공개' : '비공개'}
                  </span>
                )}
              </div>

              <h1>{magazine.title}</h1>

              <div className="magazine-article-byline">
                <time dateTime={magazine.createdAt}>
                  {magazine.createdAt?.split('T')[0] || '작성일 미정'}
                </time>
                <span>조회 {magazine.viewCount?.toLocaleString() || 0}</span>
              </div>

              <div className="magazine-article-body">
                {magazine.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeMagazineContent(magazine.content),
                    }}
                  />
                ) : (
                  '등록된 내용이 없습니다.'
                )}
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

export default MagazineDetailPage;
