import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Route-level code splitting: /embed/:slug ships only React + the widget,
// none of the marketing site.
const ClaimLayout = lazy(() => import('./components/ClaimLayout'));
const Home = lazy(() => import('./pages/Home'));
const Prospect = lazy(() => import('./pages/Prospect'));
const Embed = lazy(() => import('./pages/Embed'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/embed/:slug" element={<Embed />} />
        <Route element={<ClaimLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/p/:slug" element={<Prospect />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
