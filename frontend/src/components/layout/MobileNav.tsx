import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mobile-nav__toggle"
      >
        Menu
      </button>

      <div className={`mobile-nav__overlay ${isOpen ? "mobile-nav__overlay--open" : "mobile-nav__overlay--closed"}`}>
        <button 
          onClick={() => setIsOpen(false)}
          className="mobile-nav__close"
        >
          Close
        </button>
        
        <nav className="mobile-nav__menu">
          <a href="/#work" onClick={(e) => handleScroll(e, 'work')} className="navbar__link">Work</a>
          <Link to="/about" onClick={() => setIsOpen(false)} className="navbar__link">About</Link>
          <a href="/#services" onClick={(e) => handleScroll(e, 'services')} className="navbar__link">Services</a>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="navbar__link">Contact</Link>
        </nav>
      </div>
    </>
  );
}
