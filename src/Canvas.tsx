import { ReactFlow, Background, BackgroundVariant, Controls } from '@xyflow/react';
import { useDiagramStore } from './store';
import { nodeTypes } from './nodes';
import { useCallback, useMemo } from 'react';

export function Canvas() {
  const nodes = useDiagramStore((s) => s.nodes);
  const rawEdges = useDiagramStore((s) => s.edges);
  const edges = useMemo(
    () => rawEdges.map((e) => ({ ...e, label: e.data?.label || undefined })),
    [rawEdges],
  );
  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const editMode = useDiagramStore((s) => s.editMode);
  const setSelectedId = useDiagramStore((s) => s.setSelectedId);

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedId(node.id);
  }, [setSelectedId]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: { id: string }) => {
    setSelectedId(edge.id);
  }, [setSelectedId]);

  const onPaneClick = useCallback(() => {
    setSelectedId(null);
  }, [setSelectedId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      nodesDraggable={editMode}
      nodesConnectable={editMode}
      elementsSelectable={true}
      fitView
      colorMode="dark"
      defaultEdgeOptions={{ animated: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2e3450" />
      <Controls />
    </ReactFlow>
  );
}
