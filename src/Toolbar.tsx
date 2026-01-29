import { useDiagramStore } from './store';
import type { EntityType } from './types';

const entityButtons: { type: EntityType; label: string }[] = [
  { type: 'service', label: 'Add Service' },
  { type: 'database', label: 'Add Database' },
  { type: 'user', label: 'Add User' },
  { type: 'cloud', label: 'Add Cloud' },
  { type: 'serviceGroup', label: 'Add Service Group' },
  { type: 'boundary', label: 'Add Boundary' },
];

export function Toolbar() {
  const editMode = useDiagramStore((s) => s.editMode);
  const setEditMode = useDiagramStore((s) => s.setEditMode);
  const addNode = useDiagramStore((s) => s.addNode);
  const saveToUrl = useDiagramStore((s) => s.saveToUrl);

  const handleAdd = (type: EntityType) => {
    // eslint-disable-next-line react-hooks/purity -- event handler, not render
    const x = 100 + Math.random() * 400;
    // eslint-disable-next-line react-hooks/purity -- event handler, not render
    const y = 100 + Math.random() * 300;
    addNode(type, { x, y });
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-[#161822] border-b border-[#2e3450]">
      <span className="text-sm font-bold text-slate-300 mr-2">Arch Diagrammer</span>

      {editMode && (
        <>
          {entityButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleAdd(btn.type)}
              className="px-3 py-1.5 text-xs rounded bg-[#252840] text-slate-300 hover:bg-[#2e3450] hover:text-white transition-colors"
            >
              {btn.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => {
              saveToUrl();
              setEditMode(false);
            }}
            className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Save
          </button>
        </>
      )}

      {!editMode && <div className="flex-1" />}

      <button
        onClick={() => setEditMode(!editMode)}
        className={`px-3 py-1.5 text-xs rounded transition-colors ${
          editMode
            ? 'bg-[#252840] text-slate-400 hover:bg-[#2e3450]'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        {editMode ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
}
