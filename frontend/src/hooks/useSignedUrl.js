import { useEffect, useState } from "react";
import { supabase } from "../libs/supabaseClient";

export const useSignedUrls = (paths = []) => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!paths || paths.length === 0) return;

      const { data, error } = await supabase
        .storage
        .from('spr_sg')
        .createSignedUrls(paths, 60); // 60초 유효

      if (error) {
        console.error("Signed URL 생성 실패:", error.message);
        return;
      }

      setUrls(data);
    };

    fetchSignedUrls();
  }, [JSON.stringify(paths)]); // 배열 내용이 변할 때만 재실행

  return urls;
};