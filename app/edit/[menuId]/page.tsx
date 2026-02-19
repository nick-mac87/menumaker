'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditRedirect() {
  const params = useParams<{ menuId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/' + params.menuId);
  }, [params.menuId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
    </div>
  );
}
