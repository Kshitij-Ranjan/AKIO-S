import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CursorFX } from '../ui/CursorFX';

export function PublicLayout() {
  return (
    <>
      <CursorFX />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
