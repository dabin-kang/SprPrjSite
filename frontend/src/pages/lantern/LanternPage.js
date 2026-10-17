import React, { useEffect, useRef, useState } from 'react';
import './LanternPage.css';
import {lanternApi} from '../../api';

const COLORS = [
  {
    id: 'gold',
    label: '금빛',
    body: '#e8bd55',
  },
  {
    id: 'red',
    label: '붉은빛',
    body: '#d96d6d',
  },
  {
    id: 'blue',
    label: '푸른빛',
    body: '#719fd4',
  },
  {
    id: 'green',
    label: '초록빛',
    body: '#78ae84',
  },
  {
    id: 'violet',
    label: '보랏빛',
    body: '#9d7bc1',
  },
];

const INITIAL_LANTERNS = [
  {
    id: 1,
    nickname: '봄',
    message: '좋아하는 일을 오래 할 수 있기를',
    color: 'gold',
    x: 12,
    y: 39,
    size: 0.82,
    duration: 6.5,
    delay: -1.4,
  },
  {
    id: 2,
    nickname: '여행자',
    message: '다음 여행도 무사히 다녀오길',
    color: 'blue',
    x: 27,
    y: 58,
    size: 0.68,
    duration: 7.4,
    delay: -3.2,
  },
  {
    id: 3,
    nickname: '하루',
    message: '오늘보다 조금 더 행복한 내일',
    color: 'red',
    x: 44,
    y: 32,
    size: 0.94,
    duration: 5.8,
    delay: -2.1,
  },
  {
    id: 4,
    nickname: '무지개',
    message: '우리 모두 건강하고 평안하기를',
    color: 'green',
    x: 63,
    y: 54,
    size: 0.76,
    duration: 6.9,
    delay: -4.4,
  },
  {
    id: 5,
    nickname: '달빛',
    message: '마음속 작은 꿈이 이루어지길',
    color: 'violet',
    x: 82,
    y: 34,
    size: 0.84,
    duration: 7.8,
    delay: -5.1,
  },
  {
    id: 6,
    nickname: '익명',
    message: '소중한 사람들과 오래 웃기를',
    color: 'gold',
    x: 8,
    y: 77,
    size: 0.64,
    duration: 8.1,
    delay: -2.8,
  },
  {
    id: 7,
    nickname: '밤산책',
    message: '조급하지 않고 나답게 살아가기',
    color: 'violet',
    x: 34,
    y: 82,
    size: 0.72,
    duration: 6.3,
    delay: -1.8,
  },
  {
    id: 8,
    nickname: '구름',
    message: '새로운 시작에 용기가 생기기를',
    color: 'blue',
    x: 56,
    y: 78,
    size: 0.66,
    duration: 7.1,
    delay: -4.8,
  },
  {
    id: 9,
    nickname: '소원',
    message: '올해는 꼭 한 걸음 더 나아가기',
    color: 'red',
    x: 78,
    y: 76,
    size: 0.86,
    duration: 6.7,
    delay: -3.6,
  },
];

const STARS = Array.from(
  { length: 50 },
  (_, index) => ({
    id: index,
    left: `${(index * 37 + 11) % 100}%`,
    top: `${(index * 61 + 7) % 90}%`,
    delay: `${-(index * 0.17).toFixed(2)}s`,
    size: index % 5 === 0 ? 3 : 2,
  })
);

/* -------------------------------------------------
   연등 SVG
------------------------------------------------- */

function LanternIllustration({ color }) {
  const selected =
    COLORS.find((item) => item.id === color) ||
    COLORS[0];

  const gradientId = `lantern-${selected.id}`;

  return (
    <svg
      className="lantern-svg"
      viewBox="0 0 120 150"
      aria-hidden="true"
    >
      <defs>

        <radialGradient
          id={`${gradientId}-glow`}
          cx="50%"
          cy="50%"
          r="55%"
        >
          <stop
            offset="0%"
            stopColor="#fff9d9"
            stopOpacity="1"
          />

          <stop
            offset="38%"
            stopColor={selected.body}
            stopOpacity=".75"
          />

          <stop
            offset="100%"
            stopColor={selected.body}
            stopOpacity="0"
          />
        </radialGradient>

        <linearGradient
          id={`${gradientId}-body`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#fff0b8"
          />

          <stop
            offset="28%"
            stopColor={selected.body}
          />

          <stop
            offset="100%"
            stopColor={selected.body}
            stopOpacity=".68"
          />
        </linearGradient>

      </defs>

      <ellipse
        className="lantern-glow"
        cx="60"
        cy="76"
        rx="54"
        ry="61"
        fill={`url(#${gradientId}-glow)`}
      />

      <path
        className="lantern-string"
        d="M60 0 C60 12 60 18 60 26"
      />

      <path
        className="lantern-top"
        d="M39 25 Q60 17 81 25 L76 34 Q60 28 44 34 Z"
      />

      <path
        className="lantern-body"
        d="M38 34 Q60 27 82 34 L76 111 Q60 120 44 111 Z"
        fill={`url(#${gradientId}-body)`}
      />

      <path
        className="lantern-rib"
        d="
          M48 32 Q43 71 48 113
          M60 30 Q57 73 60 116
          M72 32 Q77 71 72 113
        "
      />

      <path
        className="lantern-band"
        d="M39 58 Q60 66 81 58 L80 66 Q60 74 40 66 Z"
      />

      <path
        className="lantern-band"
        d="M41 96 Q60 103 79 96 L78 104 Q60 111 42 104 Z"
      />

      <path
        className="lantern-bottom"
        d="M44 111 Q60 120 76 111 L70 119 Q60 125 50 119 Z"
      />

      <path
        className="lantern-tassel"
        d="
          M60 119 L60 139
          M53 139 L67 139
          M55 139 L55 147
          M60 139 L60 149
          M65 139 L65 147
        "
      />

      <circle
        className="lantern-flame"
        cx="60"
        cy="79"
        r="13"
        fill="#fff6c9"
      />

      <circle
        className="lantern-flame-core"
        cx="60"
        cy="79"
        r="7"
        fill="#fff"
      />

    </svg>
  );
}

/* -------------------------------------------------
   Lantern Page
------------------------------------------------- */

function LanternPage() {
  const stageRef = useRef(null);

  const [lanterns, setLanterns] =
  useState([]);

const [loading, setLoading] =
  useState(true);

const [saving, setSaving] =
  useState(false);

const [error, setError] =
  useState('');

  const [selectedLantern, setSelectedLantern] =
    useState(null);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [nickname, setNickname] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [selectedColor, setSelectedColor] =
    useState('gold');

  const [mouse, setMouse] =
    useState({
      x: 0.5,
      y: 0.5,
    });

  /* 마우스 인터랙션 */

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const rect =
        stage.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      setMouse({
        x:
          (event.clientX - rect.left) /
          rect.width,

        y:
          (event.clientY - rect.top) /
          rect.height,
      });
    };

    const handleMouseLeave = () => {
      setMouse({
        x: 0.5,
        y: 0.5,
      });
    };

    stage.addEventListener(
      'mousemove',
      handleMouseMove
    );

    stage.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    return () => {
      stage.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      stage.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  useEffect(() => {
  const loadLanterns = async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await lanternApi.getLanterns();

      const data =
        response?.data ?? [];

      const convertedLanterns =
        data.map((lantern, index) => ({
          id: lantern.lanternId,

          nickname:
            lantern.nickname || '익명',

          message:
            lantern.wish,

          color:
            lantern.color || 'gold',

          /*
           * DB에는 위치/크기/애니메이션 값을
           * 저장하지 않는다.
           *
           * 화면에 표시할 때 랜덤하게 결정한다.
           */
          x:
            8 +
            ((index * 17) % 84),

          y:
            34 +
            ((index * 23) % 48),

          size:
            0.68 +
            ((index * 7) % 25) / 100,

          duration:
            6 +
            ((index * 13) % 20) / 10,

          delay:
            -((index * 31) % 60) / 10,
        }));

      setLanterns(
        convertedLanterns
      );

    } catch (err) {

      console.error(
        '연등 조회 실패:',
        err
      );

      setError(
        '연등을 불러오지 못했습니다.'
      );

    } finally {

      setLoading(false);

    }
  };

  loadLanterns();
}, []);

  /* 연등 만들기 */

  const handleOpenCreate = () => {
    setNickname('');
    setMessage('');
    setSelectedColor('gold');
    setCreateOpen(true);
  };

  const handleCreateLantern = async (event) => {
  event.preventDefault();

  const cleanNickname =
    nickname.trim() || '익명';

  const cleanMessage =
    message.trim();

  if (!cleanMessage) {
    return;
  }

  try {

    setSaving(true);

    setError('');

    /*
     * MySQL에 저장
     */
    const response =
      await lanternApi.createLantern({
        nickname: cleanNickname,
        wish: cleanMessage,
        color: selectedColor,
      });

    /*
     * ApiResponse.data
     */
    const saved =
      response?.data;

    if (!saved) {
      throw new Error(
        '저장된 연등 데이터를 받지 못했습니다.'
      );
    }

    /*
     * DB에서 생성된 연등을
     * 화면용 데이터로 변환
     */
    const newLantern = {

      id:
        saved.lanternId,

      nickname:
        saved.nickname,

      message:
        saved.wish,

      color:
        saved.color,

      x:
        8 +
        Math.random() * 84,

      y:
        35 +
        Math.random() * 48,

      size:
        0.68 +
        Math.random() * 0.25,

      duration:
        6 +
        Math.random() * 2,

      delay:
        0,

      isNew:
        true,
    };

    /*
     * 화면에 즉시 추가
     */
    setLanterns((current) => [
      ...current,
      newLantern,
    ]);

    /*
     * 모달 닫기
     */
    setCreateOpen(false);

    /*
     * 방금 만든 연등의 소원 보여주기
     */
    setSelectedLantern(
      newLantern
    );

    /*
     * 입력값 초기화
     */
    setNickname('');
    setMessage('');
    setSelectedColor('gold');

  } catch (err) {

    console.error(
      '연등 저장 실패:',
      err
    );

    setError(
      typeof err === 'string'
        ? err
        : '연등을 저장하지 못했습니다.'
    );

  } finally {

    setSaving(false);

  }
};

  /* 공유 */

  const handleShare = async () => {
    if (!selectedLantern) {
      return;
    }

    const shareText =
      `${selectedLantern.nickname}의 소원\n` +
      `${selectedLantern.message}`;

    try {
      if (
        navigator.share &&
        typeof navigator.share === 'function'
      ) {
        await navigator.share({
          title: '인터넷 연등',
          text: shareText,
          url: window.location.href,
        });

        return;
      }

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(
          `${shareText}\n${window.location.href}`
        );

        window.alert(
          '연등 링크가 클립보드에 복사되었습니다.'
        );
      }
    } catch (error) {
      if (
        error &&
        error.name !== 'AbortError'
      ) {
        console.error(
          '공유 오류:',
          error
        );
      }
    }
  };

  return (
    <main className="lantern-page">

      {/* -------------------------------------------
          메인 전시 공간
      ------------------------------------------- */}

      <section
        ref={stageRef}
        className="lantern-stage"
        style={{
          '--mouse-x': mouse.x,
          '--mouse-y': mouse.y,
        }}
      >

        {/* 별 */}

        <div
          className="lantern-stars"
          aria-hidden="true"
        >
          {STARS.map((star) => (
            <i
              key={star.id}
              style={{
                '--star-left': star.left,
                '--star-top': star.top,
                '--star-delay': star.delay,
                '--star-size': `${star.size}px`,
              }}
            />
          ))}
        </div>

        {/* 달 */}

        <div
          className="lantern-moon"
          aria-hidden="true"
        />

        {/* 제목 */}

        <div className="lantern-intro">

          <p className="lantern-eyebrow">
            ONLINE LANTERN
          </p>

          <h1>
            인터넷 연등
          </h1>

          <p>
            당신의 소원을 하나의 연등에 담아
            <br />
            이 밤에 함께 밝혀주세요.
          </p>

        </div>

        {/* 연등 전시 */}

        <div
          className="lantern-field"
          aria-label="인터넷 연등 전시 공간"
        >

          {lanterns.map((lantern) => (

            <button
              key={lantern.id}
              type="button"
              className={
                `floating-lantern ${
                  lantern.isNew
                    ? 'new-lantern'
                    : ''
                }`
              }
              style={{
                left: `${lantern.x}%`,
                top: `${lantern.y}%`,
                '--size': lantern.size,
                '--duration':
                  `${lantern.duration}s`,
                '--delay':
                  `${lantern.delay}s`,
                '--parallax-x':
                  `${(mouse.x - 0.5) * -18}px`,
                '--parallax-y':
                  `${(mouse.y - 0.5) * -12}px`,
              }}
              onClick={() =>
                setSelectedLantern(lantern)
              }
              aria-label={
                `${lantern.nickname}의 연등. ` +
                '클릭하면 소원을 볼 수 있습니다.'
              }
            >

              <LanternIllustration
                color={lantern.color}
              />

              <span className="lantern-hover-label">
                소원 보기
              </span>

            </button>

          ))}

        </div>

        {/* 연등 숫자 */}

        <div className="lantern-copy">
          {lanterns.length}
          개의 소원이
          이곳에 머물고 있어요.
        </div>

        {/* 만들기 버튼 */}

        <button
          type="button"
          className="lantern-create-button"
          onClick={handleOpenCreate}
        >
          <span className="plus">
            +
          </span>

          <span>
            내 연등 달기
          </span>
        </button>

        <div
          className="lantern-scroll-hint"
          aria-hidden="true"
        >
          <span>
            SCROLL TO EXPLORE
          </span>

          <i />
        </div>

      </section>

      {/* -------------------------------------------
          안내
      ------------------------------------------- */}

      <section className="lantern-guide">

        <div className="lantern-guide-inner">

          <p className="lantern-eyebrow">
            MAKE A WISH
          </p>

          <h2>
            소원을 남기는
            <br />
            가장 작은 방법
          </h2>

          <p>
            연등을 만들고,
            이곳에 걸어주세요.
            <br />
            당신의 소원은 다른 사람들의
            소원과 함께 밤을 밝힙니다.
          </p>

          <button
            type="button"
            onClick={handleOpenCreate}
          >
            연등 만들기
          </button>

        </div>

      </section>

      
{/* 소원 목록 */}
<section
  className="lantern-wishes"
  aria-labelledby="lantern-wishes-title"
>
  <div className="lantern-wishes-inner">
    <p className="lantern-eyebrow">
      WISHES FROM EVERYONE
    </p>

    <div className="lantern-wishes-heading">
      <h2 id="lantern-wishes-title">
        함께 모인 소원
      </h2>
      <span>{lanterns.length}개의 소원</span>
    </div>

    <p className="lantern-wishes-description">
      누군가의 바람이 모여 이 밤을 밝힙니다.
    </p>

    {loading ? (
      <p className="lantern-wishes-state">
        소원을 불러오는 중입니다...
      </p>
    ) : lanterns.length === 0 ? (
      <p className="lantern-wishes-state">
        아직 등록된 소원이 없어요.
        첫 번째 소원을 남겨주세요.
      </p>
    ) : (
      <ul className="lantern-wish-list">
        {lanterns.map((lantern) => (
          <li
            className="lantern-wish-item"
            key={lantern.id}
          >
            <span
              className="lantern-wish-mark"
              aria-hidden="true"
            >
              ✦
            </span>

            <div className="lantern-wish-text">
              <p>{lantern.message}</p>

              <div className="lantern-wish-meta">
                <span>
                  {lantern.nickname || '익명'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="lantern-wish-view"
              onClick={() => setSelectedLantern(lantern)}
            >
              보기
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</section>


      {/* -------------------------------------------
          연등 만들기 모달
      ------------------------------------------- */}

      {createOpen && (

        <div
          className="lantern-modal-backdrop"
          onMouseDown={() =>
            setCreateOpen(false)
          }
          role="presentation"
        >

          <div
            className="lantern-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lantern-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="lantern-modal-close"
              onClick={() =>
                setCreateOpen(false)
              }
              aria-label="닫기"
            >
              ×
            </button>

            {/* 미리보기 */}

            <div className="lantern-modal-preview">

              <LanternIllustration
                color={selectedColor}
              />

            </div>

            {/* 입력 */}

            <div className="lantern-modal-content">

              <p className="lantern-eyebrow">
                MY LANTERN
              </p>

              <h2 id="lantern-modal-title">
                나의 연등 만들기
              </h2>

              <p className="modal-description">
                짧은 소원 하나를 남겨주세요.
              </p>

              <form
                onSubmit={
                  handleCreateLantern
                }
              >

                <label>
                  이름 또는 닉네임

                  <input
                    type="text"
                    value={nickname}
                    onChange={(event) =>
                      setNickname(
                        event.target.value
                      )
                    }
                    maxLength={20}
                    placeholder="익명"
                  />
                </label>

                <label>
                  나의 소원

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    maxLength={80}
                    rows={3}
                    placeholder="올해는 조금 더 행복하게 살게 해주세요."
                    required
                  />

                  <span className="character-count">
                    {message.length}/80
                  </span>
                </label>

                <fieldset>

                  <legend>
                    연등의 빛
                  </legend>

                  <div className="color-picker">

                    {COLORS.map((item) => (

                      <button
                        key={item.id}
                        type="button"
                        className={
                          `color-option ${
                            selectedColor === item.id
                              ? 'selected'
                              : ''
                          }`
                        }
                        style={{
                          '--lantern-color':
                            item.body,
                        }}
                        onClick={() =>
                          setSelectedColor(
                            item.id
                          )
                        }
                        aria-label={
                          item.label
                        }
                        aria-pressed={
                          selectedColor ===
                          item.id
                        }
                      />

                    ))}

                  </div>

                </fieldset>

                <button
  className="lantern-submit"
  type="submit"
  disabled={saving}
>
  {saving
    ? '연등을 밝히는 중...'
    : '연등 달기'}
</button>

              </form>

            </div>

          </div>

        </div>

      )}

      {/* -------------------------------------------
          소원 보기
      ------------------------------------------- */}

      {selectedLantern &&
        !createOpen && (

          <div
            className="wish-modal-backdrop"
            onMouseDown={() =>
              setSelectedLantern(null)
            }
            role="presentation"
          >

            <div
              className="wish-modal"
              role="dialog"
              aria-modal="true"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              <button
                type="button"
                className="lantern-modal-close"
                onClick={() =>
                  setSelectedLantern(null)
                }
                aria-label="닫기"
              >
            
              </button>

              <div className="wish-lantern">

                <LanternIllustration
                  color={
                    selectedLantern.color
                  }
                />

              </div>

              <p className="lantern-eyebrow">
                A WISH FROM{' '}
                {selectedLantern.nickname.toUpperCase()}
              </p>

              <p className="wish-message">
                “{selectedLantern.message}”
              </p>

              <button
                type="button"
                className="wish-share"
                onClick={handleShare}
              >
                내 연등 공유하기
              </button>

            </div>

          </div>

        )}

    </main>
  );
}

export default LanternPage;