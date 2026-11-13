import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { sanitizeRichContent } from '../../utils/sanitizeRichContent';
import './RichContentEditor.css';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px'];
const LINE_HEIGHTS = ['1', '1.2', '1.5', '1.8', '2'];
const LETTER_SPACINGS = [
  { value: 'normal', label: '기본' },
  { value: '-1px', label: '-1px' },
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '4px', label: '4px' },
];

function selectedTextNodes(editor, range) {
  const textNodes = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (node.nodeValue && range.intersectsNode(node)) {
      const start = node === range.startContainer ? range.startOffset : 0;
      const end = node === range.endContainer ? range.endOffset : node.nodeValue.length;
      if (end > start) textNodes.push({ node, start, end });
    }
    node = walker.nextNode();
  }

  return textNodes;
}

function RichContentEditor({
  initialContent,
  disabled = false,
  onUploadImage,
}, ref) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const selectionRef = useRef(null);
  const [message, setMessage] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [letterSpacing, setLetterSpacing] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      const editor = editorRef.current;
      const hasText = editor?.textContent?.replace(/\u00a0/g, ' ').trim();
      if (!editor || (!hasText && !editor.querySelector('img'))) return '';
      return sanitizeRichContent(editor.innerHTML);
    },
  }), []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = sanitizeRichContent(initialContent || '');
    }
  }, [initialContent]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

  const getSavedRange = () => {
    const range = selectionRef.current;
    if (!range || !editorRef.current?.contains(range.commonAncestorContainer)) return null;
    return range;
  };

  const applyStyle = (property, value) => {
    const range = getSavedRange();
    const editor = editorRef.current;
    if (!range || range.collapsed) {
      setMessage('서식을 적용할 글자를 먼저 선택하세요.');
      return;
    }

    const textNodes = selectedTextNodes(editor, range);
    if (textNodes.length === 0) {
      setMessage('서식을 적용할 글자를 먼저 선택하세요.');
      return;
    }

    const wrappers = [];
    for (let index = textNodes.length - 1; index >= 0; index -= 1) {
      const { node, start, end } = textNodes[index];
      const selectedRange = document.createRange();
      selectedRange.setStart(node, start);
      selectedRange.setEnd(node, end);

      const wrapper = document.createElement('span');
      wrapper.style[property] = value;
      selectedRange.surroundContents(wrapper);
      wrappers.unshift(wrapper);
    }

    const updatedRange = document.createRange();
    updatedRange.setStartBefore(wrappers[0]);
    updatedRange.setEndAfter(wrappers[wrappers.length - 1]);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(updatedRange);
    selectionRef.current = updatedRange.cloneRange();
    editor.focus();
    setMessage('');
  };

  const toggleBold = () => {
    const range = getSavedRange();
    if (!range || range.collapsed) {
      setMessage('굵기를 바꿀 글자를 먼저 선택하세요.');
      return;
    }

    const startNode = range.startContainer.nodeType === 1
      ? range.startContainer
      : range.startContainer.parentElement;
    const weight = Number.parseInt(window.getComputedStyle(startNode).fontWeight, 10);
    applyStyle('fontWeight', weight >= 600 ? '400' : '700');
  };

  const insertImage = (source, alt) => {
    const editor = editorRef.current;
    let range = getSavedRange();
    if (!range) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    } else {
      range.collapse(false);
    }

    const image = document.createElement('img');
    image.src = source;
    image.alt = alt;
    range.insertNode(image);

    const lineBreak = document.createElement('br');
    image.parentNode.insertBefore(lineBreak, image.nextSibling);
    const updatedRange = document.createRange();
    updatedRange.setStartAfter(lineBreak);
    updatedRange.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(updatedRange);
    selectionRef.current = updatedRange.cloneRange();
    editor.focus();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('JPG, PNG, WEBP 이미지 파일만 추가할 수 있습니다.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('이미지는 5MB 이하만 추가할 수 있습니다.');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    setMessage('');
    try {
      const source = await onUploadImage(file);
      if (!source || (!/^https:\/\//i.test(source) && !/^\/(?!\/)/.test(source))) {
        throw new Error('이미지 주소를 확인할 수 없습니다.');
      }
      insertImage(source, file.name);
    } catch (error) {
      setMessage(typeof error === 'string' ? error : error?.message || '이미지를 추가하지 못했습니다.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || !editorRef.current?.contains(range.commonAncestorContainer)) return;

    range.deleteContents();
    const pastedText = document.createTextNode(event.clipboardData.getData('text/plain'));
    range.insertNode(pastedText);
    range.setStartAfter(pastedText);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    saveSelection();
  };

  return (
    <div className="rich-content-editor">
      <div className="rich-editor-toolbar" aria-label="본문 서식 도구">
        <button
          type="button"
          className="rich-editor-bold"
          aria-label="굵게"
          title="선택한 글자 굵게"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleBold}
        >
          B
        </button>
        <label>
          글자 크기
          <select
            aria-label="글자 크기"
            value={fontSize}
            disabled={disabled}
            onChange={(event) => {
              const nextSize = event.target.value;
              setFontSize('');
              applyStyle('fontSize', nextSize);
            }}
          >
            <option value="">크기 선택</option>
            {FONT_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <label>
          글자 자간
          <select
            aria-label="글자 자간"
            value={letterSpacing}
            disabled={disabled}
            onChange={(event) => {
              const nextSpacing = event.target.value;
              setLetterSpacing('');
              applyStyle('letterSpacing', nextSpacing);
            }}
          >
            <option value="">자간 선택</option>
            {LETTER_SPACINGS.map((spacing) => (
              <option key={spacing.value} value={spacing.value}>{spacing.label}</option>
            ))}
          </select>
        </label>
        <label>
          줄 간격
          <select
            aria-label="줄 간격"
            value={lineHeight}
            disabled={disabled}
            onChange={(event) => {
              const nextLineHeight = event.target.value;
              setLineHeight('');
              applyStyle('lineHeight', nextLineHeight);
            }}
          >
            <option value="">줄 간격 선택</option>
            {LINE_HEIGHTS.map((height) => (
              <option key={height} value={height}>{height}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rich-editor-image"
          disabled={disabled || uploadingImage || !onUploadImage}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => imageInputRef.current?.click()}
        >
          {uploadingImage ? '업로드 중...' : '이미지'}
        </button>
        <input
          ref={imageInputRef}
          className="rich-editor-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled || uploadingImage || !onUploadImage}
          aria-label="본문 이미지 업로드"
          onChange={handleImageChange}
        />
        <span className="rich-editor-help">텍스트를 선택해 서식을 적용하거나, 이미지 버튼으로 업로드하세요.</span>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-surface"
        contentEditable={!disabled}
        role="textbox"
        aria-label="본문 편집기"
        aria-multiline="true"
        suppressContentEditableWarning
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onInput={() => setMessage('')}
        onPaste={handlePaste}
      />
      {message && <p className="rich-editor-message" role="status">{message}</p>}
    </div>
  );
}

export default forwardRef(RichContentEditor);
