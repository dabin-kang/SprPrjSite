```jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ChangwonBiennaleMapPage.css';

/*
 * ============================================================
 * 창원조각비엔날레 전시 공간 데이터
 * ============================================================
 *
 * 현재는 "전시 공간"을 먼저 표시합니다.
 *
 * 실제 작품 위치가 확정되면 ARTWORKS 배열에
 * 작품 데이터를 추가하면 됩니다.
 */

const VENUES = [
  {
    id: 'sungsan',
    number: '01',
    name: '성산아트홀',
    area: '창원',
    address: '경남 창원시 성산구 중앙대로 181',
    description:
      '창원 도심의 주요 문화공간으로 비엔날레의 주요 전시 거점 중 하나입니다.',
  },
  {
    id: 'changwon-house',
    number: '02',
    name: '창원의집',
    area: '창원',
    address: '경남 창원시 의창구 사림로16번길 59',
    description:
      '전통적인 공간의 시간성과 동시대 조각이 만나는 전시 공간입니다.',
  },
  {
    id: 'history-museum',
    number: '03',
    name: '창원역사민속관',
    area: '창원',
    address: '경남 창원시 의창구 창이대로397번길 25',
    description:
      '창원의 역사와 생활문화를 보여주는 공간으로 작품과 도시의 기억을 연결합니다.',
  },
  {
    id: 'jinhae-station',
    number: '04',
    name: '진해역 일대',
    area: '진해',
    address: '경남 창원시 진해구 여좌동',
    description:
      '철도와 도시의 기억을 따라 작품을 발견할 수 있는 진해 전시 구간입니다.',
  },
  {
    id: 'masan-market',
    number: '05',
    name: '마산어시장',
    area: '마산',
    address: '경남 창원시 마산합포구 복요리로 7',
    description:
      '시장의 일상과 도시의 생활 풍경 속에서 작품을 만나는 마산의 전시 거점입니다.',
  },
];

/*
 * ============================================================
 * 작품 데이터
 * ============================================================
 *
 * 실제 작품 위치가 확인되면 아래에 추가합니다.
 *
 * 예시:
 *
 * {
 *   id: 'work-01',
 *   number: '01',
 *   title: '작품명',
 *   artist: '작가명',
 *   address: '정확한 작품 설치 주소',
 *   venueId: 'sungsan',
 *   description: '작품 설명',
 * }
 */

const ARTWORKS = [];


function ChangwonBiennaleMapPage() {

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selected, setSelected] = useState(null);
  const [activeType, setActiveType] = useState('venue');
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);


  /*
   * ============================================================
   * 카카오맵 SDK 불러오기
   * ============================================================
   */

  useEffect(() => {

    const appKey = process.env.REACT_APP_KAKAO_MAP_KEY;

    if (!appKey) {
      setMapError(true);
      return;
    }

    if (window.kakao && window.kakao.maps) {

      window.kakao.maps.load(() => {
        setMapReady(true);
      });

      return;
    }

    const existingScript =
      document.querySelector('script[data-kakao-map]');

    if (existingScript) {

      existingScript.addEventListener(
        'load',
        () => {

          if (window.kakao && window.kakao.maps) {

            window.kakao.maps.load(() => {
              setMapReady(true);
            });

          }

        }
      );

      return;
    }

    const script = document.createElement('script');

    script.dataset.kakaoMap = 'true';

    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;

    script.async = true;

    script.onload = () => {

      if (window.kakao && window.kakao.maps) {

        window.kakao.maps.load(() => {
          setMapReady(true);
        });

      }

    };

    script.onerror = () => {
      setMapError(true);
    };

    document.head.appendChild(script);

  }, []);


  /*
   * ============================================================
   * 지도 생성
   * ============================================================
   */

  useEffect(() => {

    if (
      !mapReady ||
      !mapRef.current ||
      !window.kakao ||
      !window.kakao.maps
    ) {
      return;
    }

    const kakao = window.kakao;

    const map = new kakao.maps.Map(
      mapRef.current,
      {
        center: new kakao.maps.LatLng(
          35.228,
          128.681
        ),
        level: 9,
      }
    );

    mapInstanceRef.current = map;

    return () => {

      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      markersRef.current = [];

      mapInstanceRef.current = null;

    };

  }, [mapReady]);


  /*
   * ============================================================
   * 마커 생성
   * ============================================================
   */

  useEffect(() => {

    if (
      !mapReady ||
      !mapInstanceRef.current ||
      !window.kakao ||
      !window.kakao.maps
    ) {
      return;
    }

    const kakao = window.kakao;

    const map = mapInstanceRef.current;

    /*
     * 기존 마커 제거
     */

    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    const items =
      activeType === 'venue'
        ? VENUES
        : ARTWORKS;

    /*
     * 작품 데이터가 아직 없는 경우
     */

    if (items.length === 0) {
      setSelected(null);
      return;
    }

    const geocoder =
      new kakao.maps.services.Geocoder();

    const bounds =
      new kakao.maps.LatLngBounds();

    items.forEach((item) => {

      geocoder.addressSearch(
        item.address,
        (result, status) => {

          if (
            status !==
            kakao.maps.services.Status.OK
          ) {
            return;
          }

          const position =
            new kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

          const marker =
            new kakao.maps.Marker({
              map,
              position,
              title:
                item.title || item.name,
            });

          markersRef.current.push(marker);

          bounds.extend(position);

          /*
           * 마커 클릭
           */

          kakao.maps.event.addListener(
            marker,
            'click',
            () => {
              setSelected(item);
            }
          );

        }
      );

    });

    /*
     * 모든 장소가 들어오면 지도 범위 조정
     */

    setTimeout(() => {

      if (!bounds.isEmpty()) {
        map.setBounds(bounds);
      }

    }, 1000);

  }, [mapReady, activeType]);


  /*
   * ============================================================
   * 목록 클릭
   * ============================================================
   */

  const handleItemClick = (item) => {

    setSelected(item);

    /*
     * 지도에서 해당 위치로 이동
     */

    if (
      !mapInstanceRef.current ||
      !window.kakao ||
      !window.kakao.maps
    ) {
      return;
    }

    const kakao = window.kakao;

    const geocoder =
      new kakao.maps.services.Geocoder();

    geocoder.addressSearch(
      item.address,
      (result, status) => {

        if (
          status !==
          kakao.maps.services.Status.OK
        ) {
          return;
        }

        const position =
          new kakao.maps.LatLng(
            result[0].y,
            result[0].x
          );

        mapInstanceRef.current.setCenter(position);

        mapInstanceRef.current.setLevel(5);

      }
    );

  };


  const items =
    activeType === 'venue'
      ? VENUES
      : ARTWORKS;


  return (

    <main className="biennale-map-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="biennale-map-header">

        <div className="biennale-map-header-inner">

          <p className="page-label">
            CHANGWON SCULPTURE BIENNALE 2026
          </p>

          <h1>
            창원 조각 지도
          </h1>

          <p className="biennale-map-description">
            도시 곳곳에 놓인 작품과 전시 공간을
            <br />
            지도 위에서 발견합니다.
          </p>

        </div>

      </section>


      {/* ======================================================
          MAP CONTENT
      ====================================================== */}

      <section className="biennale-map-section">

        <div className="biennale-map-layout">


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="biennale-map-sidebar">

            <div className="map-sidebar-intro">

              <span className="map-eyebrow">
                RESONANCE FIELD
              </span>

              <h2>
                공명장
              </h2>

              <p>
                2026 창원조각비엔날레는
                도시 곳곳의 공간을 연결합니다.
              </p>

            </div>


            {/* 탭 */}

            <div className="map-tabs">

              <button
                type="button"
                className={
                  activeType === 'venue'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveType('venue')
                }
              >
                전시 공간
              </button>

              <button
                type="button"
                className={
                  activeType === 'artwork'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveType('artwork')
                }
              >
                작품
              </button>

            </div>


            {/* 장소 목록 */}

            <div className="map-list">

              {items.length === 0 ? (

                <div className="map-empty">

                  <span className="map-empty-number">
                    +
                  </span>

                  <h3>
                    작품 데이터를 준비 중입니다.
                  </h3>

                  <p>
                    작품명·작가·설치 위치가
                    확인되면 지도에 추가됩니다.
                  </p>

                </div>

              ) : (

                items.map((item) => (

                  <button
                    type="button"
                    key={item.id}
                    className={
                      `map-list-item ${
                        selected?.id === item.id
                          ? 'selected'
                          : ''
                      }`
                    }
                    onClick={() =>
                      handleItemClick(item)
                    }
                  >

                    <span className="map-list-number">
                      {item.number}
                    </span>

                    <span className="map-list-content">

                      <strong>
                        {item.title || item.name}
                      </strong>

                      {item.artist && (
                        <small>
                          {item.artist}
                        </small>
                      )}

                      <small>
                        {item.area}
                      </small>

                    </span>

                  </button>

                ))

              )}

            </div>


            {/* 뒤로가기 */}

            <Link
              to="/projects/changwon-biennale"
              className="map-back-link"
            >
              ← 비엔날레 프로젝트
            </Link>

          </aside>


          {/* ==================================================
              MAP
          ================================================== */}

          <div className="biennale-map-area">

            {mapError ? (

              <div className="map-error">

                <span className="map-error-label">
                  MAP
                </span>

                <h2>
                  지도를 연결해주세요.
                </h2>

                <p>
                  카카오맵 API 키가 아직 설정되지 않았습니다.
                </p>

                <div className="map-env-box">
                  <code>
                    REACT_APP_KAKAO_MAP_KEY
                  </code>
                </div>

                <p className="map-error-help">
                  API 키를 Vercel 환경변수와
                  로컬 .env 파일에 등록하면
                  실제 지도가 표시됩니다.
                </p>

              </div>

            ) : (

              <div
                ref={mapRef}
                className="kakao-map"
              />

            )}


            {/* =================================================
                선택된 장소 카드
            ================================================= */}

            {selected && (

              <div className="map-detail-card">

                <button
                  type="button"
                  className="map-detail-close"
                  onClick={() =>
                    setSelected(null)
                  }
                  aria-label="닫기"
                >
                  ×
                </button>

                <span className="map-detail-label">
                  {selected.artist
                    ? 'ARTWORK'
                    : 'EXHIBITION SITE'}
                </span>

                <h3>
                  {selected.title ||
                    selected.name}
                </h3>

                {selected.artist && (
                  <p className="map-detail-artist">
                    {selected.artist}
                  </p>
                )}

                <p className="map-detail-description">
                  {selected.description}
                </p>

                <p className="map-detail-address">
                  {selected.address}
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  );
}

export default ChangwonBiennaleMapPage;