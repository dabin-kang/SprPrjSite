
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabaseClient';

export const getPublicStorageUrl = (path) => {
  if (!path) return null;
  const { data } = supabase
    .storage
    .from('spr_sg')
    .getPublicUrl(path);
  return data?.publicUrl || null;
};

/**
 * Supabase Storage 파일 경로를 공개 이미지 URL로 변환
 *
 * 사용 예:
 * useSignedUrls(['projects/sample/image.jpg'])
 */
export const useSignedUrls = (paths = []) => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchPublicUrls = () => {
      if (!paths || paths.length === 0) {
        setUrls([]);
        return;
      }

      const result = paths
        .filter(Boolean)
        .map((path) => {
          return {
            path,
            signedUrl: getPublicStorageUrl(path),
          };
        });

      if (!cancelled) {
        setUrls(result);
      }
    };

    fetchPublicUrls();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(paths)]);

  return urls;
};
