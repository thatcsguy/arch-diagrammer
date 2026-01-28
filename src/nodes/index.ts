import type { NodeTypes } from '@xyflow/react';
import { ServiceNode } from './ServiceNode';
import { DatabaseNode } from './DatabaseNode';
import { UserNode } from './UserNode';
import { CloudNode } from './CloudNode';
import { ServiceGroupNode } from './ServiceGroupNode';
import { BoundaryNode } from './BoundaryNode';

export const nodeTypes: NodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
  user: UserNode,
  cloud: CloudNode,
  serviceGroup: ServiceGroupNode,
  boundary: BoundaryNode,
};
