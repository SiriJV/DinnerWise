import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
