import { ReactFlow, Background, BackgroundVariant, Controls, type Node } from '@xyflow/react';
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
  const reparentNode = useDiagramStore((s) => s.reparentNode);

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, draggedNode: Node) => {
      if (draggedNode.type === 'boundary') return;

      // Compute absolute position of dragged node
      const parent = draggedNode.parentId
        ? nodes.find((n) => n.id === draggedNode.parentId)
        : null;
      const absX = draggedNode.position.x + (parent?.position.x ?? 0);
      const absY = draggedNode.position.y + (parent?.position.y ?? 0);

      // Find boundary nodes the dragged node overlaps with (excluding current parent)
      const overlapping = nodes.find(
        (n) =>
          n.type === 'boundary' &&
          n.id !== draggedNode.id &&
          n.id !== draggedNode.parentId &&
          n.style &&
          absX >= n.position.x &&
          absY >= n.position.y &&
          absX <= n.position.x + (n.style.width as number) &&
          absY <= n.position.y + (n.style.height as number)
      );

      if (overlapping) {
        // Reparent into the boundary
        reparentNode(draggedNode.id, overlapping.id);
      } else if (draggedNode.parentId) {
        // Dragged outside current parent — check if still inside
        const currentParent = nodes.find((n) => n.id === draggedNode.parentId);
        if (
          currentParent?.style &&
          (absX < currentParent.position.x ||
            absY < currentParent.position.y ||
            absX > currentParent.position.x + (currentParent.style.width as number) ||
            absY > currentParent.position.y + (currentParent.style.height as number))
        ) {
          reparentNode(draggedNode.id, null);
        }
      }
    },
    [nodes, reparentNode]
  );

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
      onNodeDragStop={onNodeDragStop}
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
