import { type NodeProps } from '@xyflow/react';
import type { DiagramNode } from '../types';

export function BoundaryNode({ data, selected }: NodeProps<DiagramNode>) {
  return (
    <div
      className={`h-full w-full rounded-xl border-2 border-dashed p-2
        ${selected ? 'border-yellow-400/60' : 'border-[#3e4460]/60'}`}
      style={{ backgroundColor: 'rgba(30, 32, 48, 0.3)' }}
    >
      <div className="text-xs text-yellow-400/80 font-semibold uppercase tracking-wide">
        {data.name}
      </div>
    </div>
  );
}
