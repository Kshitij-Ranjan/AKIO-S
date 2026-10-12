import { Link, useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        AKIO&apos;S
      </Link>
      <nav className="navbar__links">
        <a href="/#work" onClick={(e) => handleScroll(e, 'work')} className="navbar__link">Work</a>
        <Link to="/about" className="navbar__link">About</Link>
        <a href="/#services" onClick={(e) => handleScroll(e, 'services')} className="navbar__link">Services</a>
        <Link to="/contact" className="navbar__link">Contact</Link>
      </nav>
      <MobileNav />
    </header>
  );
}
