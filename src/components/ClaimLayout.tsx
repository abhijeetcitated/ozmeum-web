import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ClaimProvider } from './claim/ClaimContext';

/** Wraps marketing + prospect routes (never /embed) with the claim modal. */
export default function ClaimLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ClaimProvider>
      <Outlet />
    </ClaimProvider>
  );
}
