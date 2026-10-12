import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '../../../api/projects';
import { Project, ProjectCreateRequest, ProjectUpdateRequest } from '../../../types/admin';
import { Save, ArrowLeft, Image as ImageIcon, Video, Trash2, UploadCloud } from 'lucide-react';
import '../../../styles/admin.css';

export function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [pendingPoster, setPendingPoster] = useState<File | null>(null);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);

  const posterInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    releaseYear: new Date().getFullYear(),
    role: '',
    tools: '',
    client: '',
    context: '',
    editingApproach: '',
    visualStyle: '',
    credits: '',
    aspectRatio: '16:9',
    previewStart: 0,
    previewDuration: 10,
    published: false
  });

  useEffect(() => {
    if (isEditing) {
      projectApi.getById(Number(id))
        .then(data => {
          setProject(data);
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            category: data.category || '',
            releaseYear: data.releaseYear || new Date().getFullYear(),
            role: data.role || '',
            tools: data.tools || '',
            client: data.client || '',
            context: data.context || '',
            editingApproach: data.editingApproach || '',
            visualStyle: data.visualStyle || '',
            credits: data.credits || '',
            aspectRatio: data.aspectRatio || '16:9',
            previewStart: data.previewStart || 0,
            previewDuration: data.previewDuration || 10,
            published: data.published || false
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        const data = await projectApi.update(Number(id), formData as ProjectUpdateRequest);
        setProject(data);
        setSuccess('Project saved successfully.');
      } else {
        const data = await projectApi.create(formData as ProjectCreateRequest);
        
        let uploadFailed = false;
        
        if (pendingPoster) {
          setUploadingPoster(true);
          try {
            await projectApi.uploadMedia(data.id, 'POSTER', pendingPoster);
          } catch(err: any) {
            uploadFailed = true;
            setError(`Project created, but poster upload failed: ${err.message}`);
          }
          setUploadingPoster(false);
        }
        
        if (pendingVideo && !uploadFailed) {
          setUploadingVideo(true);
          try {
            await projectApi.uploadMedia(data.id, 'VIDEO', pendingVideo);
          } catch(err: any) {
            uploadFailed = true;
            setError(`Project created, but video upload failed: ${err.message}`);
          }
          setUploadingVideo(false);
        }

        if (!uploadFailed) {
          navigate(`/admin/projects/${data.id}/edit`, { replace: true });
        } else {
          navigate(`/admin/projects/${data.id}/edit`, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'POSTER' | 'VIDEO') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEditing && project) {
      if (mediaType === 'POSTER') setUploadingPoster(true);
      if (mediaType === 'VIDEO') setUploadingVideo(true);
      setError('');

      try {
        const updatedProject = await projectApi.uploadMedia(project.id, mediaType, file);
        setProject(updatedProject);
        setSuccess(`${mediaType} uploaded successfully.`);
      } catch (err: any) {
        setError(`Failed to upload ${mediaType}: ` + err.message);
      } finally {
        if (mediaType === 'POSTER') setUploadingPoster(false);
        if (mediaType === 'VIDEO') setUploadingVideo(false);
      }
    } else {
      if (mediaType === 'POSTER') setPendingPoster(file);
      if (mediaType === 'VIDEO') setPendingVideo(file);
    }
    
    // Reset input so selecting the same file again triggers change event
    if (e.target) e.target.value = '';
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!project) return;
    if (!window.confirm('Delete this media permanently?')) return;
    
    try {
      const updatedProject = await projectApi.removeMedia(project.id, mediaId);
      setProject(updatedProject);
      setSuccess('Media deleted successfully.');
    } catch (err: any) {
      setError('Failed to delete media: ' + err.message);
    }
  };

  const handleRemovePendingMedia = (mediaType: 'POSTER' | 'VIDEO') => {
    if (mediaType === 'POSTER') setPendingPoster(null);
    if (mediaType === 'VIDEO') setPendingVideo(null);
  };

  if (loading) return <div className="admin-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LOADING...</div>;

  return (
    <div className="admin-layout">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate('/admin/projects')} className="admin-btn-secondary" style={{ marginBottom: '1rem' }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO PROJECTS
          </button>
          <h1 className="admin-heading">{isEditing ? 'EDIT PROJECT' : 'NEW PROJECT'}</h1>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-content-box" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', marginBottom: '2rem' }}>PROJECT INFORMATION</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            <div className="admin-field">
              <label>TITLE</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} />
            </div>

            <div className="admin-field">
              <label>SLUG</label>
              <input type="text" name="slug" required value={formData.slug} onChange={handleChange} />
            </div>

            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>DESCRIPTION</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
            </div>

            <div className="admin-field">
              <label>CATEGORY</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} />
            </div>

            <div className="admin-field">
              <label>RELEASE YEAR</label>
              <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
            </div>

            <div className="admin-field">
              <label>ROLE</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>

            <div className="admin-field">
              <label>CLIENT</label>
              <input type="text" name="client" value={formData.client} onChange={handleChange} />
            </div>

            <div className="admin-field" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
              <label>PUBLISHED</label>
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem' }} />
            </div>
          </div>
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '3rem 0' }} />

          <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', marginBottom: '2rem' }}>MEDIA</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            
            {/* POSTER */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center' }}>
                  <ImageIcon className="w-4 h-4" style={{ marginRight: '0.5rem' }} /> POSTER
                </h3>
                <button 
                  type="button"
                  onClick={() => posterInputRef.current?.click()} 
                  disabled={uploadingPoster || saving}
                  className="admin-btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <UploadCloud className="w-3 h-3" /> {(isEditing ? project?.posterUrl : pendingPoster) ? 'REPLACE' : 'UPLOAD'}
                </button>
                <input 
                  type="file" 
                  ref={posterInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'POSTER')}
                />
              </div>

              {uploadingPoster ? (
                <div style={{ aspectRatio: '16/9', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44aaff', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  UPLOADING...
                </div>
              ) : isEditing && project?.posterUrl ? (
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                  <img src={project.posterUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster" />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#fff' }}>
                    {project.posterUrl.split('/').pop()}
                  </div>
                  <button type="button" onClick={() => {
                      const pm = project.media.find(m => m.mediaType === 'POSTER');
                      if (pm) handleDeleteMedia(pm.id);
                    }} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ff4444', color: '#fff', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : pendingPoster ? (
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                  <img src={URL.createObjectURL(pendingPoster)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Poster Preview" />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#fff' }}>
                    {pendingPoster.name}
                  </div>
                  <button type="button" onClick={() => handleRemovePendingMedia('POSTER')} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ff4444', color: '#fff', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div style={{ aspectRatio: '16/9', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  NO POSTER UPLOADED
                </div>
              )}
            </div>

            {/* VIDEO */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center' }}>
                  <Video className="w-4 h-4" style={{ marginRight: '0.5rem' }} /> VIDEO
                </h3>
                <button 
                  type="button"
                  onClick={() => videoInputRef.current?.click()} 
                  disabled={uploadingVideo || saving}
                  className="admin-btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <UploadCloud className="w-3 h-3" /> {(isEditing ? project?.videoUrl : pendingVideo) ? 'REPLACE' : 'UPLOAD'}
                </button>
                <input 
                  type="file" 
                  ref={videoInputRef}
                  style={{ display: 'none' }}
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'VIDEO')}
                />
              </div>

              {uploadingVideo ? (
                <div style={{ aspectRatio: '16/9', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#44aaff', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  UPLOADING...
                </div>
              ) : isEditing && project?.videoUrl ? (
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                  <video src={project.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#fff' }}>
                    {project.videoUrl.split('/').pop()}
                  </div>
                  <button type="button" onClick={() => {
                      const pm = project.media.find(m => m.mediaType === 'VIDEO');
                      if (pm) handleDeleteMedia(pm.id);
                    }} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ff4444', color: '#fff', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : pendingVideo ? (
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                  <video src={URL.createObjectURL(pendingVideo)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#fff' }}>
                    {pendingVideo.name}
                  </div>
                  <button type="button" onClick={() => handleRemovePendingMedia('VIDEO')} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ff4444', color: '#fff', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div style={{ aspectRatio: '16/9', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  NO VIDEO UPLOADED
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button type="submit" className="admin-btn-primary" disabled={saving || uploadingPoster || uploadingVideo}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'SAVING...' : 'SAVE PROJECT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
