// Small dependency-free id generator. We don't need uuid's collision
// guarantees for a single-user, client-only app — this is enough to key
// React lists and to reference entries across the reducer.
export function makeId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
