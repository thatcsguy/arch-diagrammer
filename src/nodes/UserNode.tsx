import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';

export function UserNode({ data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-[#1e2030] min-w-[120px] text-center
        ${selected ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-[#2e3450]'}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-xs text-purple-400 font-semibold uppercase tracking-wide">User</span>
      </div>
      <div className="text-sm text-slate-200 font-medium">{data.name}</div>
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !w-2 !h-2" />
    </div>
  );
}
