import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
      <CircleAlert size={48} className="text-text-muted" />
      <h1 className="font-display text-4xl font-black text-text-primary">404</h1>
      <p className="text-text-secondary">No encontramos la página que buscas.</p>
      <Link to="/">
        <Button size="lg">Volver al inicio</Button>
      </Link>
    </div>
  );
}
