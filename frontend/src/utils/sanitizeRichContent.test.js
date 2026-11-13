import { sanitizeRichContent } from './sanitizeRichContent';

describe('sanitizeRichContent', () => {
  it('preserves supported text styling', () => {
    const result = sanitizeRichContent(
      '<p><span style="font-size:24px;letter-spacing:2px;font-weight:700">제목</span>' +
      '<span style="line-height:1.5">본문</span></p>'
    );

    expect(result).toContain('font-size:24px');
    expect(result).toContain('letter-spacing:2px');
    expect(result).toContain('font-weight:700');
    expect(result).toContain('제목');
    expect(result).toContain('line-height:1.5');
    expect(result).toContain('본문');
  });

  it('keeps secure image sources and removes unsafe image URLs', () => {
    const result = sanitizeRichContent(
      '<p><img src="https://images.example.test/photo.png" alt="사진">' +
      '<img src="javascript:alert(1)" alt="위험"></p>'
    );

    expect(result).toContain('https://images.example.test/photo.png');
    expect(result).toContain('alt="사진"');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('위험');
  });

  it('removes active content, event attributes, and unsupported styles', () => {
    const result = sanitizeRichContent(
      '<p onclick="alert(1)" style="font-size:100px;color:red">본문' +
      '<script>alert(1)</script><img src="x" onerror="alert(2)"></p>'
    );

    expect(result).toContain('본문');
    expect(result).not.toContain('script');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('font-size');
    expect(result).not.toContain('color');
  });
});
