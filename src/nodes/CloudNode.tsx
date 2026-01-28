import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';
import { EditableName } from './EditableName';

export function CloudNode({ id, data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-[#1e2030] min-w-[120px] text-center
        ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-[#2e3450]'}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
        <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wide">Cloud</span>
      </div>
      <EditableName nodeId={id} name={data.name} />
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-2 !h-2" />
    </div>
  );
}
