import { useState, useRef, useEffect, useCallback } from 'react';
import { useDiagramStore } from '../store';

export function EditableName({ nodeId, name }: { nodeId: string; name: string }) {
  const editMode = useDiagramStore((s) => s.editMode);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(name);
  }, [name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) {
      updateNodeData(nodeId, { name: trimmed });
    } else {
      setValue(name);
    }
  }, [value, name, nodeId, updateNodeData]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setValue(name);
            setEditing(false);
          }
        }}
        className="bg-transparent border border-[#2e3450] rounded px-1 text-sm text-slate-200 font-medium text-center w-full outline-none focus:border-slate-400"
      />
    );
  }

  return (
    <div
      className="text-sm text-slate-200 font-medium"
      onDoubleClick={() => {
        if (editMode) setEditing(true);
      }}
    >
      {name}
    </div>
  );
}
