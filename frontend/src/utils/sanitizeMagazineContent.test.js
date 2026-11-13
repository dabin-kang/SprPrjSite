import { sanitizeMagazineContent } from './sanitizeMagazineContent';

describe('sanitizeMagazineContent', () => {
  it('preserves supported text styling', () => {
    const result = sanitizeMagazineContent(
      '<p><span style="font-size:24px;letter-spacing:2px;font-weight:700">제목</span></p>'
    );

    expect(result).toContain('font-size:24px');
    expect(result).toContain('letter-spacing:2px');
    expect(result).toContain('font-weight:700');
    expect(result).toContain('제목');
  });

  it('removes active content, event attributes, and unsupported styles', () => {
    const result = sanitizeMagazineContent(
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
