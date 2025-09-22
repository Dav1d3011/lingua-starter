'use client';
import '@/features/register.client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { featureRegistry } from '@/core/registry';

export default function Sidebar() {
  const [items, setItems] = useState(() => featureRegistry.all());
  useEffect(() => { setItems(featureRegistry.all()); }, []);
  return (
    <aside className="p-4 border-r min-h-screen">
      <div className="font-bold text-lg mb-4">Lingua</div>
      <nav className="space-y-2">
        {items.map(f => (
          <Link key={f.id} href={f.route} className="block hover:underline">
            {f.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
