import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-[#0f1117]">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1">
            <Canvas />
          </div>
          <Sidebar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
