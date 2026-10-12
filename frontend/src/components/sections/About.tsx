import { Link } from 'react-router-dom';

export function About() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <Link 
          to="/about" 
          className="about__link-block"
          aria-label="Read more about Akio"
        >
          <h2 className="section__heading about__heading-hoverable">
            About
            <span className="about__arrow">→</span>
          </h2>
          <div className="about__content">
            <p className="about__text">
              I am a cinematic video editor specializing in narrative storytelling, 
              commercials, and music videos. My work focuses on rhythm, emotion, 
              and precision.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
