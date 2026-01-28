import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { DiagramState } from './types';

export function serialize(state: DiagramState): string {
  const json = JSON.stringify(state);
  return compressToEncodedURIComponent(json);
}

export function deserialize(compressed: string): DiagramState | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const parsed = JSON.parse(json) as DiagramState;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return parsed;
  } catch {
    return null;
  }
}
