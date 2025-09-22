'use client';

import { featureRegistry } from '@/core/registry';
import { PhrasesFeature } from '@/features/phrases';
import { FlashcardsFeature } from '@/features/flashcards';

// Register features (client-side)
featureRegistry.register(PhrasesFeature);
featureRegistry.register(FlashcardsFeature);

export {}; // nothing to export
