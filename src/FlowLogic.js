import { useState, useCallback, useEffect, useRef } from 'react';
import { preloadReplicatePermissions, preloadSubscribeDevPermissions } from './Preload';
import { MODELS_CONFIG } from './ModelConfig';

// Business logic and state management for the Flow Editor
export const useFlowLogic = () => {
  const { useSubscribeDev } = window.SubscribeDevReact;
  const { addEdge, useReactFlow } = window.ReactFlow;
  
  const subscribeDevData = useSubscribeDev();
  const { client, isSignedIn, usage, user, signIn, signOut, subscribe } = subscribeDevData;
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [outputs, setOutputs] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [replicateApiKey, setReplicateApiKey] = useState('');
  const [tempReplicateKey, setTempReplicateKey] = useState('');
  const [showImageModelsDropdown, setShowImageModelsDropdown] = useState(false);
  const [showVideoModelsDropdown, setShowVideoModelsDropdown] = useState(false);
  const [showLanguageModelsDropdown, setShowLanguageModelsDropdown] = useState(false);
  const [showVoiceModelsDropdown, setShowVoiceModelsDropdown] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { screenToFlowPosition, fitView, getViewport, setViewport } = useReactFlow();
  // Generate random 6-character ID
  const generateId = () => Math.random().toString(36).substring(2, 8);

  // Helper function to create exportable flow data (used by both export and auto-save)
  const createExportData = (includeViewport = false) => {
    const data = {
      name: boardName || 'Untitled Flow',
      nodes: nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          // Remove callback functions before export/save
          onPromptChange: undefined,
          onModelChange: undefined,
          onSizeChange: undefined,
          onAspectRatioChange: undefined,
          onVoiceIdChange: undefined,
          onSystemPromptChange: undefined,
          onLabelChange: undefined,
          onDescriptionChange: undefined,
          onStrengthChange: undefined,
          onImageUpload: undefined,
          onInputTypeChange: undefined,
          onOutputCountChange: undefined,
          onNameChange: undefined,
          onDelete: undefined,
          onColorChange: undefined,
          edges: undefined,
          onDeleteEdge: undefined,
        }
      })),
      edges: edges.map(edge => ({
        ...edge,
        data: {
          ...edge.data,
          onDelete: undefined, // Remove callback functions
        }
      }))
    };

    if (includeViewport) {
      data.viewport = getViewport ? getViewport() : { x: 0, y: 0, zoom: 1 };
      data.boardName = boardName || 'Untitled Flow'; // Auto-save specific
    }

    return data;
  };

  // Auto-save functionality
  const saveToLocalStorage = useCallback((workflowName, workflowData) => {
    try {
      const key = `flow_${workflowName || 'Untitled Flow'}`;
      const dataToSave = {
        ...workflowData,
        lastSaved: new Date().toISOString(),
        version: '1.4.4'
      };
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log(`✅ Auto-saved workflow: ${workflowName || 'Untitled Flow'}`);
      
      // Reset auto-save indicator after save
      setTimeout(() => {
        setIsAutoSaving(false);
      }, 500);
    } catch (error) {
      console.warn('Failed to save workflow to localStorage:', error);
      setIsAutoSaving(false);
    }
  }, []);

  // Restoration state
  const [restorationCheckComplete, setRestorationCheckComplete] = useState(false);
  const [restoreIndicator, setRestoreIndicator] = useState(null); // { restored: boolean, workflowName: string, restoreTime: string, originalState: object }
  const [originalStateBeforeRestore, setOriginalStateBeforeRestore] = useState(null);
  const [justRestored, setJustRestored] = useState(false); // Flag to track if we just restored

  // Auto-save indicator state
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [connectionErrors, setConnectionErrors] = useState({});
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [dragSource, setDragSource] = useState(null);

  // Check for saved workflows on component mount - RUNS ONLY ONCE
  useEffect(() => {
    console.log('🚀 Initial restoration check on component mount...');
    
    try {
      // Get all localStorage keys that start with 'flow_'
      const flowKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('flow_')) {
          flowKeys.push(key);
        }
      }
      
      console.log('📦 Found saved workflow keys:', flowKeys);
      
      if (flowKeys.length > 0) {
        // Find the most recently saved workflow
        let mostRecentKey = flowKeys[0];
        let mostRecentTime = 0;
        let mostRecentData = null;
        
        for (const key of flowKeys) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              const saveTime = new Date(parsed.lastSaved).getTime();
              if (saveTime > mostRecentTime) {
                mostRecentTime = saveTime;
                mostRecentKey = key;
                mostRecentData = parsed;
              }
            }
          } catch (e) {
            console.warn('Failed to parse saved workflow:', key, e);
            continue;
          }
        }
        
        if (mostRecentData && mostRecentData.nodes && mostRecentData.nodes.length > 0) {
          console.log('⚡ AUTO-RESTORING saved workflow:', mostRecentKey);
          console.log('📊 Workflow data:', {
            name: mostRecentData.name || mostRecentData.boardName,
            nodes: mostRecentData.nodes?.length || 0,
            edges: mostRecentData.edges?.length || 0,
            lastSaved: mostRecentData.lastSaved
          });
          
          // Store the original state before restoring
          const originalState = {
            nodes: nodes,
            edges: edges,
            boardName: boardName
          };
          setOriginalStateBeforeRestore(originalState);
          
          // Automatically restore the saved workflow
          handleRestoreWorkflow(mostRecentData);
          
          // Set up the restore indicator
          setRestoreIndicator({
            restored: true,
            workflowName: mostRecentData.name || mostRecentData.boardName || 'Untitled Flow',
            restoreTime: mostRecentData.lastSaved
          });
          
          // Set flag to indicate we just restored
          setJustRestored(true);
        } else {
          console.log('🔍 No valid saved workflow data found');
        }
      } else {
        console.log('🔍 No saved workflows found in localStorage');
      }
    } catch (error) {
      console.warn('❌ Error during restoration check:', error);
    } finally {
      setRestorationCheckComplete(true);
    }
  }, []); // Empty dependency array - runs ONLY ONCE

  // Auto-save whenever nodes, edges, or board name changes
  useEffect(() => {
    // Don't save if restoration check is not complete yet
    if (!restorationCheckComplete) {
      console.log('🛡️ Auto-save blocked: restoration check not complete');
      return;
    }
    
    // Don't save if we just restored and the indicator is still showing
    if (restoreIndicator?.restored) {
      console.log('🛡️ Auto-save blocked: restore indicator still showing');
      return;
    }
    
    // Don't save if we're still initializing (no nodes/edges/boardName set yet)
    if (!boardName && nodes.length === 0 && edges.length === 0) {
      return;
    }
    
    // Debounce the save operation to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true);
      
      // Use shared export data creation (includes viewport and boardName for auto-save)
      const workflowData = createExportData(true);
      
      saveToLocalStorage(boardName || 'Untitled Flow', workflowData);
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, boardName, restorationCheckComplete, restoreIndicator, saveToLocalStorage]);

  // Watch for changes after restoration to auto-dismiss indicator
  useEffect(() => {
    if (restoreIndicator?.restored && justRestored) {
      // Clear the "just restored" flag first so this effect won't run again
      setJustRestored(false);
      
      // Set up a short delay, then start watching for user changes
      const timer = setTimeout(() => {
        // This will be handled by the next useEffect that watches for actual changes
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [restoreIndicator, justRestored]);

  // Watch for user changes after the initial restoration is complete
  useEffect(() => {
    if (restoreIndicator?.restored && !justRestored) {
      // User has made changes after restoration, dismiss the indicator
      console.log('🔄 User made changes after restoration - dismissing indicator');
      setRestoreIndicator(null);
      setOriginalStateBeforeRestore(null);
    }
  }, [nodes, edges, boardName, restoreIndicator, justRestored]);

  // Auto-dismiss restore indicator after 10 seconds
  useEffect(() => {
    if (restoreIndicator?.restored) {
      const timeout = setTimeout(() => {
        console.log('⏰ Auto-dismissing restore indicator after 10 seconds');
        setRestoreIndicator(null);
        setOriginalStateBeforeRestore(null);
        setJustRestored(false);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [restoreIndicator]);

  // Error handling functions
  const addError = (error) => {
    const errorType = getErrorType(error);
    
    // Create user-friendly error messages
    let userMessage = error.message;
    if (errorType === 'balance') {
      userMessage = 'Insufficient credits to run this model. Please check your account balance or add more credits.';
    } else if (errorType === 'auth') {
      userMessage = 'Authentication failed. Please check your API key or sign in again.';
    } else if (errorType === 'network') {
      userMessage = 'Network connection failed. Please check your internet connection and try again.';
    }
    
    const newError = {
      id: Date.now() + Math.random(),
      message: userMessage,
      type: errorType,
      timestamp: new Date().toISOString(),
      nodeId: error.nodeId || null,
      originalError: error.message // Keep original error for debugging
    };
    setErrors(prev => [newError, ...prev.slice(0, 9)]); // Keep last 10 errors
    setShowErrorModal(true);
  };

  const getErrorType = (error) => {
    const message = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    
    // Check for insufficient credits/balance errors
    if (message.includes('insufficient') && (message.includes('credits') || message.includes('balance')) ||
        errorName.includes('insufficientbalance')) {
      return 'balance';
    }
    
    // Check for authentication/API key errors
    if (message.includes('api key') || message.includes('unauthorized') || 
        message.includes('authentication') || message.includes('forbidden') ||
        errorName.includes('auth')) {
      return 'auth';
    }
    
    // Check for network/connection errors
    if (message.includes('network') || message.includes('fetch') || 
        message.includes('connection') || message.includes('timeout') ||
        errorName.includes('network')) {
      return 'network';
    }
    
    // Default to API error for other issues
    return 'api';
  };

  const clearErrors = () => {
    setErrors([]);
    setShowErrorModal(false);
  };

  const removeError = (errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
    if (errors.length <= 1) {
      setShowErrorModal(false);
    }
  };

  // Initial permission request on component load
  useEffect(() => {
    const requestInitialPermission = async () => {
      try {
        const proxyUrl = window.REPLICATE_PROXY_URL || 'https://replicate.subscribe.dev';
        await fetch(`${proxyUrl}/api/replicate`, {
          method: 'GET'
        });
        console.log('✅ Proxy endpoint accessible - permissions granted');
      } catch (error) {
        console.log('⚠️ Proxy endpoint not accessible:', error.message);
        // This is expected if the user hasn't granted permissions yet
      }
    };

    requestInitialPermission();
  }, []); // Run once on mount

  // Initialize with window.FLOW data if available
  useEffect(() => {
    if (window.FLOW?.nodes && window.FLOW.nodes.length > 0) {
      // Set board name if available
      if (window.FLOW.name) {
        setBoardName(window.FLOW.name);
      }
      const initialNodes = window.FLOW.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onPromptChange: updatePrompt,
          onModelChange: updateModel,
          onSizeChange: updateSize,
          onAspectRatioChange: updateAspectRatio,
          onVoiceIdChange: updateVoiceId,
          onSyncModeChange: updateSyncMode,
          onSystemPromptChange: updateSystemPrompt,
          onLabelChange: updateLabel,
          onDescriptionChange: updateDescription,
          onStrengthChange: updateStrength,
          onImageUpload: updateImageUpload,
          onInputTypeChange: updateInputType,
          onOutputCountChange: updateOutputCount,
          onNameChange: updateNodeName,
          onDelete: deleteNode,
          onColorChange: changeNodeColor,
          edges: [],
          onDeleteEdge: deleteEdge,
        }
      }));
      
      setNodes(initialNodes);
      
    }
    
    if (window.FLOW?.edges && window.FLOW.edges.length > 0) {
      setEdges(window.FLOW.edges.map(edge => ({
        ...edge,
        type: 'custom',
        style: { stroke: '#4b5563', strokeWidth: 2 },
        animated: false,
        data: { onDelete: deleteEdge },
      })));
    }
  }, []); // Empty dependency array - run once on mount

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.relative')) {
        setShowImageModelsDropdown(false);
        setShowVideoModelsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-execute after sign-in
  const [wasSignedIn, setWasSignedIn] = useState(isSignedIn);
  useEffect(() => {
    if (!wasSignedIn && isSignedIn && showSignInModal) {
      setShowSignInModal(false);
      // Preload Subscribe.dev permissions after sign-in
      preloadSubscribeDevPermissions().catch(console.warn);
      setTimeout(() => executeFlow(), 100);
    }
    setWasSignedIn(isSignedIn);
  }, [isSignedIn, wasSignedIn, showSignInModal]);

  // Preload Replicate permissions when API key is set
  useEffect(() => {
    if (replicateApiKey) {
      preloadReplicatePermissions().catch(console.warn);
    }
  }, [replicateApiKey]);

  const isValidConnection = useCallback((connection) => {
    const sourceHandle = connection.sourceHandle;
    const targetHandle = connection.targetHandle;
    
    // Find source and target nodes to get their handle type information
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;
    
    // Get handle types based on node types
    let sourceType, targetType;
    
    // Determine source handle type
    if (sourceNode.type === 'textInput') {
      sourceType = 'prompt'; // textInput only outputs prompts
    } else if (sourceNode.type === 'imageInput') {
      sourceType = 'image'; // imageInput only outputs images
    } else if (sourceNode.type === 'model') {
      // For model nodes, extract type from handle ID (remove _index suffix if present)
      const baseHandle = sourceHandle.split('_')[0];
      if (baseHandle === 'image') sourceType = 'image';
      else if (baseHandle === 'video') sourceType = 'video';
      else if (baseHandle === 'text') sourceType = 'text';
      else sourceType = baseHandle; // fallback to handle ID
    }
    
    // Determine target handle type  
    if (targetNode.type === 'model') {
      // For model nodes, the target handle type should match the handle ID
      if (targetHandle === 'prompt') targetType = 'prompt';
      else if (targetHandle === 'image' || targetHandle === 'input_image' || targetHandle === 'image_1' || targetHandle === 'image_2') {
        targetType = 'image';
      }
      else targetType = targetHandle; // fallback to handle ID
    }
    
    // Check if types are compatible
    if (sourceType === targetType) return true;
    
    // Allow prompt to connect to any input (prompts are flexible)
    if (sourceType === 'prompt') return true;
    
    // Allow text output to connect to prompt inputs (for chaining language models)
    if (sourceType === 'text' && targetType === 'prompt') return true;
    
    return false;
  }, [nodes]);

  const deleteEdge = (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const onConnect = useCallback((params) => {
    if (isValidConnection(params)) {
      // Clear any previous error for this target handle
      setConnectionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${params.target}-${params.targetHandle}`];
        return newErrors;
      });

      setEdges((eds) => {
        // Remove any existing edge that connects to the same target handle
        const filteredEdges = eds.filter((edge) => 
          !(edge.target === params.target && edge.targetHandle === params.targetHandle)
        );
        
        // Add the new edge
        return addEdge({
          ...params,
          type: 'custom',
          style: { stroke: '#4b5563', strokeWidth: 2 },
          animated: false,
          data: { onDelete: deleteEdge },
        }, filteredEdges);
      });
    } else {
      // Show error message for invalid connection
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      
      if (sourceNode && targetNode) {
        // Determine expected input type
        let expectedType = params.targetHandle;
        if (params.targetHandle === 'input_image' || params.targetHandle === 'image_1' || params.targetHandle === 'image_2') {
          expectedType = 'image';
        }
        
        // Determine actual source type
        let sourceType;
        if (sourceNode.type === 'textInput') {
          sourceType = 'text';
        } else if (sourceNode.type === 'imageInput') {
          sourceType = 'image';
        } else if (sourceNode.type === 'model') {
          const baseHandle = params.sourceHandle.split('_')[0];
          sourceType = baseHandle;
        }
        
        const errorKey = `${params.target}-${params.targetHandle}`;
        setConnectionErrors((prev) => ({
          ...prev,
          [errorKey]: `Expected ${expectedType} input, got ${sourceType}`
        }));
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setConnectionErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
          });
        }, 3000);
      }
    }
  }, [isValidConnection, deleteEdge, nodes]);

  // Handle drag start to track what's being dragged
  const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {
    setIsDraggingConnection(true);
    setDragSource({ nodeId, handleId, handleType });
  }, []);

  // Handle drag end to clear tracking
  const onConnectEnd = useCallback(() => {
    setIsDraggingConnection(false);
    setDragSource(null);
    // Clear any drag errors after a short delay
    setTimeout(() => {
      setConnectionErrors({});
    }, 100);
  }, []);

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const changeNodeColor = (nodeId, color) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, backgroundColor: color } } : node
      )
    );
  };

  const createNode = (type, position) => {
    const id = generateId();
    const baseData = {
      onPromptChange: updatePrompt,
      onModelChange: updateModel,
      onSizeChange: updateSize,
      onAspectRatioChange: updateAspectRatio,
      onVoiceIdChange: updateVoiceId,
      onSyncModeChange: updateSyncMode,
      onSystemPromptChange: updateSystemPrompt,
      onLabelChange: updateLabel,
      onDescriptionChange: updateDescription,
      onStrengthChange: updateStrength,
      onImageUpload: updateImageUpload,
      onInputTypeChange: updateInputType,
      onOutputCountChange: updateOutputCount,
      onNameChange: updateNodeName,
      onDelete: deleteNode,
      onColorChange: changeNodeColor,
    };

    const nodeConfigs = {
      textInput: { label: 'Prompt Text', prompt: '' },
      imageInput: { label: 'Upload Image', uploadedImage: null },
      model: { label: 'Model', model: 'black-forest-labs/flux-schnell', aspectRatio: '1:1', outputCount: 1 },
      organizationBox: { label: 'Untitled', description: '' },
    };

    const nodeConfig = nodeConfigs[type];
    return {
      id,
      type,
      position,
      data: { ...baseData, ...nodeConfig },
      ...(type === 'organizationBox' && {
        style: { width: 200, height: 150 },
      }),
    };
  };

  const addNodeFromMenu = (type, customPosition = null) => {
    const position = customPosition || { x: 250 + Math.random() * 200, y: 100 + Math.random() * 200 };
    const newNode = createNode(type, position);
    
    setNodes((nds) => nds.concat(newNode));
  };

  const addModelNode = (modelId, modelName, customPosition = null) => {
    const position = customPosition || { x: 250 + Math.random() * 200, y: 100 + Math.random() * 200 };
    const id = generateId();
    const baseData = {
      onPromptChange: updatePrompt,
      onModelChange: updateModel,
      onSizeChange: updateSize,
      onAspectRatioChange: updateAspectRatio,
      onVoiceIdChange: updateVoiceId,
      onSyncModeChange: updateSyncMode,
      onSystemPromptChange: updateSystemPrompt,
      onStrengthChange: updateStrength,
      onImageUpload: updateImageUpload,
      onInputTypeChange: updateInputType,
      onOutputCountChange: updateOutputCount,
      onNameChange: updateNodeName,
      onDelete: deleteNode,
      onColorChange: changeNodeColor,
    };

    // Get the correct default aspect ratio for this model
    const getDefaultAspectRatio = (modelId) => {
      const modelConfig = MODELS_CONFIG[modelId];
      if (modelConfig && modelConfig.aspectRatios && modelConfig.aspectRatios.length > 0) {
        return modelConfig.aspectRatios[0]; // Use first aspect ratio as default
      }
      // Fallback to 1:1 if no aspect ratios defined
      return '1:1';
    };

    // Get the correct default voice_id for voice models
    const getDefaultVoiceId = (modelId) => {
      const modelConfig = MODELS_CONFIG[modelId];
      if (modelConfig && modelConfig.voiceOptions && modelConfig.voiceOptions.length > 0) {
        return modelConfig.voiceOptions[0]; // Use first voice as default
      }
      return null; // No default if not a voice model
    };

    // Get the correct default sync_mode for lipsync models
    const getDefaultSyncMode = (modelId) => {
      const modelConfig = MODELS_CONFIG[modelId];
      if (modelConfig && modelConfig.syncModeOptions && modelConfig.syncModeOptions.length > 0) {
        return modelConfig.syncModeOptions[0]; // Use first sync mode as default (bounce)
      }
      return null; // No default if not a lipsync model
    };

    const defaultVoiceId = getDefaultVoiceId(modelId);
    const defaultSyncMode = getDefaultSyncMode(modelId);
    const newNode = {
      id,
      type: 'model',
      position,
      data: { 
        ...baseData, 
        label: 'Model', 
        model: modelId,
        name: modelName,
        aspectRatio: getDefaultAspectRatio(modelId),
        outputCount: 1,
        ...(defaultVoiceId && { voice_id: defaultVoiceId }),
        ...(defaultSyncMode && { sync_mode: defaultSyncMode })
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setShowImageModelsDropdown(false);
    setShowVideoModelsDropdown(false);
  };

  const updatePrompt = (nodeId, prompt) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, prompt } } : node
      )
    );
  };

  const updateModel = (nodeId, model) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, model } } : node
      )
    );
  };

  const updateSize = (nodeId, dimension, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // For organization boxes, update the style dimensions
          if (node.type === 'organizationBox') {
            return { 
              ...node, 
              style: { 
                ...node.style, 
                [dimension]: parseInt(value) 
              } 
            };
          } else {
            // For other nodes, update data as before
            return { ...node, data: { ...node.data, [dimension]: parseInt(value) } };
          }
        }
        return node;
      })
    );
  };

  const updateAspectRatio = (nodeId, aspectRatio) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, aspectRatio } } : node
      )
    );
  };

  const updateVoiceId = (nodeId, voice_id) => {
    console.log(`🎤 Voice ID changed for node ${nodeId}: ${voice_id}`);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, voice_id } } : node
      )
    );
  };

  const updateSyncMode = (nodeId, sync_mode) => {
    console.log(`🔄 Sync mode changed for node ${nodeId}: ${sync_mode}`);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, sync_mode } } : node
      )
    );
  };

  const updateSystemPrompt = (nodeId, systemPrompt) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, systemPrompt } } : node
      )
    );
  };

  const updateLabel = (nodeId, label) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label } } : node
      )
    );
  };

  const updateDescription = (nodeId, description) => {
    console.log('📝 updateDescription called:', { nodeId, description });
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, description } } : node
      )
    );
  };


  const updateStrength = (nodeId, strength) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, strength: parseFloat(strength) } } : node
      )
    );
  };

  const updateImageUpload = (nodeId, imageData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, uploadedImage: imageData } } : node
      )
    );
  };


  const updateInputType = (nodeId, inputType) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, inputType } } : node
      )
    );
  };

  const updateOutputCount = (nodeId, outputCount) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, outputCount } } : node
      )
    );
  };

  const updateNodeName = (nodeId, name) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, name } } : node
      )
    );
  };

  const updateBoardName = (name) => {
    const oldName = boardName;
    setBoardName(name);
    // Also update window.FLOW data if it exists
    if (window.FLOW) {
      window.FLOW.name = name;
    }
    
    // Migrate localStorage data if board name changed
    if (oldName && oldName !== name && oldName !== 'Untitled Flow') {
      try {
        const oldKey = `flow_${oldName}`;
        const newKey = `flow_${name}`;
        const savedData = localStorage.getItem(oldKey);
        if (savedData) {
          localStorage.setItem(newKey, savedData);
          localStorage.removeItem(oldKey);
          console.log(`🔄 Migrated workflow: ${oldName} → ${name}`);
        }
      } catch (error) {
        console.warn('Failed to migrate localStorage key:', error);
      }
    }
  };

  // Replicate API integration via proxy
  const runWithReplicate = async (model, input) => {
    // Use replicate proxy URL
    const proxyUrl = window.REPLICATE_PROXY_URL || 'https://replicate.subscribe.dev';
    
    const response = await fetch(`${proxyUrl}/api/replicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        model,
        input,
        apiKey: replicateApiKey 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Proxy error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Normalize the response format to always have output as an array
    let normalizedOutput;
    if (result.output) {
      // If result already has output property, use it
      normalizedOutput = Array.isArray(result.output) ? result.output : [result.output];
    } else if (Array.isArray(result)) {
      // If result is directly an array
      normalizedOutput = result;
    } else {
      // If result is a string or other value
      normalizedOutput = [result];
    }
    
    // Special handling for OpenAI GPT models - concatenate array output into single string
    if (model && (model.includes('openai/gpt-4o') || model.includes('openai/gpt-5')) && Array.isArray(normalizedOutput)) {
      const concatenatedText = normalizedOutput.join('');
      normalizedOutput = [concatenatedText];
    }
    
    return { output: normalizedOutput };
  };

  const updateNodeStatus = (nodeId, status) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, status } } : node
      )
    );
  };

  // COMPLETE executeFlow implementation from image.html
  const executeFlow = async () => {
    if (!isSignedIn && !replicateApiKey) {
      setShowSignInModal(true);
      return;
    }

    setIsExecuting(true);
    
    // Clear all existing outputs from nodes
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          output: undefined,
          outputs: undefined,
          outputStatuses: undefined,
          outputType: undefined,
          status: undefined
        }
      }))
    );
    
    const nodeOutputs = {};

    // Build execution graph based on handle types
    const graph = new Map();
    edges.forEach(edge => {
      if (!graph.has(edge.target)) {
        graph.set(edge.target, []);
      }
      graph.get(edge.target).push({
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      });
    });

    // Topological sort for execution order
    const visited = new Set();
    const executionOrder = [];
    
    const visit = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const dependencies = graph.get(nodeId) || [];
      dependencies.forEach(dep => visit(dep.source));
      
      executionOrder.push(nodeId);
    };

    nodes.forEach(node => visit(node.id));

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;

      try {
        updateNodeStatus(nodeId, 'generating');

        if (node.type === 'textInput') {
          nodeOutputs[nodeId] = { prompt: node.data.prompt || '' };
        } else if (node.type === 'imageInput') {
          if (node.data.uploadedImage) {
            nodeOutputs[nodeId] = { image: node.data.uploadedImage };
          }
        } else if (node.type === 'model') {
          const dependencies = graph.get(nodeId) || [];
          let prompt = '';
          let inputImage = null;

          // Collect inputs from dependencies
          const modelInputs = {}; // Store inputs by their handle ID
          dependencies.forEach(dep => {
            const sourceOutput = nodeOutputs[dep.source];
            if (!sourceOutput) return;
            
            const targetHandle = dep.targetHandle;
            const sourceHandle = dep.sourceHandle;
            
            // Handle prompt inputs (from textInput nodes and text outputs from language models)
            if (targetHandle === 'prompt' || targetHandle === 'text') {
              if (sourceOutput.prompt) {
                prompt = sourceOutput.prompt;
              } else if (sourceOutput.text) {
                prompt = sourceOutput.text;
              }
            }
            
            // Handle image inputs - now using explicit handle IDs
            if (targetHandle === 'input_image' || targetHandle === 'image' || 
                targetHandle === 'image_1' || targetHandle === 'image_2' || targetHandle === 'last_frame_image') {
              let imageToUse = null;
              
              // Handle multiple outputs (image_1, image_2, etc.)
              if (sourceOutput.images && sourceOutput.images.length > 1) {
                // Extract output index from handle like "image_1" -> index 0
                const outputIndex = sourceHandle.includes('_') ? 
                  parseInt(sourceHandle.split('_')[1]) - 1 : 0;
                imageToUse = sourceOutput.images[outputIndex] || sourceOutput.images[0];
              } else if (sourceOutput.image) {
                imageToUse = sourceOutput.image;
              }
              
              // Store by explicit handle ID
              modelInputs[targetHandle] = imageToUse;
              
              // Legacy support for older variable names
              if (targetHandle === 'image' || targetHandle === 'input_image') {
                inputImage = imageToUse;
              }
            }
            
            // Handle video inputs
            if (targetHandle === 'video') {
              let videoToUse = null;
              
              // Handle video outputs
              if (sourceOutput.videos && sourceOutput.videos.length > 0) {
                videoToUse = sourceOutput.videos[0];
              } else if (sourceOutput.video) {
                videoToUse = sourceOutput.video;
              }
              
              // Store by explicit handle ID
              modelInputs[targetHandle] = videoToUse;
            }
            
            // Handle audio inputs
            if (targetHandle === 'audio') {
              let audioToUse = null;
              
              // Handle audio outputs
              if (sourceOutput.audios && sourceOutput.audios.length > 0) {
                audioToUse = sourceOutput.audios[0];
              } else if (sourceOutput.audio) {
                audioToUse = sourceOutput.audio;
              }
              
              // Store by explicit handle ID
              modelInputs[targetHandle] = audioToUse;
            }
          });
          
          // Extract specific inputs for models that need them
          const inputImage2 = modelInputs['image_2'];
          const inputVideo = modelInputs['video'];
          const inputAudio = modelInputs['audio'];
          const lastFrameImage = modelInputs['last_frame_image'];

          const model = node.data.model;
          
          // Determine the model type using consolidated config
          const modelConfig = MODELS_CONFIG[model];
          const isVideoModel = modelConfig?.category === 'video';
          const isLanguageModel = modelConfig?.category === 'language';
          const isVoiceModel = modelConfig?.category === 'voice';
          
          if (prompt || (inputVideo && inputAudio)) {
            let input;
            
            // Add model-specific parameters
            if (model === 'sync/lipsync-2') {
              // Lipsync model uses video and audio inputs (no prompt needed)
              input = {};
              if (inputVideo) {
                input.video = inputVideo;
              }
              if (inputAudio) {
                input.audio = inputAudio;
              }
              // Add sync_mode parameter with 'bounce' as default
              input.sync_mode = node.data.sync_mode || 'bounce';
            } else if (isVideoModel) {
              input = { prompt };
              input.aspect_ratio = node.data.aspectRatio;
              if (inputImage) {
                // Video models use 'image' parameter (no mapping needed)
                input.image = inputImage;
              }
              if (lastFrameImage) {
                // Some video models support last_frame_image parameter
                input.last_frame_image = lastFrameImage;
              }
            } else if (isLanguageModel) {
              // Language models use messages format
              const messages = [];
              
              // Add system message if system prompt is set
              if (node.data.systemPrompt) {
                messages.push({ role: 'system', content: node.data.systemPrompt });
              }
              
              // Build user message content
              if (inputImage && (model.includes('gpt-4o') || model.includes('claude'))) {
                // For multimodal models, use complex content structure
                const userContent = [
                  {
                    type: 'text',
                    text: prompt
                  },
                  {
                    type: 'image_url',
                    image_url: { url: inputImage }
                  }
                ];
                messages.push({ role: 'user', content: userContent });
              } else {
                // For text-only, use simple string content
                messages.push({ role: 'user', content: prompt });
              }
              
              input = { messages };
            } else if (isVoiceModel) {
              // Voice models expect text input for TTS
              input = { text: prompt };
              
              // Add voice_id parameter - use specified voice or fallback to default
              const voiceId = node.data.voice_id || (modelConfig?.voiceOptions && modelConfig.voiceOptions[0]);
              if (voiceId) {
                input.voice_id = voiceId;
              }
            } else {
              // Image model
              input = { prompt };
              
              // Only set aspect_ratio for models that support it
              if (model !== 'google/nano-banana') {
                input.aspect_ratio = node.data.aspectRatio || '1:1';
              }
              
              // Handle different image model requirements with parameter mapping
              if (model === 'google/nano-banana') {
                // Google Nano Banana expects 'image_input' as a list
                const imageList = [];
                if (modelInputs['image_1']) imageList.push(modelInputs['image_1']);
                if (modelInputs['image_2']) imageList.push(modelInputs['image_2']);
                if (imageList.length > 0) {
                  input.image_input = imageList;
                }
              } else if (model === 'black-forest-labs/flux-kontext-max') {
                // Flux Kontext expects 'input_image' parameter
                if (modelInputs['input_image']) {
                  input.input_image = modelInputs['input_image'];
                }
              } else if (modelInputs['image'] || inputImage) {
                // Other image models (like flux-schnell) use 'image' parameter
                input.image = modelInputs['image'] || inputImage;
              }
            }

            const outputCount = node.data.outputCount || 1;
            
            // Debug: Log the input being sent to the API
            console.log(`🔍 API Request for ${model}:`, JSON.stringify(input, null, 2));
            
            // Initialize output statuses - all start as generating
            const outputStatuses = Array(outputCount).fill('generating');
            const outputs = Array(outputCount).fill(null);
            
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId 
                  ? { ...n, data: { ...n.data, outputStatuses: [...outputStatuses] } }
                  : n
              )
            );
            
            // Generate all outputs in parallel
            const generationPromises = Array.from({ length: outputCount }, async (_, i) => {
              try {
                const response = replicateApiKey 
                  ? await runWithReplicate(model, input)
                  : await client.run(model, { input });
                const result = Array.isArray(response.output) ? response.output[0] : response.output;
                outputs[i] = result;
                
                // Update individual output status to complete and add the result immediately
                outputStatuses[i] = 'complete';
                
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { 
                          ...n, 
                          data: { 
                            ...n.data, 
                            outputStatuses: [...outputStatuses],
                            output: n.data.output || result, // Set first successful output as main output
                            outputs: [...outputs].filter(Boolean),
                            outputType: isVideoModel ? 'video' : isLanguageModel ? 'text' : 'image'
                          }
                        }
                      : n
                  )
                );
                
                return result;
              } catch (error) {
                console.error(`Error generating output ${i + 1}:`, error);
                addError({
                  message: `Failed to generate output ${i + 1}: ${error.message}`,
                  nodeId: nodeId,
                  ...error
                });
                outputs[i] = null;
                
                // Update individual output status to error
                outputStatuses[i] = 'error';
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { ...n, data: { ...n.data, outputStatuses: [...outputStatuses] } }
                      : n
                  )
                );
                
                return null;
              }
            });
            
            // Wait for all generations to complete
            await Promise.allSettled(generationPromises);
            
            const validOutputs = outputs.filter(output => output !== null);
            
            if (validOutputs.length > 0) {
              if (isVideoModel) {
                const videoUrls = validOutputs.map(output => 
                  Array.isArray(output) ? output[0] : output
                );
                nodeOutputs[nodeId] = { video: videoUrls[0], videos: videoUrls };
                
                // Add to history
                setHistory(prev => [
                  {
                    id: Date.now() + Math.random(),
                    timestamp: new Date().toISOString(),
                    model: model,
                    prompt: prompt,
                    type: 'video',
                    outputs: videoUrls,
                    nodeId: nodeId
                  },
                  ...prev
                ]);
                
                // Update the model node itself with outputs
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { ...n, data: { ...n.data, output: videoUrls[0], outputs: videoUrls, outputType: 'video' } }
                      : n
                  )
                );
                
              } else if (isLanguageModel) {
                // Language model
                const textOutputs = validOutputs.map(output => 
                  typeof output === 'string' ? output : (Array.isArray(output) ? output[0] : String(output))
                );
                nodeOutputs[nodeId] = { text: textOutputs[0], texts: textOutputs };
                
                // Add to history
                setHistory(prev => [
                  {
                    id: Date.now() + Math.random(),
                    timestamp: new Date().toISOString(),
                    model: model,
                    prompt: prompt,
                    type: 'text',
                    outputs: textOutputs,
                    nodeId: nodeId
                  },
                  ...prev
                ]);
                
                // Update the model node itself with outputs
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { ...n, data: { ...n.data, output: textOutputs[0], outputs: textOutputs, outputType: 'text' } }
                      : n
                  )
                );
                
              } else if (isVoiceModel) {
                // Voice model (TTS)
                const audioUrls = validOutputs.map(output => 
                  Array.isArray(output) ? output[0] : output
                );
                nodeOutputs[nodeId] = { audio: audioUrls[0], audios: audioUrls };
                
                // Add to history
                setHistory(prev => [
                  {
                    id: Date.now() + Math.random(),
                    timestamp: new Date().toISOString(),
                    model: model,
                    prompt: prompt,
                    type: 'audio',
                    outputs: audioUrls,
                    nodeId: nodeId
                  },
                  ...prev
                ]);
                
                // Update the model node itself with outputs
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { ...n, data: { ...n.data, output: audioUrls[0], outputs: audioUrls, outputType: 'audio' } }
                      : n
                  )
                );
                
              } else {
                // Image model
                const imageUrls = validOutputs.map(output => 
                  Array.isArray(output) ? output[0] : output
                );
                nodeOutputs[nodeId] = { image: imageUrls[0], images: imageUrls };
                
                // Add to history
                setHistory(prev => [
                  {
                    id: Date.now() + Math.random(),
                    timestamp: new Date().toISOString(),
                    model: model,
                    prompt: prompt,
                    type: 'image',
                    outputs: imageUrls,
                    nodeId: nodeId
                  },
                  ...prev
                ]);
                
                // Update the model node itself with outputs
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === nodeId 
                      ? { ...n, data: { ...n.data, output: imageUrls[0], outputs: imageUrls, outputType: 'image' } }
                      : n
                  )
                );
                
              }
            }
          }
        }

        updateNodeStatus(nodeId, 'complete');
      } catch (error) {
        console.error(`Error executing node ${nodeId}:`, error);
        addError({
          message: `Failed to execute node ${nodeId}: ${error.message}`,
          nodeId: nodeId,
          ...error
        });
        updateNodeStatus(nodeId, 'error');
      }
    }

    setIsExecuting(false);
    setOutputs(nodeOutputs);
  };

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setOutputs({});
  };

  const exportFlow = () => {
    // Use shared export data creation
    const flowData = createExportData();

    const dataStr = JSON.stringify(flowData, null, 2);
    
    // Create HTML page with copy instructions
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Export Flow</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1f2937; 
            color: #f3f4f6; 
            margin: 0;
            padding: 20px; 
            line-height: 1.5;
        }
        .instructions {
            margin-bottom: 20px;
            padding: 16px;
            background: #111827;
            border-radius: 8px;
            border: 1px solid #374151;
        }
        .instructions h2 {
            margin: 0 0 12px 0;
            font-size: 18px;
            font-weight: 600;
            color: #f9fafb;
        }
        .instructions p {
            margin: 8px 0;
            color: #d1d5db;
            font-size: 14px;
        }
        .instructions code {
            background: #374151;
            color: #fbbf24;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        pre { 
            background: #111827; 
            padding: 20px; 
            border-radius: 8px; 
            overflow: auto;
            border: 1px solid #374151;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
            user-select: all;
        }
    </style>
</head>
<body>
    <div class="instructions">
        <h2>Export Instructions</h2>
        <p>Your flow has been exported as JSON. To use it:</p>
        <p>• <strong>Select all the JSON below</strong> (it will auto-select when this page loads)</p>
        <p>• <strong>Copy</strong> with <code>Ctrl+C</code> (or <code>Cmd+C</code> on Mac)</p>
        <p>• <strong>Paste it directly</strong> where needed, or <strong>optionally save to a file</strong> with a <code>.json</code> extension for importing later</p>
    </div>
    
    <pre id="json-content">${dataStr.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    
    <script>
        // Auto-select JSON content on load
        window.addEventListener('load', () => {
            const pre = document.getElementById('json-content');
            const range = document.createRange();
            range.selectNodeContents(pre);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    </script>
</body>
</html>`;

    // Create blob URL and open
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(htmlBlob);
    window.open(url, '_blank');
    
    // Clean up after delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const importFlow = (eventOrData) => {
    // Helper function to process flow data
    const processFlowData = (flowData) => {
      try {
        // Validate that flowData has required structure
        if (!flowData || !flowData.nodes || !Array.isArray(flowData.nodes)) {
          throw new Error('Invalid flow data structure. Expected nodes array.');
        }

        // Restore callback functions to nodes
        const restoredNodes = flowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onPromptChange: updatePrompt,
            onModelChange: updateModel,
            onSizeChange: updateSize,
            onAspectRatioChange: updateAspectRatio,
            onSystemPromptChange: updateSystemPrompt,
            onLabelChange: updateLabel,
            onDescriptionChange: updateDescription,
            onStrengthChange: updateStrength,
            onImageUpload: updateImageUpload,
            onInputTypeChange: updateInputType,
            onOutputCountChange: updateOutputCount,
            onNameChange: updateNodeName,
            onDelete: deleteNode,
            onColorChange: changeNodeColor,
            edges: [],
            onDeleteEdge: deleteEdge,
          }
        }));

        // Restore callback functions to edges
        const restoredEdges = (flowData.edges || []).map(edge => ({
          ...edge,
          type: 'custom',
          style: { stroke: '#4b5563', strokeWidth: 2 },
          animated: false,
          data: { onDelete: deleteEdge },
        }));

        setNodes(restoredNodes);
        setEdges(restoredEdges);
        
        // Import board name if available
        if (flowData.name || flowData.boardName) {
          const newBoardName = flowData.name || flowData.boardName;
          setBoardName(newBoardName);
          // Also update window.FLOW if it exists
          if (window.FLOW) {
            window.FLOW.name = newBoardName;
          }
        }
        
        
        // Fit view to show all imported nodes
        setTimeout(() => fitView(), 100);
        
        console.log('✅ Flow imported successfully:', flowData.name || flowData.boardName || 'Untitled');
        
      } catch (error) {
        console.error('Error processing flow data:', error);
        addError({
          message: `Failed to import flow: ${error.message}`,
          ...error
        });
        throw error; // Re-throw so caller can handle
      }
    };

    // Check if eventOrData is already parsed flow data (object with nodes)
    if (eventOrData && typeof eventOrData === 'object' && eventOrData.nodes) {
      // Direct flow data import (from ImportModal)
      try {
        processFlowData(eventOrData);
      } catch (error) {
        // This error message will be handled by the ImportModal
        throw error;
      }
      return;
    }

    // File input event import (legacy support)
    if (eventOrData && eventOrData.target && eventOrData.target.files) {
      const file = eventOrData.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const flowData = JSON.parse(e.target.result);
            processFlowData(flowData);
          } catch (error) {
            console.error('Error importing flow file:', error);
            addError({
              message: `Failed to import flow file: ${error.message}`,
              ...error
            });
            alert('Error importing flow file. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
      
      // Reset file input
      eventOrData.target.value = '';
      return;
    }

    // Invalid input
    console.error('Invalid input to importFlow:', eventOrData);
    throw new Error('Invalid import data. Expected flow data object or file input event.');
  };

  // Load template function - similar to importFlow but takes flowData directly
  const loadTemplate = (flowData) => {
    try {
      // Restore callback functions to nodes
      const restoredNodes = flowData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onPromptChange: updatePrompt,
          onModelChange: updateModel,
          onSizeChange: updateSize,
          onAspectRatioChange: updateAspectRatio,
          onVoiceIdChange: updateVoiceId,
          onSyncModeChange: updateSyncMode,
          onSystemPromptChange: updateSystemPrompt,
          onLabelChange: updateLabel,
          onDescriptionChange: updateDescription,
          onStrengthChange: updateStrength,
          onImageUpload: updateImageUpload,
          onInputTypeChange: updateInputType,
          onOutputCountChange: updateOutputCount,
          onNameChange: updateNodeName,
          onDelete: deleteNode,
          onColorChange: changeNodeColor,
          edges: [],
          onDeleteEdge: deleteEdge,
        }
      }));

      // Restore callback functions to edges
      const restoredEdges = flowData.edges.map(edge => ({
        ...edge,
        type: 'custom',
        style: { stroke: '#4b5563', strokeWidth: 2 },
        animated: false,
        data: { onDelete: deleteEdge },
      }));

      setNodes(restoredNodes);
      setEdges(restoredEdges);
      
      // Load board name if available
      if (flowData.boardName) {
        setBoardName(flowData.boardName);
        // Also update window.FLOW if it exists
        if (window.FLOW) {
          window.FLOW.name = flowData.boardName;
        }
      }
      
      
      // Fit view to show all template nodes
      setTimeout(() => fitView(), 100);
      
    } catch (error) {
      console.error('Error loading template:', error);
      addError({
        message: `Failed to load template: ${error.message}`,
        ...error
      });
      alert('Error loading template. Please try again.');
    }
  };

  // Handle restoration modal choices
  const handleRestoreWorkflow = (workflowData) => {
    try {
      // Set board name
      if (workflowData.name || workflowData.boardName) {
        setBoardName(workflowData.name || workflowData.boardName);
      }
      
      // Set nodes and edges if they exist
      if (workflowData.nodes && workflowData.nodes.length > 0) {
        const restoredNodes = workflowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onPromptChange: updatePrompt,
            onModelChange: updateModel,
            onSizeChange: updateSize,
            onAspectRatioChange: updateAspectRatio,
            onVoiceIdChange: updateVoiceId,
            onSyncModeChange: updateSyncMode,
            onSystemPromptChange: updateSystemPrompt,
            onLabelChange: updateLabel,
            onDescriptionChange: updateDescription,
            onStrengthChange: updateStrength,
            onImageUpload: updateImageUpload,
            onInputTypeChange: updateInputType,
            onOutputCountChange: updateOutputCount,
            onNameChange: updateNodeName,
            onDelete: deleteNode,
            onColorChange: changeNodeColor,
            edges: [],
            onDeleteEdge: deleteEdge,
          }
        }));
        setNodes(restoredNodes);
      }
      
      if (workflowData.edges) {
        const restoredEdges = workflowData.edges.map(edge => ({
          ...edge,
          type: 'custom',
          style: { stroke: '#4b5563', strokeWidth: 2 },
          animated: false,
          data: { onDelete: deleteEdge },
        }));
        setEdges(restoredEdges);
      }
      
      // Restore viewport if available
      if (workflowData.viewport && setViewport) {
        setTimeout(() => {
          setViewport(workflowData.viewport);
          console.log('🔄 Restored viewport:', workflowData.viewport);
        }, 100);
      }
      
      console.log('✅ Restored workflow:', workflowData.name || workflowData.boardName);
    } catch (error) {
      console.error('Error restoring workflow:', error);
      addError({
        message: `Failed to restore workflow: ${error.message}`,
        ...error
      });
    }
  };

  const handleStartFresh = () => {
    console.log('🚫 Not restoring saved workflow - continuing with current state');
    // Don't clear anything - just continue with current workflow state
    // This allows window.FLOW data to be used as intended
  };

  // Function to undo restoration and return to pre-restore state
  const handleUndoRestoration = () => {
    if (originalStateBeforeRestore) {
      console.log('↩️ Undoing restoration - returning to original state');
      
      // Restore the original state
      setNodes(originalStateBeforeRestore.nodes);
      setEdges(originalStateBeforeRestore.edges);
      setBoardName(originalStateBeforeRestore.boardName);
      
      // Clear the restore indicator and original state
      setRestoreIndicator(null);
      setOriginalStateBeforeRestore(null);
      setJustRestored(false);
      
      // Allow auto-save to resume
      console.log('✅ Restoration undone - auto-save resumed');
    }
  };

  // Function to dismiss the restore indicator (accept the restoration)
  const handleDismissRestoreIndicator = () => {
    setRestoreIndicator(null);
    setOriginalStateBeforeRestore(null);
    setJustRestored(false);
    console.log('✅ Restoration accepted - indicator dismissed');
  };

  // Function to get all saved workflows from localStorage
  const getSavedWorkflows = () => {
    const savedWorkflows = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('flow_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.nodes && parsed.nodes.length > 0) {
                savedWorkflows.push({
                  key,
                  name: parsed.name || parsed.boardName || key.replace('flow_', ''),
                  lastSaved: parsed.lastSaved,
                  nodeCount: parsed.nodes.length,
                  edgeCount: parsed.edges?.length || 0,
                  data: parsed
                });
              }
            }
          } catch (e) {
            console.warn('Failed to parse saved workflow:', key, e);
            continue;
          }
        }
      }
      
      // Sort by last saved (most recent first)
      savedWorkflows.sort((a, b) => {
        const timeA = new Date(a.lastSaved).getTime();
        const timeB = new Date(b.lastSaved).getTime();
        return timeB - timeA;
      });
      
    } catch (error) {
      console.warn('Error getting saved workflows:', error);
    }
    
    return savedWorkflows;
  };

  // Function to load a specific saved workflow
  const loadSavedWorkflow = (workflowData) => {
    try {
      handleRestoreWorkflow(workflowData);
      console.log('✅ Loaded saved workflow:', workflowData.name || workflowData.boardName);
    } catch (error) {
      console.error('Error loading saved workflow:', error);
      addError({
        message: `Failed to load workflow: ${error.message}`,
        ...error
      });
    }
  };

  // Function to create a new board
  const createNewBoard = () => {
    try {
      // Clear current workflow
      setNodes([]);
      setEdges([]);
      setBoardName('Untitled Flow');
      
      // Reset viewport to default
      if (setViewport) {
        setViewport({ x: 0, y: 0, zoom: 0.8 });
      }
      
      console.log('✨ Created new board');
    } catch (error) {
      console.error('Error creating new board:', error);
      addError({
        message: `Failed to create new board: ${error.message}`,
        ...error
      });
    }
  };

  // Function to delete a saved workflow from localStorage
  const deleteSavedWorkflow = (workflowKey) => {
    try {
      localStorage.removeItem(workflowKey);
      console.log('🗑️ Deleted saved workflow:', workflowKey);
    } catch (error) {
      console.error('Error deleting saved workflow:', error);
      addError({
        type: 'api',
        message: `Failed to delete workflow: ${error.message}`,
        ...error
      });
    }
  };


  return {
    // State
    nodes,
    edges,
    isExecuting,
    boardName,
    outputs,
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
    subscribeDevData,
    client,
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
    onConnectStart,
    onConnectEnd,
    deleteEdge,
    deleteNode,
    changeNodeColor,
    addNodeFromMenu,
    addModelNode,
    executeFlow,
    clearFlow,
    exportFlow,
    importFlow,
    loadTemplate,
    
    // Callbacks
    updatePrompt,
    updateModel,
    updateSize,
    updateAspectRatio,
    updateVoiceId,
    updateSyncMode,
    updateSystemPrompt,
    updateLabel,
    updateDescription,
    updateStrength,
    updateImageUpload,
    updateInputType,
    updateOutputCount,
    updateNodeName,
    updateBoardName,
    isValidConnection,
    screenToFlowPosition,
    
    // Restoration functionality
    restoreIndicator,
    handleUndoRestoration,
    handleDismissRestoreIndicator,
    restorationCheckComplete,
    getSavedWorkflows,
    loadSavedWorkflow,
    createNewBoard,
    deleteSavedWorkflow,
    isAutoSaving,
    connectionErrors,
    isDraggingConnection,
    dragSource,
  };
};

// Enhanced nodes change handler
export const createNodesChangeHandler = (setNodes, onNodesChange) => {
  return (changes) => {
    onNodesChange(changes);
  };
};

// Enhanced edges change handler
export const createEdgesChangeHandler = (setEdges, onEdgesChange) => {
  return (changes) => {
    onEdgesChange(changes);
  };
};