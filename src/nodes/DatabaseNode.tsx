import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';
import { EditableName } from './EditableName';

export function DatabaseNode({ id, data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-[#1e2030] min-w-[120px] text-center
        ${selected ? 'border-green-400 shadow-lg shadow-green-500/20' : 'border-[#2e3450]'}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
        <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">Database</span>
      </div>
      <EditableName nodeId={id} name={data.name} />
      <Handle type="target" position={Position.Top} className="!bg-green-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-green-400 !w-2 !h-2" />
    </div>
  );
}
