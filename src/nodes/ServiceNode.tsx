import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';

export function ServiceNode({ data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-[#1e2030] min-w-[120px] text-center
        ${selected ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-[#2e3450]'}`}
    >
      <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Service</div>
      <div className="text-sm text-slate-200 font-medium">{data.name}</div>
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !w-2 !h-2" />
    </div>
  );
}
