
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabaseClient';

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
          const { data } = supabase
            .storage
            .from('spr_sg')
            .getPublicUrl(path);

          return {
            path,
            signedUrl: data?.publicUrl || null,
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
