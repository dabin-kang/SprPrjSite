import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { sanitizeMagazineContent } from '../../utils/sanitizeMagazineContent';
import './MagazineContentEditor.css';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px'];
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

function MagazineContentEditor({ initialContent, disabled = false }, ref) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const [message, setMessage] = useState('');
  const [fontSize, setFontSize] = useState('');

  useImperativeHandle(ref, () => ({
    getContent: () => {
      const editor = editorRef.current;
      if (!editor || !editor.textContent?.replace(/\u00a0/g, ' ').trim()) return '';
      return sanitizeMagazineContent(editor.innerHTML);
    },
  }), []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = sanitizeMagazineContent(initialContent || '');
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
    <div className="magazine-content-editor">
      <div className="magazine-editor-toolbar" aria-label="본문 서식 도구">
        <button
          type="button"
          className="magazine-editor-bold"
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
              setFontSize(nextSize);
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
            defaultValue="normal"
            disabled={disabled}
            onChange={(event) => applyStyle('letterSpacing', event.target.value)}
          >
            {LETTER_SPACINGS.map((spacing) => (
              <option key={spacing.value} value={spacing.value}>{spacing.label}</option>
            ))}
          </select>
        </label>
        <span className="magazine-editor-help">적용할 글자를 드래그한 뒤 서식을 선택하세요.</span>
      </div>
      <div
        ref={editorRef}
        className="magazine-editor-surface"
        contentEditable={!disabled}
        role="textbox"
        aria-label="매거진 본문"
        aria-multiline="true"
        suppressContentEditableWarning
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onInput={() => setMessage('')}
        onPaste={handlePaste}
      />
      {message && <p className="magazine-editor-message" role="status">{message}</p>}
    </div>
  );
}

export default forwardRef(MagazineContentEditor);
