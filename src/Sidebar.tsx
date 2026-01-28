import { useDiagramStore } from './store';

export function Sidebar() {
  const selectedId = useDiagramStore((s) => s.selectedId);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const editMode = useDiagramStore((s) => s.editMode);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const updateEdgeData = useDiagramStore((s) => s.updateEdgeData);
  const removeNode = useDiagramStore((s) => s.removeNode);
  const removeEdge = useDiagramStore((s) => s.removeEdge);
  const setSelectedId = useDiagramStore((s) => s.setSelectedId);

  if (!selectedId) return null;

  const node = nodes.find((n) => n.id === selectedId);
  const edge = edges.find((e) => e.id === selectedId);

  if (!node && !edge) return null;

  const close = () => setSelectedId(null);

  if (node) {
    const d = node.data;
    return (
      <div className="w-72 bg-[#161822] border-l border-[#2e3450] p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase tracking-wide">{node.type}</span>
          <button onClick={close} className="text-slate-500 hover:text-slate-300 text-sm">
            &times;
          </button>
        </div>

        <Field label="Name" value={d.name} editable={editMode}
          onChange={(v) => updateNodeData(node.id, { name: v })} />
        <Field label="Description" value={d.description ?? ''} editable={editMode}
          onChange={(v) => updateNodeData(node.id, { description: v })} multiline />
        <Field label="GitHub URL" value={d.githubUrl ?? ''} editable={editMode}
          onChange={(v) => updateNodeData(node.id, { githubUrl: v })} link />
        <Field label="Dashboard URL" value={d.dashboardUrl ?? ''} editable={editMode}
          onChange={(v) => updateNodeData(node.id, { dashboardUrl: v })} link />
        <Field label="Docs URL" value={d.docsUrl ?? ''} editable={editMode}
          onChange={(v) => updateNodeData(node.id, { docsUrl: v })} link />

        {d.customFields?.map((cf, i) => (
          <Field key={i} label={cf.key} value={cf.value} editable={editMode}
            onChange={(v) => {
              const fields = [...(d.customFields ?? [])];
              fields[i] = { ...fields[i], value: v };
              updateNodeData(node.id, { customFields: fields });
            }} />
        ))}

        {editMode && (
          <>
            <button
              onClick={() => {
                const fields = [...(d.customFields ?? []), { key: 'New Field', value: '' }];
                updateNodeData(node.id, { customFields: fields });
              }}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              + Add field
            </button>
            <button
              onClick={() => { removeNode(node.id); close(); }}
              className="text-xs text-red-400 hover:text-red-300 mt-2"
            >
              Delete node
            </button>
          </>
        )}
      </div>
    );
  }

  if (edge) {
    const d = edge.data;
    return (
      <div className="w-72 bg-[#161822] border-l border-[#2e3450] p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase tracking-wide">Connection</span>
          <button onClick={close} className="text-slate-500 hover:text-slate-300 text-sm">
            &times;
          </button>
        </div>

        <Field label="Label" value={d?.label ?? ''} editable={editMode}
          onChange={(v) => updateEdgeData(edge.id, { label: v })} />
        <Field label="Metadata" value={d?.metadata ?? ''} editable={editMode}
          onChange={(v) => updateEdgeData(edge.id, { metadata: v })} multiline />

        {editMode && (
          <button
            onClick={() => { removeEdge(edge.id); close(); }}
            className="text-xs text-red-400 hover:text-red-300 mt-2"
          >
            Delete connection
          </button>
        )}
      </div>
    );
  }

  return null;
}

function Field({ label, value, editable, onChange, multiline, link }: {
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
  multiline?: boolean;
  link?: boolean;
}) {
  if (editable) {
    return (
      <div>
        <label className="text-xs text-slate-400 block mb-1">{label}</label>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0f1117] border border-[#2e3450] rounded px-2 py-1 text-sm text-slate-200 resize-y"
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0f1117] border border-[#2e3450] rounded px-2 py-1 text-sm text-slate-200"
          />
        )}
      </div>
    );
  }

  if (!value) return null;

  return (
    <div>
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      {link && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">
          {value}
        </a>
      ) : (
        <div className="text-sm text-slate-200 whitespace-pre-wrap">{value}</div>
      )}
    </div>
  );
}
