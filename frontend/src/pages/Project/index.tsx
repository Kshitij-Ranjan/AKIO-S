import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../hooks/useProject";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export function Project() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, status } = useProject(slug);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (status === "loading") {
    return (
      <div className="container section" style={{ paddingTop: '150px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>LOADING PROJECT...</p>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="container section" style={{ paddingTop: '150px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }}>PROJECT NOT FOUND</p>
        <button onClick={() => navigate('/')} style={{ color: 'white', letterSpacing: '0.1em', fontSize: '0.85rem', borderBottom: '1px solid white', paddingBottom: '0.2rem' }}>
          RETURN HOME
        </button>
      </div>
    );
  }

  return (
    <div className="container section" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '3rem', width: 'fit-content' }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" style={{ marginRight: '0.5rem' }} /> BACK
      </button>

      {/* Project Info */}
      <h1 className="section__heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '2rem', wordBreak: 'break-word', lineHeight: '1.1' }}>
        {data.title}
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
        <div style={{ maxWidth: '800px' }}>
          {data.description && (
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
              {data.description}
            </p>
          )}
          
          {data.role && (
            <div>
              <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>ROLE</h3>
              <p style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>{data.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Protected Video Player */}
      <div style={{ width: '100%', position: 'relative', background: '#050505', aspectRatio: '16/9', overflow: 'hidden' }}>
        {data.videoUrl ? (
          <>
            <video 
              src={data.videoUrl}
              poster={data.posterUrl}
              controls 
              controlsList="nodownload" 
              onContextMenu={(e) => e.preventDefault()} 
              onDragStart={(e) => e.preventDefault()}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
            {/* Subtle Watermark */}
            <div style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              right: '2rem', 
              pointerEvents: 'none', 
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.15)',
              textTransform: 'uppercase',
              mixBlendMode: 'overlay',
              zIndex: 10
            }}>
              AKIO'S // {data.title}
            </div>
          </>
        ) : (
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
             MEDIA UNAVAILABLE
           </div>
        )}
      </div>
      
    </div>
  );
}
