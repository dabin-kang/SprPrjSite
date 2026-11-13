const ALLOWED_TAGS = new Set([
  'p', 'div', 'br', 'span', 'strong', 'b', 'em', 'i', 'u',
  'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol', 'li', 'img',
]);

const BLOCKED_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math',
  'template', 'noscript',
]);

function getAllowedStyle(element) {
  const styles = [];
  const fontSize = element.style.fontSize.trim().toLowerCase();
  const fontWeight = element.style.fontWeight.trim().toLowerCase();
  const letterSpacing = element.style.letterSpacing.trim().toLowerCase();
  const lineHeight = element.style.lineHeight.trim().toLowerCase();

  if (/^(?:8|9|[1-4]\d|5[0-6])px$/.test(fontSize)) {
    styles.push(`font-size:${fontSize}`);
  }
  if (/^(?:normal|bold|[4-9]00)$/.test(fontWeight)) {
    styles.push(`font-weight:${fontWeight}`);
  }
  if (letterSpacing === 'normal' || /^-?\d+(?:\.\d+)?px$/.test(letterSpacing)) {
    const numericSpacing = Number.parseFloat(letterSpacing);
    if (letterSpacing === 'normal' || (numericSpacing >= -2 && numericSpacing <= 10)) {
      styles.push(`letter-spacing:${letterSpacing}`);
    }
  }
  if (/^(?:1|1\.\d{1,2}|2(?:\.0{1,2})?)$/.test(lineHeight)) {
    styles.push(`line-height:${lineHeight}`);
  }

  return styles.join(';');
}

function appendSanitizedNode(sourceNode, targetParent, documentNode) {
  if (sourceNode.nodeType === 3) {
    targetParent.appendChild(documentNode.createTextNode(sourceNode.nodeValue || ''));
    return;
  }

  if (sourceNode.nodeType !== 1) return;

  const tagName = sourceNode.tagName.toLowerCase();
  if (BLOCKED_TAGS.has(tagName)) return;

  if (!ALLOWED_TAGS.has(tagName)) {
    Array.from(sourceNode.childNodes).forEach((child) => {
      appendSanitizedNode(child, targetParent, documentNode);
    });
    return;
  }

  const safeElement = documentNode.createElement(tagName);
  if (tagName === 'img') {
    const source = sourceNode.getAttribute('src')?.trim() || '';
    const isSafeSource = /^https:\/\//i.test(source) || /^\/(?!\/)/.test(source);
    if (!isSafeSource) return;
    safeElement.setAttribute('src', source);
    safeElement.setAttribute('alt', (sourceNode.getAttribute('alt') || '').slice(0, 300));
    targetParent.appendChild(safeElement);
    return;
  }

  const safeStyle = getAllowedStyle(sourceNode);
  if (safeStyle) safeElement.setAttribute('style', safeStyle);

  Array.from(sourceNode.childNodes).forEach((child) => {
    appendSanitizedNode(child, safeElement, documentNode);
  });
  targetParent.appendChild(safeElement);
}

export function sanitizeRichContent(content) {
  if (typeof content !== 'string' || !content) return '';

  const parsedDocument = new DOMParser().parseFromString(content, 'text/html');
  const sanitizedContainer = parsedDocument.createElement('div');
  Array.from(parsedDocument.body.childNodes).forEach((node) => {
    appendSanitizedNode(node, sanitizedContainer, parsedDocument);
  });
  return sanitizedContainer.innerHTML;
}
