'use client';
import { featureRegistry } from '@/core/registry';
export default function Page() {
    const Comp = featureRegistry.byId('flashcards')!.Page;
    return <Comp />;
}
