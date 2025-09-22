import type { Feature, FeatureId } from './feature';

class FeatureRegistry {
    private features = new Map<FeatureId, Feature>();

    register<F extends Feature>(feature: F): F {
        // If already registered (e.g. after Fast Refresh), just return existing
        const existing = this.features.get(feature.id);
        if (existing) return existing as F;

        this.features.set(feature.id, feature);
        feature.init?.();
        return feature;
    }

    all(): Feature[] {
        return [...this.features.values()].sort((a, b) => a.label.localeCompare(b.label));
    }

    byId(id: FeatureId): Feature | undefined {
        return this.features.get(id);
    }
}

// Ensure a single registry instance across hot reloads
const g = globalThis as any;
export const featureRegistry: FeatureRegistry =
    g.__featureRegistry__ ?? (g.__featureRegistry__ = new FeatureRegistry());
