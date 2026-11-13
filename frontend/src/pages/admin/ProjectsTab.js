import React, { useState } from 'react';
import { projectApi } from '../../api';
import { Field, FormError, getErrorMessage, ListState, Pagination, useAdminList } from './CmsShared';

const emptySection = () => ({
  title: '',
  content: '',
  sectionType: 'TEXT',
  sortOrder: 0,
  images: [],
});

const emptyProject = () => ({
  title: '',
  description: '',
  slug: '',
  projectNo: '',
  category: '',
  techStack: '',
  projectUrl: '',
  imageUrl: '',
  sortOrder: 0,
  status: '0',
  sections: [],
});

function ProjectsTab() {
  const list = useAdminList(projectApi.getAdminProjects, 'projects');
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProject());
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = async (projectId) => {
    setLoadingProject(true);
    setFormError('');
    try {
      const response = await projectApi.getAdminProject(projectId);
      const project = response?.data;
      if (!project?.projectId) throw new Error('프로젝트 상세 응답이 올바르지 않습니다.');
      setEditingId(project.projectId);
      setForm({
        title: project.title || '',
        description: project.description || '',
        slug: project.slug || '',
        projectNo: String(project.projectNo ?? ''),
        category: project.category || '',
        techStack: project.techStack || '',
        projectUrl: project.projectUrl || '',
        imageUrl: project.imageUrl || '',
        sortOrder: Number(project.sortOrder ?? 0),
        status: String(project.status ?? 0),
        sections: (project.sections || []).map((section, index) => ({
          title: section.title || '',
          content: section.content || '',
          sectionType: section.sectionType || 'TEXT',
          sortOrder: Number(section.sortOrder ?? index),
          images: (section.images || []).map((image, imageIndex) => ({
            imageUrl: image.imageUrl || '',
            imageAlt: image.imageAlt || '',
            imageType: image.imageType || 'CONTENT',
            sortOrder: Number(image.sortOrder ?? imageIndex),
          })),
        })),
      });
      setFormOpen(true);
    } catch (error) {
      list.setError(getErrorMessage(error, '프로젝트 정보를 불러오지 못했습니다.'));
    } finally {
      setLoadingProject(false);
    }
  };

  const uploadImage = async (file, onComplete) => {
    if (!file) return;
    if (!form.slug.trim()) {
      setFormError('이미지를 올리기 전에 프로젝트 URL 식별자를 입력해 주세요.');
      return;
    }
    setUploading(true);
    setFormError('');
    try {
      const response = await projectApi.uploadProjectImage(file, form.slug.trim());
      if (!response?.imageUrl) throw new Error(response?.message || '업로드 결과를 확인할 수 없습니다.');
      onComplete(response.imageUrl);
    } catch (error) {
      setFormError(getErrorMessage(error, '이미지를 업로드하지 못했습니다.'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving || uploading) return;
    setSaving(true);
    setFormError('');
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      slug: form.slug.trim(),
      projectNo: Number(form.projectNo),
      category: form.category.trim(),
      techStack: form.techStack.trim(),
      projectUrl: form.projectUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      sortOrder: Number(form.sortOrder),
      status: Number(form.status),
      sections: form.sections.map((section, index) => ({
        ...section,
        title: section.title.trim(),
        content: section.content.trim(),
        sortOrder: Number(section.sortOrder ?? index),
        images: section.images.map((image, imageIndex) => ({
          ...image,
          imageUrl: image.imageUrl.trim(),
          imageAlt: image.imageAlt.trim(),
          sortOrder: Number(image.sortOrder ?? imageIndex),
        })),
      })),
    };
    try {
      if (editingId === null) await projectApi.createProject(payload);
      else await projectApi.updateProject(editingId, payload);
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyProject());
      await list.reload();
    } catch (error) {
      setFormError(getErrorMessage(error, '프로젝트를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`"${project.title}" 프로젝트를 삭제할까요?`)) return;
    try {
      await projectApi.deleteProject(project.projectId);
      await list.reload();
    } catch (error) {
      list.setError(getErrorMessage(error, '프로젝트를 삭제하지 못했습니다.'));
    }
  };

  const updateSection = (sectionIndex, changes) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...changes } : section),
    }));
  };

  const updateImage = (sectionIndex, imageIndex, changes) => {
    const sections = form.sections.map((section, index) => (
      index === sectionIndex
        ? {
          ...section,
          images: section.images.map((image, currentImageIndex) =>
            currentImageIndex === imageIndex ? { ...image, ...changes } : image),
        }
        : section
    ));
    setForm({ ...form, sections });
  };

  return (
    <section>
      <div className="admin-panel-header">
        <div>
          <h2>프로젝트 관리</h2>
          <p>총 {list.total}개</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          프로젝트 등록
        </button>
      </div>

      {loadingProject && <div className="spinner" role="status">프로젝트를 불러오는 중...</div>}

      {formOpen && (
        <form className="card admin-editor" onSubmit={handleSave}>
          <div className="card-body">
            <h3>{editingId === null ? '새 프로젝트 등록' : '프로젝트 수정'}</h3>
            <div className="admin-form-grid">
              <Field label="제목">
                <input className="form-control" maxLength={200} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="URL 식별자">
                <input className="form-control" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </Field>
              <Field label="표시 번호">
                <input className="form-control" type="number" min="1" required value={form.projectNo} onChange={(e) => setForm({ ...form, projectNo: e.target.value })} />
              </Field>
              <Field label="분류">
                <input className="form-control" maxLength={100} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </Field>
              <Field label="기술·태그">
                <input className="form-control" maxLength={500} value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
              </Field>
              <Field label="외부 프로젝트 URL">
                <input className="form-control" type="url" maxLength={500} value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} />
              </Field>
              <Field label="정렬 순서">
                <input className="form-control" type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </Field>
              <Field label="공개 상태">
                <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="0">임시 저장</option>
                  <option value="1">공개</option>
                  <option value="2">비공개</option>
                </select>
              </Field>
            </div>
            <Field label="요약">
              <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="대표 이미지 경로">
              <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <input
                className="form-control"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading || saving}
                onChange={(e) => uploadImage(e.target.files?.[0], (imageUrl) => setForm((current) => ({ ...current, imageUrl })))}
              />
            </Field>

            <div className="admin-section-heading">
              <h4>상세 콘텐츠 섹션</h4>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setForm({ ...form, sections: [...form.sections, emptySection()] })}>
                섹션 추가
              </button>
            </div>
            {form.sections.map((section, sectionIndex) => (
              <fieldset className="admin-section-editor" key={`section-${sectionIndex}`}>
                <legend>섹션 {sectionIndex + 1}</legend>
                <div className="admin-form-grid">
                  <Field label="섹션 제목">
                    <input className="form-control" maxLength={200} required value={section.title} onChange={(e) => updateSection(sectionIndex, { title: e.target.value })} />
                  </Field>
                  <Field label="섹션 유형">
                    <select className="form-control" value={section.sectionType} onChange={(e) => updateSection(sectionIndex, { sectionType: e.target.value })}>
                      <option value="TEXT">텍스트</option>
                      <option value="GALLERY">이미지 갤러리</option>
                    </select>
                  </Field>
                  <Field label="정렬 순서">
                    <input className="form-control" type="number" min="0" value={section.sortOrder} onChange={(e) => updateSection(sectionIndex, { sortOrder: Number(e.target.value) })} />
                  </Field>
                </div>
                <Field label="본문">
                  <textarea className="form-control" rows={5} value={section.content} onChange={(e) => updateSection(sectionIndex, { content: e.target.value })} />
                </Field>
                <div className="admin-section-heading">
                  <strong>섹션 이미지</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateSection(sectionIndex, {
                      images: [...section.images, { imageUrl: '', imageAlt: '', imageType: 'CONTENT', sortOrder: section.images.length }],
                    })}
                  >
                    이미지 추가
                  </button>
                </div>
                {section.images.map((image, imageIndex) => (
                  <div className="admin-image-row" key={`image-${imageIndex}`}>
                    <Field label="이미지 경로">
                      <input className="form-control" required value={image.imageUrl} onChange={(e) => updateImage(sectionIndex, imageIndex, { imageUrl: e.target.value })} />
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading || saving}
                        onChange={(e) => uploadImage(e.target.files?.[0], (imageUrl) => updateImage(sectionIndex, imageIndex, { imageUrl }))}
                      />
                    </Field>
                    <Field label="대체 텍스트">
                      <input className="form-control" maxLength={300} value={image.imageAlt} onChange={(e) => updateImage(sectionIndex, imageIndex, { imageAlt: e.target.value })} />
                    </Field>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => updateSection(sectionIndex, { images: section.images.filter((_, index) => index !== imageIndex) })}
                    >
                      이미지 제거
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setForm({
                    ...form,
                    sections: form.sections.filter((_, index) => index !== sectionIndex),
                  })}
                >
                  섹션 제거
                </button>
              </fieldset>
            ))}

            <FormError>{formError}</FormError>
            <div className="admin-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)} disabled={saving || uploading}>
                취소
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                {uploading ? '이미지 업로드 중...' : saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      )}

      <ListState loading={list.loading} error={list.error} empty={list.rows.length === 0 && '등록된 프로젝트가 없습니다.'}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>번호</th><th>프로젝트</th><th>URL</th><th>분류</th><th>상태</th><th>관리</th></tr>
            </thead>
            <tbody>
              {list.rows.map((project) => (
                <tr key={project.projectId}>
                  <td>{project.projectNo ?? '-'}</td>
                  <td>{project.title}</td>
                  <td>{project.slug || '-'}</td>
                  <td>{project.category || '-'}</td>
                  <td>{project.status === 1 ? '공개' : project.status === 2 ? '비공개' : '임시 저장'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => openEdit(project.projectId)} disabled={loadingProject}>수정</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteProject(project)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListState>
      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} />
    </section>
  );
}

export default ProjectsTab;
