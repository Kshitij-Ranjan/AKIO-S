import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectApi } from '../../../api/projects';
import { Project } from '../../../types/admin';
import { GripVertical, Edit, Trash2, ExternalLink } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../../../styles/admin.css';

function SortableItem({ project, onDelete }: { project: Project, onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} className="admin-content-box" style={{ ...style, padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', ...(isDragging ? style : {}) }}>
      <button {...attributes} {...listeners} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'grab', padding: '0 1rem 0 0' }}>
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div style={{ width: '4rem', height: '2.5rem', background: '#222', marginRight: '1rem', flexShrink: 0, overflow: 'hidden' }}>
        {project.posterUrl && (
          <img src={project.posterUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title}</h4>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>{project.category || 'No Category'}</span>
          <span>&middot;</span>
          <span style={{ color: project.published ? '#44ff44' : '#ffaa44' }}>
            {project.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
        <Link to={`/admin/projects/${project.id}/edit`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <Edit className="w-4 h-4" />
        </Link>
        <Link to={`/projects/${project.slug}`} target="_blank" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <ExternalLink className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => onDelete(project.id)}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,68,68,0.7)', cursor: 'pointer', padding: 0 }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex(p => p.id === active.id);
    const newIndex = projects.findIndex(p => p.id === over.id);
    const newProjects = arrayMove(projects, oldIndex, newIndex);
    
    setProjects(newProjects);
    setSavingOrder(true);
    
    try {
      const updates = newProjects.map((p, index) => ({ id: p.id, sortOrder: index + 1 }));
      await projectApi.reorder(updates);
    } catch (err: any) {
      alert('Failed to save order: ' + (err.message || 'Unknown error'));
      loadProjects();
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project permanently? This action cannot be undone.')) return;
    try {
      await projectApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const publishedCount = projects.filter(p => p.published).length;
  const draftCount = projects.length - publishedCount;

  if (loading) return <div className="admin-page-container">LOADING...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">PROJECTS</h1>
        <Link to="/admin/projects/new" className="admin-btn-primary">
          + ADD PROJECT
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-content-box" style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 300 }}>{projects.length}</div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>TOTAL PROJECTS</div>
        </div>
        <div className="admin-content-box" style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 300, color: '#44ff44' }}>{publishedCount}</div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>PUBLISHED</div>
        </div>
        <div className="admin-content-box" style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 300, color: '#ffaa44' }}>{draftCount}</div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>DRAFTS</div>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {savingOrder && (
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: '#44aaff', marginBottom: '1rem' }}>
          SAVING NEW ORDER...
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div>
            {projects.map(project => (
              <SortableItem key={project.id} project={project} onDelete={handleDelete} />
            ))}
            {projects.length === 0 && (
              <div className="admin-content-box" style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
                NO PROJECTS FOUND.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
