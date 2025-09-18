import React from 'react';
import { useFlowLogic } from './FlowLogic';
import {
  nodeTypes,
  edgeTypes,
  UserInfo,
  NodePalette,
  ExecuteButton,
  BoardName,
  HistoryPanel,
  SignInModal,
  ErrorModal,
  ContextMenu,
  ImportModal,
  TemplatesPanel,
  AutoSaveIndicator,
  RestoreIndicator
} from './FlowComponents';
import { ClockClockwise } from './Icons';
import { preloadReplicatePermissions } from './Preload';

// Main Flow Editor Component - COMPLETE implementation from image.html
const FlowEditor = () => {
  const { ReactFlow, Background } = window.ReactFlow;
  const [contextMenu, setContextMenu] = React.useState(null);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showTemplatesPanel, setShowTemplatesPanel] = React.useState(true);
  
  const logic = useFlowLogic();
  const {
    nodes,
    edges,
    isExecuting,
    boardName,
    history,
    showHistory,
    showSignInModal,
    replicateApiKey,
    tempReplicateKey,
    showImageModelsDropdown,
    showVideoModelsDropdown,
    showLanguageModelsDropdown,
    showVoiceModelsDropdown,
    errors,
    showErrorModal,
    // Subscribe.dev data
    isSignedIn,
    usage,
    user,
    signIn,
    signOut,
    subscribe,
    // State setters
    setNodes,
    setEdges,
    setShowHistory,
    setShowSignInModal,
    setReplicateApiKey,
    setTempReplicateKey,
    setShowImageModelsDropdown,
    setShowVideoModelsDropdown,
    setShowLanguageModelsDropdown,
    setShowVoiceModelsDropdown,
    setShowErrorModal,
    // Methods
    addError,
    clearErrors,
    onConnect,
    deleteEdge,
    addNodeFromMenu,
    addModelNode,
    executeFlow,
    exportFlow,
    importFlow,
    loadTemplate,
    updateBoardName,
    screenToFlowPosition,
    // Restoration functionality
    restoreIndicator,
    handleUndoRestoration,
    handleDismissRestoreIndicator,
    // Auto-save indicator
    isAutoSaving,
    // Saved workflows functions
    getSavedWorkflows,
    loadSavedWorkflow,
    createNewBoard,
    deleteSavedWorkflow,
    // Connection validation
    connectionErrors,
    isDraggingConnection,
    dragSource,
    // Connection handlers
    onConnectStart,
    onConnectEnd,
  } = logic;
  
  // Right-click context menu handler
  const onPaneContextMenu = (event) => {
    event.preventDefault();
    
    // Convert screen coordinates to flow coordinates
    const flowPosition = screenToFlowPosition ? 
      screenToFlowPosition({ x: event.clientX, y: event.clientY }) :
      { x: event.clientX, y: event.clientY };
    
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      flowPosition: flowPosition,
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Left-click handler to close context menu
  const onPaneClick = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  // Create proper change handlers that update our state
  const onNodesChange = (changes) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change) => {
        const nodeIndex = updatedNodes.findIndex(node => node.id === change.id);
        if (nodeIndex !== -1) {
          if (change.type === 'position' && change.position) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: change.position
            };
          } else if (change.type === 'remove') {
            updatedNodes.splice(nodeIndex, 1);
          } else if (change.type === 'select') {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              selected: change.selected
            };
          } else if (change.type === 'dimensions' && change.dimensions) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              ...change.dimensions
            };
          }
        }
      });
      
      // Ensure organization boxes stay in back by raising other nodes
      setTimeout(() => {
        updatedNodes.forEach(node => {
          const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
          if (nodeElement) {
            if (node.type === 'organizationBox') {
              nodeElement.style.zIndex = '1';
            } else {
              nodeElement.style.zIndex = '10';
            }
          }
        });
      }, 0);
      
      return updatedNodes;
    });
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => {
      const updatedEdges = [...eds];
      changes.forEach((change) => {
        const edgeIndex = updatedEdges.findIndex(edge => edge.id === change.id);
        if (edgeIndex !== -1) {
          if (change.type === 'remove') {
            updatedEdges.splice(edgeIndex, 1);
          } else if (change.type === 'select') {
            updatedEdges[edgeIndex] = {
              ...updatedEdges[edgeIndex],
              selected: change.selected
            };
          }
        }
      });
      return updatedEdges;
    });
  };

  return (
    <div className="w-full h-screen relative">
      {/* Top Right Controls - User Info and Share Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <UserInfo 
          isSignedIn={isSignedIn}
          user={user}
          usage={usage}
          signOut={signOut}
          subscribe={subscribe}
          replicateApiKey={replicateApiKey}
          setReplicateApiKey={setReplicateApiKey}
          setTempReplicateKey={setTempReplicateKey}
          signIn={signIn}
          setShowSignInModal={setShowSignInModal}
        />
        <button
          onClick={exportFlow}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-normal transition-colors shadow-md"
        >
          Share
        </button>
      </div>

      {/* Board Name - Top Left */}
      <BoardName 
        boardName={boardName} 
        onBoardNameChange={updateBoardName}
        exportFlow={exportFlow}
        onImportFlow={() => setShowImportModal(true)}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        history={history}
        getSavedWorkflows={getSavedWorkflows}
        loadSavedWorkflow={loadSavedWorkflow}
        createNewBoard={createNewBoard}
        deleteSavedWorkflow={deleteSavedWorkflow}
      />

      {/* Flow Canvas - Full Screen */}
      <div className="w-full h-full">
        <style dangerouslySetInnerHTML={{
          __html: `
            .react-flow__node-organizationBox {
              z-index: 1;
            }
          `
        }} />
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              edges,
              onDeleteEdge: deleteEdge,
              connectionErrors,
              isDraggingConnection,
              dragSource,
              // Pass style through data for organization boxes
              ...(node.type === 'organizationBox' && { nodeStyle: node.style }),
            }
          }))}
          edges={edges.map(edge => {
            const targetNode = nodes.find(node => node.id === edge.target);
            const isTargetExecuting = targetNode?.data?.status === 'generating';
            
            return {
              ...edge,
              style: isTargetExecuting 
                ? { stroke: '#3b82f6', strokeWidth: 2 }  // Blue when executing
                : { stroke: '#4b5563', strokeWidth: 2 }, // Gray when idle
              animated: isTargetExecuting,
              data: { 
                ...edge.data, 
                targetNodeExecuting: isTargetExecuting 
              }
            };
          })}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.1}
          maxZoom={2}
          className="bg-gray-900"
          connectionLineStyle={{ stroke: '#4b5563', strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: 'custom',
            style: { stroke: '#4b5563', strokeWidth: 2 },
            animated: false,
            deletable: true,
            data: { onDelete: deleteEdge },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#374151" gap={20} />
        </ReactFlow>
      </div>

      {/* History Panel */}
      <HistoryPanel
        history={history}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />

      {/* Sign In Modal */}
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
        signIn={signIn}
        replicateApiKey={replicateApiKey}
        setReplicateApiKey={setReplicateApiKey}
        tempReplicateKey={tempReplicateKey}
        setTempReplicateKey={setTempReplicateKey}
        preloadReplicatePermissions={preloadReplicatePermissions}
      />

      {/* Bottom Node Palette */}
      <NodePalette
        addNodeFromMenu={addNodeFromMenu}
        addModelNode={addModelNode}
        showImageModelsDropdown={showImageModelsDropdown}
        setShowImageModelsDropdown={setShowImageModelsDropdown}
        showVideoModelsDropdown={showVideoModelsDropdown}
        setShowVideoModelsDropdown={setShowVideoModelsDropdown}
        showLanguageModelsDropdown={showLanguageModelsDropdown}
        setShowLanguageModelsDropdown={setShowLanguageModelsDropdown}
        showVoiceModelsDropdown={showVoiceModelsDropdown}
        setShowVoiceModelsDropdown={setShowVoiceModelsDropdown}
      />

      {/* Separate Execute Button */}
      <ExecuteButton
        executeFlow={executeFlow}
        isExecuting={isExecuting}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errors={errors}
        clearErrors={clearErrors}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          flowPosition={contextMenu.flowPosition}
          onClose={closeContextMenu}
          addNodeFromMenu={addNodeFromMenu}
          addModelNode={addModelNode}
        />
      )}

      {/* Import Modal */}
      <ImportModal
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        onImportFlow={importFlow}
      />

      {/* Templates Panel */}
      <TemplatesPanel
        showTemplatesPanel={showTemplatesPanel}
        setShowTemplatesPanel={setShowTemplatesPanel}
        onLoadTemplate={loadTemplate}
      />

      {/* Auto Save Indicator */}
      <AutoSaveIndicator isAutoSaving={isAutoSaving} />

      {/* Restore Indicator */}
      <RestoreIndicator 
        restoreIndicator={restoreIndicator}
        onUndo={handleUndoRestoration}
        onDismiss={handleDismissRestoreIndicator}
      />

    </div>
  );
};

export default FlowEditor;