'use client';
import { GameFeature } from '@/core/feature';
import { useEffect, useState } from 'react';

type Card = { id: string; front: string; back: string };

function FlashcardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    fetch('/api/flashcards/today').then(r=>r.json()).then(setCards);
  }, []);

  if (!cards.length) return <div className="p-6">No cards due today 🎉</div>;
  const c = cards[i];

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
      <div className="p-8 rounded-2xl shadow border text-center">
        <div className="text-xl min-h-20">{showBack ? c.back : c.front}</div>
        <div className="mt-4 flex gap-2 justify-center">
          {!showBack && (
            <button className="px-3 py-2 rounded-xl border" onClick={()=>setShowBack(true)}>Show</button>
          )}
          {showBack && (
            <>
              <button className="px-3 py-2 rounded-xl border" onClick={()=>{ setShowBack(false); setI((i+1)%cards.length); }}>Hard</button>
              <button className="px-3 py-2 rounded-xl border" onClick={()=>{ setShowBack(false); setI((i+1)%cards.length); }}>Easy</button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export const FlashcardsFeature: GameFeature = {
  id: 'flashcards',
  label: 'Flashcards',
  route: '/games/flashcards',
  Page: FlashcardsPage,
};
