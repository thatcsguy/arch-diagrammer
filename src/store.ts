import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from '@xyflow/react';
import type { DiagramNode, DiagramEdge, EntityType, NodeData, DiagramState } from './types';
import { deserialize, serialize } from './urlSerializer';

interface Store {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  editMode: boolean;
  selectedId: string | null;

  onNodesChange: OnNodesChange<DiagramNode>;
  onEdgesChange: OnEdgesChange<DiagramEdge>;
  onConnect: OnConnect;

  setEditMode: (edit: boolean) => void;
  setSelectedId: (id: string | null) => void;
  addNode: (type: EntityType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  updateEdgeData: (id: string, data: Partial<{ label: string; metadata: string }>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  reparentNode: (nodeId: string, boundaryId: string | null) => void;

  getSerializableState: () => DiagramState;
  loadState: (state: DiagramState) => void;
  saveToUrl: () => void;
}

let nextId = 1;
function generateId() {
  return `node-${nextId++}`;
}

function loadInitialState(): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  if (hash) {
    const state = deserialize(hash);
    if (state) return state;
  }
  return { nodes: [], edges: [] };
}

const initial = loadInitialState();

export const useDiagramStore = create<Store>((set, get) => ({
  nodes: initial.nodes,
  edges: initial.edges,
  editMode: false,
  selectedId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection: Connection) => {
    const id = `edge-${connection.source}-${connection.target}`;
    const newEdge: DiagramEdge = {
      id,
      source: connection.source,
      target: connection.target,
      data: { label: '', metadata: '' },
    };
    set({ edges: [...get().edges, newEdge] });
  },

  setEditMode: (edit) => set({ editMode: edit }),
  setSelectedId: (id) => set({ selectedId: id }),

  addNode: (type, position) => {
    const id = generateId();
    const defaults: Record<EntityType, string> = {
      service: 'New Service',
      database: 'New Database',
      user: 'New User',
      cloud: 'New Cloud',
      serviceGroup: 'Service Group',
      boundary: 'Boundary',
    };
    const node: DiagramNode = {
      id,
      type,
      position,
      data: { name: defaults[type] },
      ...(type === 'boundary' ? { style: { width: 300, height: 200 } } : {}),
    };
    // Insert boundaries at the front so they appear before potential children
    // (React Flow requires parents before children in the array)
    const nodes = get().nodes;
    set({ nodes: type === 'boundary' ? [node, ...nodes] : [...nodes, node] });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
  },

  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...data } } : e
      ),
    });
  },

  removeNode: (id) => {
    const nodes = get().nodes;
    const removedNode = nodes.find((n) => n.id === id);
    set({
      nodes: nodes
        .filter((n) => n.id !== id)
        .map((n) =>
          n.parentId === id
            ? {
                ...n,
                parentId: undefined,
                position: {
                  x: n.position.x + (removedNode?.position.x ?? 0),
                  y: n.position.y + (removedNode?.position.y ?? 0),
                },
              }
            : n
        ),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    });
  },

  removeEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
  },

  reparentNode: (nodeId, boundaryId) => {
    const nodes = get().nodes;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const oldParent = node.parentId
      ? nodes.find((n) => n.id === node.parentId)
      : null;
    const newParent = boundaryId
      ? nodes.find((n) => n.id === boundaryId)
      : null;

    // Convert position: child positions in React Flow are relative to parent
    const absX = node.position.x + (oldParent?.position.x ?? 0);
    const absY = node.position.y + (oldParent?.position.y ?? 0);

    const newPosition = newParent
      ? { x: absX - newParent.position.x, y: absY - newParent.position.y }
      : { x: absX, y: absY };

    // Update the node with new position and parentId
    let updatedNodes = nodes.map((n) =>
      n.id === nodeId
        ? { ...n, position: newPosition, parentId: boundaryId ?? undefined }
        : n
    );

    // React Flow requires parent nodes to appear BEFORE children in the array.
    // Reorder so boundary nodes come first, then their children.
    updatedNodes = updatedNodes.sort((a, b) => {
      // Boundaries (potential parents) come first
      if (a.type === 'boundary' && b.type !== 'boundary') return -1;
      if (a.type !== 'boundary' && b.type === 'boundary') return 1;
      // Among non-boundaries, nodes without parents come before nodes with parents
      if (!a.parentId && b.parentId) return -1;
      if (a.parentId && !b.parentId) return 1;
      return 0;
    });

    set({ nodes: updatedNodes });
  },

  getSerializableState: () => ({
    nodes: get().nodes,
    edges: get().edges,
  }),

  loadState: (state) => {
    set({ nodes: state.nodes, edges: state.edges });
  },

  saveToUrl: () => {
    const state = get().getSerializableState();
    const hash = serialize(state);
    window.location.hash = hash;
  },
}));
