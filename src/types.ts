import type { Node, Edge } from '@xyflow/react';

export type EntityType = 'service' | 'database' | 'user' | 'cloud' | 'serviceGroup' | 'boundary';

export interface NodeData {
  name: string;
  description?: string;
  githubUrl?: string;
  dashboardUrl?: string;
  docsUrl?: string;
  customFields?: { key: string; value: string }[];
  [key: string]: unknown;
}

export interface EdgeData {
  label?: string;
  metadata?: string;
  [key: string]: unknown;
}

export type DiagramNode = Node<NodeData, EntityType>;
export type DiagramEdge = Edge<EdgeData>;

export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}
