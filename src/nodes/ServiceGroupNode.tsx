import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';

export function ServiceGroupNode({ data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 border-dashed bg-[#1e2030] min-w-[120px] text-center
        ${selected ? 'border-orange-400 shadow-lg shadow-orange-500/20' : 'border-[#2e3450]'}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Service Group</span>
      </div>
      <div className="text-sm text-slate-200 font-medium">{data.name}</div>
      <Handle type="target" position={Position.Top} className="!bg-orange-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !w-2 !h-2" />
    </div>
  );
}
