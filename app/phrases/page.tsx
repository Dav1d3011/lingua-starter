'use client';
import { featureRegistry } from '@/core/registry';
export default function Page() {
    const Comp = featureRegistry.byId('phrases')!.Page;
    return <Comp />;
}