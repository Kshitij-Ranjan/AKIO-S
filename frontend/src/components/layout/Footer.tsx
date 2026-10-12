export function Footer() {
  return (
    <footer className="footer">
      <div>&copy; {new Date().getFullYear()} AKIO&apos;S. All rights reserved.</div>
      <div className="footer__links">
        <a href="https://www.instagram.com/thy.akio/" target="_blank" rel="noopener noreferrer" className="footer__link">INSTAGRAM</a>
        <a href="tel:+916207916723" className="footer__link">+91 6207916723</a>
      </div>
    </footer>
  );
}
