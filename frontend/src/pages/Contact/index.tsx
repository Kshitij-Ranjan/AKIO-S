import { useState, FormEvent, useEffect } from 'react';
import { useGSAP, gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Link } from 'react-router-dom';

// @ts-ignore
import bgImage from "../../assets/background_extra.jpeg";

import './contact.css';

export function ContactPage() {
  const prefersReducedMotion = useReducedMotion();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectName: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.fromTo(".contact-page__reveal", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
  }, [prefersReducedMotion]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    
    // Basic client validation
    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your project specifications or brief.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Non-JSON response
      }

      if (!response.ok) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          const firstErr = Object.values(data.fieldErrors)[0] as string;
          throw new Error(firstErr || data.error || 'Please check the highlighted form fields.');
        }
        throw new Error(data?.error || `Unable to send inquiry (Status ${response.status}). Please try again later.`);
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', projectName: '', projectType: '', budget: '', deadline: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="contact-page">
      <div 
        aria-hidden="true" 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
          pointerEvents: "none"
        }}
      />
      
      <div className="container contact-page__container">
        <header className="contact-page__header contact-page__reveal">
          <Link to="/" className="contact-page__back">← Back to Home</Link>
          <h1 className="contact-page__heading">LET'S MAKE SOMETHING MATTER.</h1>
          <p className="contact-page__intro">Tell me a little about the project you're planning.</p>
        </header>

        <div className="contact-page__form-wrapper contact-page__reveal">
          {status === 'success' ? (
            <div className="contact-page__success">
              <h3>Inquiry Sent</h3>
              <p>Thank you for reaching out. I will get back to you shortly.</p>
              <button onClick={() => setStatus('idle')} className="contact-page__btn-reset">Send another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-page__form" noValidate>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    aria-invalid={!!fieldErrors.name}
                  />
                  {fieldErrors.name && <span className="field-error-text" style={{ color: '#e57373', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && <span className="field-error-text" style={{ color: '#e57373', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.email}</span>}
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="projectName">Project Name</label>
                  <input 
                    type="text" 
                    id="projectName" 
                    name="projectName" 
                    value={formData.projectName} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectType">Project Type</label>
                  <select 
                    id="projectType" 
                    name="projectType" 
                    value={formData.projectType} 
                    onChange={handleChange}
                  >
                    <option value="">Select a type...</option>
                    <option value="Music Video">Music Video</option>
                    <option value="Commercial / Advertisement">Commercial / Advertisement</option>
                    <option value="Short Film / Narrative">Short Film / Narrative</option>
                    <option value="YouTube / Creator Content">YouTube / Creator Content</option>
                    <option value="Social Media Content">Social Media Content</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Specifications *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={6} 
                  placeholder="Describe the brief, desired style, deliverables, duration, references, etc."
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  aria-invalid={!!fieldErrors.message}
                />
                {fieldErrors.message && <span className="field-error-text" style={{ color: '#e57373', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.message}</span>}
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="budget">Budget (Optional)</label>
                  <input type="text" id="budget" name="budget" placeholder="e.g. $5,000 - $10,000" value={formData.budget} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="deadline">Deadline (Optional)</label>
                  <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} />
                </div>
              </div>

              {status === 'error' && (
                <div className="contact-page__error" role="alert" style={{ marginBottom: '1.5rem', color: '#ff8a80' }}>
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="contact-page__submit" 
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>

        <div className="contact-page__direct contact-page__reveal">
          <a 
            href="https://www.instagram.com/thy.akio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-page__direct-link"
          >
            INSTAGRAM ↗
          </a>
          <span className="contact-page__direct-separator">·</span>
          <a 
            href="tel:+916207916723"
            className="contact-page__direct-link"
          >
            +91 6207916723
          </a>
        </div>
      </div>
    </div>
  );
}
