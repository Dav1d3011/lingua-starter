import React from 'react';

export type FeatureId = string;

export interface Feature {
  id: FeatureId;
  label: string;
  route: string;               // e.g., "/games/flashcards"
  icon?: React.ReactNode;
  init?(): Promise<void> | void;
  Page: React.ComponentType;
}

// For future games, you can extend Feature:
export interface GameFeature extends Feature {
  start?(): void;
  submitAnswer?(input: unknown): { correct: boolean; nextDueMs?: number };
}
