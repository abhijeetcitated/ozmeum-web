import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { usePageMeta } from '../lib/usePageMeta';

export default function NotFound({ message = 'This page doesn’t exist.' }: { message?: string }) {
  usePageMeta('Not found — Ozmeum', true);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo />
      <h1 className="mt-8 font-mono text-[28px] leading-8 text-fg">404</h1>
      <p className="mt-2 text-fg-2">{message}</p>
      <Link to="/" className="btn-primary mt-6">
        Back to homepage
      </Link>
    </div>
  );
}
