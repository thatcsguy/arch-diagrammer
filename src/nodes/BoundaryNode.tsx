import { type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';
import { EditableName } from './EditableName';

export function BoundaryNode({ id, data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`h-full w-full rounded-xl border-2 border-dashed p-2
        ${selected ? 'border-yellow-400/60' : 'border-[#3e4460]/60'}`}
      style={{ backgroundColor: 'rgba(30, 32, 48, 0.3)' }}
    >
      <div className="flex items-center gap-1.5 text-xs text-yellow-400/80 font-semibold uppercase tracking-wide">
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <EditableName nodeId={id} name={data.name} />
      </div>
    </div>
  );
}
