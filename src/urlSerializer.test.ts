import { describe, it, expect } from 'vitest';
import { serialize, deserialize } from './urlSerializer';
import type { DiagramState } from './types';

describe('urlSerializer', () => {
  it('round-trips an empty diagram', () => {
    const state: DiagramState = { nodes: [], edges: [] };
    const result = deserialize(serialize(state));
    expect(result).toEqual(state);
  });

  it('round-trips a diagram with nodes and edges', () => {
    const state: DiagramState = {
      nodes: [
        { id: 'n1', type: 'service', position: { x: 100, y: 200 }, data: { name: 'API' } },
        { id: 'n2', type: 'database', position: { x: 300, y: 400 }, data: { name: 'DB' } },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', data: { label: 'reads', metadata: 'SQL' } },
      ],
    };
    const compressed = serialize(state);
    const result = deserialize(compressed);
    expect(result).toEqual(state);
  });

  it('returns null for malformed input', () => {
    expect(deserialize('')).toBeNull();
    expect(deserialize('garbage-data!!!')).toBeNull();
  });

  it('returns null for valid JSON that is not a diagram', () => {
    const { compressToEncodedURIComponent } = require('lz-string');
    const compressed = compressToEncodedURIComponent(JSON.stringify({ foo: 'bar' }));
    expect(deserialize(compressed)).toBeNull();
  });

  it('produces URL-safe output', () => {
    const state: DiagramState = {
      nodes: [{ id: 'n1', type: 'service', position: { x: 0, y: 0 }, data: { name: 'Test <>&"' } }],
      edges: [],
    };
    const compressed = serialize(state);
    // lz-string's compressToEncodedURIComponent produces only URI-safe chars
    expect(compressed).toMatch(/^[A-Za-z0-9+/=-]*$/);
  });
});
