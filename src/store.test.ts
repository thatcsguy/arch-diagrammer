import { describe, it, expect, beforeEach } from 'vitest';
import { useDiagramStore } from './store';

describe('DiagramState store', () => {
  beforeEach(() => {
    useDiagramStore.setState({ nodes: [], edges: [], editMode: false, selectedId: null });
  });

  it('starts with empty state', () => {
    const { nodes, edges } = useDiagramStore.getState();
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it('adds a service node', () => {
    useDiagramStore.getState().addNode('service', { x: 10, y: 20 });
    const { nodes } = useDiagramStore.getState();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].type).toBe('service');
    expect(nodes[0].data.name).toBe('New Service');
    expect(nodes[0].position).toEqual({ x: 10, y: 20 });
  });

  it('adds nodes of each type with correct default name', () => {
    const store = useDiagramStore.getState();
    store.addNode('database', { x: 0, y: 0 });
    store.addNode('user', { x: 0, y: 0 });
    store.addNode('cloud', { x: 0, y: 0 });
    store.addNode('serviceGroup', { x: 0, y: 0 });
    store.addNode('boundary', { x: 0, y: 0 });

    const { nodes } = useDiagramStore.getState();
    expect(nodes.map((n) => n.data.name)).toEqual([
      'New Database', 'New User', 'New Cloud', 'Service Group', 'Boundary',
    ]);
  });

  it('updates node data', () => {
    useDiagramStore.getState().addNode('service', { x: 0, y: 0 });
    const id = useDiagramStore.getState().nodes[0].id;
    useDiagramStore.getState().updateNodeData(id, { name: 'Auth API', description: 'Handles auth' });
    const node = useDiagramStore.getState().nodes[0];
    expect(node.data.name).toBe('Auth API');
    expect(node.data.description).toBe('Handles auth');
  });

  it('removes a node and its connected edges', () => {
    const store = useDiagramStore.getState();
    store.addNode('service', { x: 0, y: 0 });
    store.addNode('database', { x: 100, y: 0 });
    const [n1, n2] = useDiagramStore.getState().nodes;
    store.onConnect({ source: n1.id, target: n2.id, sourceHandle: null, targetHandle: null });

    expect(useDiagramStore.getState().edges).toHaveLength(1);

    useDiagramStore.getState().removeNode(n1.id);
    expect(useDiagramStore.getState().nodes).toHaveLength(1);
    expect(useDiagramStore.getState().edges).toHaveLength(0);
  });

  it('toggles edit mode', () => {
    expect(useDiagramStore.getState().editMode).toBe(false);
    useDiagramStore.getState().setEditMode(true);
    expect(useDiagramStore.getState().editMode).toBe(true);
  });

  it('getSerializableState returns nodes and edges', () => {
    useDiagramStore.getState().addNode('service', { x: 0, y: 0 });
    const state = useDiagramStore.getState().getSerializableState();
    expect(state.nodes).toHaveLength(1);
    expect(state.edges).toHaveLength(0);
  });

  it('loadState replaces current state', () => {
    useDiagramStore.getState().addNode('service', { x: 0, y: 0 });
    useDiagramStore.getState().loadState({
      nodes: [{ id: 'x', type: 'database', position: { x: 5, y: 5 }, data: { name: 'Loaded' } }],
      edges: [],
    });
    const { nodes } = useDiagramStore.getState();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].data.name).toBe('Loaded');
  });

  it('updates edge data', () => {
    const store = useDiagramStore.getState();
    store.addNode('service', { x: 0, y: 0 });
    store.addNode('database', { x: 100, y: 0 });
    const [n1, n2] = useDiagramStore.getState().nodes;
    store.onConnect({ source: n1.id, target: n2.id, sourceHandle: null, targetHandle: null });

    const edgeId = useDiagramStore.getState().edges[0].id;
    useDiagramStore.getState().updateEdgeData(edgeId, { label: 'writes', metadata: 'gRPC' });
    const edge = useDiagramStore.getState().edges[0];
    expect(edge.data?.label).toBe('writes');
    expect(edge.data?.metadata).toBe('gRPC');
  });

  it('removes an edge', () => {
    const store = useDiagramStore.getState();
    store.addNode('service', { x: 0, y: 0 });
    store.addNode('database', { x: 100, y: 0 });
    const [n1, n2] = useDiagramStore.getState().nodes;
    store.onConnect({ source: n1.id, target: n2.id, sourceHandle: null, targetHandle: null });

    const edgeId = useDiagramStore.getState().edges[0].id;
    useDiagramStore.getState().removeEdge(edgeId);
    expect(useDiagramStore.getState().edges).toHaveLength(0);
  });
});
