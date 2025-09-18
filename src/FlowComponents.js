import React, { useState, useEffect, useRef } from 'react';
import {
  X, Trash, Palette, FolderOpen, Lightning, Check, Circle,
  Copy, Pencil, Image, Robot, Play, ClockClockwise, CaretDown, MagnifyingGlass,
  Download, Upload, FilmReel, Camera, Box, Brain, DrawPolygon, ExclamationTriangle,
  FileText, Microphone, GripVertical
} from './Icons';
import ErrorModal from './ErrorModal';
import FLOW_TEMPLATES from './Templates';
import { MODELS_CONFIG, getImageModels, getVideoModels, getLanguageModels, getVoiceModels } from './ModelConfig';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", confirmButtonClass = "bg-red-600 hover:bg-red-700" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ExclamationTriangle size={18} /> {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-200 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-600 bg-gray-750">
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white rounded transition-colors ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to determine if a color is light or dark
const getTextColorForBackground = (hexColor) => {
  if (!hexColor) return 'text-white';
  
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? 'text-gray-900' : 'text-white';
};

// Add flashing animation style for generating states
const flashingAnimationStyle = `
@keyframes flashGrey {
  0% { background-color: rgba(55, 65, 81, 0.1); }
  50% { background-color: rgba(55, 65, 81, 0.3); }
  100% { background-color: rgba(55, 65, 81, 0.1); }
}
.generating-flash {
  animation: flashGrey 2s ease-in-out infinite;
}
`;

// Inject the CSS if not already injected
if (typeof document !== 'undefined' && !document.querySelector('#flashing-animation-style')) {
  const style = document.createElement('style');
  style.id = 'flashing-animation-style';
  style.textContent = flashingAnimationStyle;
  document.head.appendChild(style);
}

// URL Modal Component for showing URLs with pre-selection
const URLModal = ({ isOpen, onClose, url, title = "Copy URL" }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Blur overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
        <div className="bg-gray-800 border border-gray-700 rounded-lg w-[600px] max-w-[90vw] pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-300 text-sm mb-3">
              The URL is selected below. You can copy it with Ctrl+C (or Cmd+C):
            </p>
            <input
              ref={inputRef}
              type="text"
              value={url}
              readOnly
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm font-mono select-all focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};


// Helper function to convert external URL to data URL for CSP compliance
const urlToDataURL = async (url) => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('HTTP 404 - Media not found (link may have expired)');
      } else if (response.status === 403) {
        throw new Error('HTTP 403 - Access denied to media');
      } else {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(new Error('Failed to convert media to data URL'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - media took too long to load');
    }
    throw error;
  }
};

// Enhanced edge component with dynamic styling based on execution status
export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style, markerEnd, data }) => {
  const { getBezierPath } = window.ReactFlow;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Determine if this edge should be animated based on target node execution status
  const isExecuting = data?.targetNodeExecuting || false;

  return (
    <path
      id={id}
      style={style}
      className={`react-flow__edge-path ${isExecuting ? 'react-flow__edge-animated' : ''}`}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

// CSP-compliant video component that loads external videos as data URLs
export const SmartVideo = ({ src, className = "" }) => {
  const [dataUrl, setDataUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!src) return;

    let mounted = true;
    const loadVideo = async () => {
      try {
        setStatus('loading');
        setErrorMsg(null);
        const dataUrlResult = await urlToDataURL(src);
        if (!mounted) return;
        setDataUrl(dataUrlResult);
        setStatus('ready');
      } catch (error) {
        if (!mounted) return;
        setErrorMsg(error.message);
        setStatus('error');
      }
    };

    loadVideo();
    return () => {
      mounted = false;
    };
  }, [src]);

  if (status === 'loading') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-600 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          Loading video...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 text-sm p-4 ${className}`}>
        <div className="text-center">
          <div className="mb-3">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-medium mb-2">Video unavailable</p>
          <p className="text-xs text-gray-500 mb-3">
            {errorMsg.includes('HTTP 404') ? 'Video link has expired' : 'Unable to load video'}
          </p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Try original link
          </a>
        </div>
      </div>
    );
  }

  if (status === 'ready' && dataUrl) {
    return (
      <video
        src={dataUrl}
        controls
        playsInline
        className={`bg-black ${className}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-sm ${className}`}>
      No video
    </div>
  );
};

// CSP-compliant audio component that loads external audio as data URLs
export const SmartAudio = ({ src, className = "" }) => {
  const [dataUrl, setDataUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!src) return;

    let mounted = true;
    const loadAudio = async () => {
      try {
        setStatus('loading');
        setErrorMsg(null);
        const dataUrlResult = await urlToDataURL(src);
        if (!mounted) return;
        setDataUrl(dataUrlResult);
        setStatus('ready');
      } catch (error) {
        if (!mounted) return;
        setErrorMsg(error.message);
        setStatus('error');
      }
    };

    loadAudio();
    return () => {
      mounted = false;
    };
  }, [src]);

  if (status === 'loading') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-600 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          Loading audio...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 text-sm p-4 ${className}`}>
        <div className="text-center">
          <div className="mb-3">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9.879 8.464a3 3 0 000 4.243M12 14l.01 0" />
            </svg>
          </div>
          <p className="font-medium mb-2">Audio unavailable</p>
          <p className="text-xs text-gray-500 mb-3">
            {errorMsg || 'Failed to load audio file'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'ready' && dataUrl) {
    return (
      <audio
        src={dataUrl}
        controls
        className={className}
        style={{ width: '100%' }}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-sm ${className}`}>
      No audio
    </div>
  );
};


// Handle component with labels and hover delete functionality
export const LabeledHandle = ({ type, position, id, label, style, dataType, nodeId, edges, onDeleteEdge, required = false, connectionErrors = {}, isDraggingConnection = false, dragSource = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [dragError, setDragError] = useState(null);
  const { Handle, Position, useReactFlow } = window.ReactFlow;
  const reactFlowInstance = useReactFlow();
  const isLeft = position === Position.Left;

  const handleColors = {
    prompt: '#ffffff',
    image: '#ffffff',
    video: '#ffffff',
    any: '#ffffff'
  };

  const color = handleColors[dataType] || handleColors.any;

  // Find connected edges for this handle
  const connectedEdges = edges?.filter(edge => {
    if (type === 'source') {
      return edge.source === nodeId && edge.sourceHandle === id;
    } else {
      return edge.target === nodeId && edge.targetHandle === id;
    }
  }) || [];

  const hasConnections = connectedEdges.length > 0;

  const handleDeleteClick = (evt) => {
    evt.stopPropagation();
    connectedEdges.forEach(edge => onDeleteEdge?.(edge.id));
    setIsHovered(false); // Hide delete button after clicking
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(true);
    
    // If we're dragging and this is a target handle, check compatibility
    if (isDraggingConnection && type === 'target' && dragSource) {
      const nodes = reactFlowInstance.getNodes();
      const sourceNode = nodes.find(node => node.id === dragSource.nodeId);
      
      if (sourceNode) {
        // Get handle types based on node types
        let sourceType, targetType;
        
        // Determine source handle type
        if (sourceNode.type === 'textInput') {
          sourceType = 'prompt';
        } else if (sourceNode.type === 'imageInput') {
          sourceType = 'image';
        } else if (sourceNode.type === 'model') {
          const baseHandle = dragSource.handleId.split('_')[0];
          if (baseHandle === 'image') sourceType = 'image';
          else if (baseHandle === 'video') sourceType = 'video';
          else if (baseHandle === 'text') sourceType = 'text';
          else sourceType = baseHandle;
        }
        
        // Determine target handle type  
        if (id === 'prompt') targetType = 'prompt';
        else if (id === 'image' || id === 'input_image' || id === 'image_1' || id === 'image_2') {
          targetType = 'image';
        } else targetType = id;
        
        // Check if types are compatible
        const isValid = sourceType === targetType || 
                       sourceType === 'prompt' || 
                       (sourceType === 'text' && targetType === 'prompt');
        
        if (!isValid) {
          setDragError(`Expected ${targetType} input, got ${sourceType}`);
        } else {
          setDragError(null);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    // Add a small delay before hiding to allow clicking the delete button
    const timeout = setTimeout(() => {
      setIsHovered(false);
      setDragError(null); // Clear drag error when leaving
    }, 150);
    setHoverTimeout(timeout);
  };

  return (
    <>
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          background: color,
          borderColor: color,
          width: '16px',
          height: '16px',
          cursor: 'crosshair',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          ...style
        }}
        isValidConnection={() => true}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Delete button for connected handles */}
      {hasConnections && isHovered && (
        <button
          className="absolute w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full border border-white flex items-center justify-center text-xs text-white shadow-lg z-50"
          style={{
            top: style?.top || '50%',
            [isLeft ? 'left' : 'right']: isLeft ? '-32px' : '-32px',
            transform: 'translateY(-50%)',
          }}
          onClick={handleDeleteClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          title={`Delete ${connectedEdges.length} connection${connectedEdges.length > 1 ? 's' : ''}`}
        >
          <X size={12} />
        </button>
      )}

      {/* Handle Label */}
      <div
        className="absolute text-xs text-gray-400 whitespace-nowrap pointer-events-none z-10"
        style={{
          top: style?.top || '50%',
          transform: 'translateY(-50%)',
          [isLeft ? 'right' : 'left']: isLeft ? 'calc(100% + 8px)' : 'calc(100% + 8px)'
        }}
      >
        {label}
        {required && type === 'target' && (
          <span className="text-red-400 ml-1">*</span>
        )}
      </div>

      {/* Connection Error Message - Show during drag or after failed connection */}
      {type === 'target' && (dragError || connectionErrors[`${nodeId}-${id}`]) && (
        <div
          className="absolute text-xs text-red-400 whitespace-nowrap pointer-events-none z-20 bg-gray-900 px-2 py-1 rounded border border-red-400"
          style={{
            top: (style?.top && typeof style.top === 'string' && style.top.includes('%')) 
              ? `calc(${style.top} + 20px)` 
              : '70%',
            [isLeft ? 'right' : 'left']: isLeft ? 'calc(100% + 8px)' : 'calc(100% + 8px)'
          }}
        >
          {dragError || connectionErrors[`${nodeId}-${id}`]}
        </div>
      )}
    </>
  );
};

// Node Hover Controls Component
const ColorPickerPortal = ({ isOpen, onClose, onColorChange, currentColor, buttonRef }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        x: rect.right - 120,
        y: rect.bottom + 4
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  const colors = [
    '#1f2937', // default gray (keep original)
    '#374151', // darker slate gray 
    '#4b5563', // medium slate gray
    '#6b7280', // lighter slate gray
    '#10b981', // emerald (matches existing green accents)
    '#3b82f6', // blue (matches existing blue accents) 
    '#8b5cf6', // purple (matches existing purple accents)
    '#f59e0b', // amber (warmer, more muted than yellow)
    '#ef4444', // red (slightly muted)
    '#06b6d4', // cyan (complements the blue family)
    '#84cc16', // lime (softer green variant)
    '#ec4899', // pink (adds warmth while staying professional)
  ];


  const { createPortal } = window.ReactDOM || {};
  if (!createPortal) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100000] bg-transparent"
        onClick={onClose}
      />
      <div
        className={`fixed bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-xl z-[100001] w-[120px] left-[${position.x}px] top-[${position.y}px]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                onColorChange(color);
                onClose();
              }}
              className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                currentColor === color ? 'border-white' : 'border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              title={`Change to ${color}`}
            />
          ))}
        </div>
      </div>
    </>,
    document.body
  );
};

export const NodeHoverControls = ({ nodeId, onDelete, onColorChange, currentColor, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [controlBarHovered, setControlBarHovered] = useState(false);
  const colorButtonRef = useRef(null);

  // Control bar should be visible when either the node or control bar is hovered
  const shouldShowControls = isHovered || controlBarHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* External Control Bar - appears above the node */}
      {shouldShowControls && (
        <div 
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-[600]"
          onMouseEnter={() => setControlBarHovered(true)}
          onMouseLeave={() => setControlBarHovered(false)}
        >
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 px-3 py-2 flex items-center gap-2">
            {/* Color Picker Button */}
            <div className="relative">
              <button
                ref={colorButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg border border-gray-400 flex items-center justify-center text-white shadow-sm transition-all duration-150"
                title="Change color"
              >
                <Palette size={16} />
              </button>
              {/* Color Picker Portal */}
              <ColorPickerPortal
                isOpen={showColorPicker}
                onClose={() => setShowColorPicker(false)}
                onColorChange={(color) => onColorChange(nodeId, color)}
                currentColor={currentColor}
                buttonRef={colorButtonRef}
              />
            </div>
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(nodeId);
              }}
              className="w-8 h-8 bg-red-600 hover:bg-red-500 rounded-lg border border-red-400 flex items-center justify-center text-white shadow-sm transition-all duration-150"
              title="Delete node"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

// Custom Node Components
export const TextInputNode = ({ data, id, selected }) => {
  const { Position } = window.ReactFlow;
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea when data.prompt changes (e.g., when importing templates)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(60, textareaRef.current.scrollHeight) + 'px';
    }
  }, [data.prompt]);

  const handleNameClick = () => {
    setTempName(data.name || 'Prompt Text');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      data.onNameChange?.(id, tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <NodeHoverControls
      nodeId={id}
      onDelete={data.onDelete}
      onColorChange={data.onColorChange}
      currentColor={data.backgroundColor || '#1f2937'}
    >
      <div className="min-w-[320px] max-w-[320px] shadow-xl relative border-2 border-transparent hover:border-green-500 hover:border-2 transition-all duration-200 rounded-3xl">
        {/* Header */}
        <div
          className="rounded-t-3xl p-3"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="nodrag text-sm font-semibold bg-transparent text-white border-b border-white border-opacity-50 focus:outline-none focus:border-opacity-100 w-full"
              autoFocus
            />
          ) : (
            <div
              className="text-sm font-semibold text-white cursor-pointer hover:text-gray-200 transition-colors"
              onClick={handleNameClick}
              title="Click to rename"
            >
              {data.name || 'Prompt Text'}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="p-4 rounded-b-3xl"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >
          <textarea
            ref={textareaRef}
            value={data.prompt || ''}
            onChange={(e) => {
              data.onPromptChange?.(id, e.target.value);
              // Auto-resize textarea
              const textarea = e.target;
              textarea.style.height = 'auto';
              textarea.style.height = Math.max(60, textarea.scrollHeight) + 'px';
            }}
            placeholder="Enter your prompt..."
            className="nodrag w-full bg-gray-800 text-gray-100 text-sm p-3 rounded-2xl border border-gray-700 focus:border-green-500 focus:outline-none resize-none overflow-hidden"
            style={{ 
              minHeight: '60px',
              height: data.prompt ? Math.max(60, (data.prompt.split('\n').length + 1) * 20) + 'px' : '60px'
            }}
            onInput={(e) => {
              // Auto-resize on input as well
              e.target.style.height = 'auto';
              e.target.style.height = Math.max(60, e.target.scrollHeight) + 'px';
            }}
          />
        </div>

        <LabeledHandle
          type="source"
          position={Position.Right}
          id="prompt"
          label="prompt"
          dataType="prompt"
          nodeId={id}
          edges={data.edges}
          onDeleteEdge={data.onDeleteEdge}
          style={{ top: '50%' }}
        />
      </div>
    </NodeHoverControls>
  );
};

export const ImageInputNode = ({ data, id }) => {
  const { Position } = window.ReactFlow;
  const [uploadedImage, setUploadedImage] = useState(data.uploadedImage || null);
  const [imageHeight, setImageHeight] = useState(128); // Default height
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const fileInputRef = useRef(null);

  // Calculate image height on component mount if image already exists
  useEffect(() => {
    if (uploadedImage) {
      calculateImageHeight(uploadedImage);
    }
  }, [uploadedImage]);

  const calculateImageHeight = (base64Image) => {
    const img = document.createElement('img');
    img.onload = () => {
      const nodeWidth = 288; // Fixed node content width (320px - padding)
      const aspectRatio = img.height / img.width;
      const calculatedHeight = Math.round(nodeWidth * aspectRatio);
      // Set reasonable min/max bounds
      const boundedHeight = Math.max(64, Math.min(400, calculatedHeight));
      console.log(`Image dimensions: ${img.width}x${img.height}, calculated height: ${boundedHeight}`);
      setImageHeight(boundedHeight);
    };
    img.onerror = () => {
      console.error('Failed to load image for height calculation');
    };
    img.src = base64Image;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        setUploadedImage(base64);
        data.onImageUpload?.(id, base64);
        calculateImageHeight(base64);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    data.onImageUpload?.(id, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNameClick = () => {
    setTempName(data.name || 'Upload Image');
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      data.onNameChange?.(id, tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <NodeHoverControls
      nodeId={id}
      onDelete={data.onDelete}
      onColorChange={data.onColorChange}
      currentColor={data.backgroundColor || '#1f2937'}
    >
      <div className="min-w-[320px] max-w-[320px] shadow-xl relative border-2 border-transparent hover:border-green-500 hover:border-2 transition-all duration-200 rounded-3xl">
        {/* Header */}
        <div
          className="rounded-t-3xl p-3"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="nodrag text-sm font-semibold bg-transparent text-white border-b border-white border-opacity-50 focus:outline-none focus:border-opacity-100 w-full"
              autoFocus
            />
          ) : (
            <div
              className="text-sm font-semibold text-white cursor-pointer hover:text-gray-200 transition-colors"
              onClick={handleNameClick}
              title="Click to rename"
            >
              {data.name || 'Upload Image'}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="p-4 rounded-b-3xl"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >
          {!uploadedImage ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-sm py-8 px-4 rounded-2xl border-2 border-dashed border-white border-opacity-50 hover:border-opacity-70 transition-all flex flex-col items-center gap-2"
              >
                <FolderOpen size={24} />
                <span>Click to upload image</span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
              </button>
            </>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full object-cover rounded-2xl border border-gray-700"
                style={{ height: `${imageHeight}px` }}
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <LabeledHandle
          type="source"
          position={Position.Right}
          id="image"
          label="image"
          dataType="image"
          nodeId={id}
          edges={data.edges}
          onDeleteEdge={data.onDeleteEdge}
          style={{ top: '50%' }}
        />
      </div>
    </NodeHoverControls>
  );
};

// Generic Model Node that adapts based on model type
export const ModelNode = ({ data, id, selected }) => {
  const { Position } = window.ReactFlow;
  const [showParameters, setShowParameters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // URL Modal state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlToShow, setUrlToShow] = useState('');
  const [urlTitle, setUrlTitle] = useState('Copy URL');
  
  const models = MODELS_CONFIG;

  const currentModel = models[data.model] || models['black-forest-labs/flux-schnell'];

  const handleNameClick = () => {
    setTempName(data.name || currentModel.name);
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      data.onNameChange?.(id, tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Helper function to show URL modal
  const showUrlInModal = (url, title = 'Copy URL') => {
    setUrlToShow(url);
    setUrlTitle(title);
    setShowUrlModal(true);
  };

  const getInputPosition = (input, index, total) => {
    if (total === 1) return '50%';
    if (total === 2) return index === 0 ? '35%' : '65%';
    if (total === 3) return `${25 + (index * 25)}%`;
    return `${20 + (index * 20)}%`;
  };

  const renderParams = () => {
    if (currentModel.params && currentModel.params.includes('aspectRatio')) {
      const aspectRatioLabels = {
        '1:1': '1:1 (Square)',
        '16:9': '16:9 (Landscape)',
        '9:16': '9:16 (Portrait)'
      };

      // Get current aspect ratio, default to first available for the model
      const availableRatios = currentModel.aspectRatios || ['1:1'];
      const currentRatio = data.aspectRatio || availableRatios[0];

      return (
        <select
          value={currentRatio}
          onChange={(e) => data.onAspectRatioChange?.(id, e.target.value)}
          className={`w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-${currentModel.color}-500 focus:outline-none mb-2`}
        >
          {availableRatios.map(ratio => (
            <option key={ratio} value={ratio}>
              {aspectRatioLabels[ratio]}
            </option>
          ))}
        </select>
      );
    }
    return null;
  };

  return (
    <NodeHoverControls
      nodeId={id}
      onDelete={data.onDelete}
      onColorChange={data.onColorChange}
      currentColor={data.backgroundColor || '#1f2937'}
    >
      <div className={`min-w-[320px] max-w-[320px] shadow-xl relative border-2 border-transparent hover:border-${currentModel.color}-500 hover:border-2 transition-all duration-200 rounded-3xl`}>
        {/* Header */}
        <div
          className="rounded-t-3xl p-3"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="nodrag text-sm font-semibold bg-transparent text-white border-b border-white border-opacity-50 focus:outline-none focus:border-opacity-100 w-full"
              autoFocus
            />
          ) : (
            <div
              className="text-sm font-semibold text-white cursor-pointer hover:text-gray-200 transition-colors"
              onClick={handleNameClick}
              title="Click to rename"
            >
              {data.name || currentModel.name}
            </div>
          )}
        </div>

        {/* Parameters Row - Dedicated Section */}
        <div
          className="cursor-pointer"
          style={{ backgroundColor: `${data.backgroundColor || '#1f2937'}cc` }}
          onClick={() => setShowParameters(!showParameters)}
        >
          <div className="p-3 border-l border-r border-gray-600 flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Parameters</div>
            <div className={`text-gray-400 transition-transform duration-200 ${showParameters ? 'rotate-180' : ''}`}>
              <CaretDown size={14} />
            </div>
          </div>
        </div>

        {/* Collapsible Parameters Content */}
        {showParameters && (
          <div
            className="p-4 border-l border-r border-gray-600"
            style={{ backgroundColor: `${data.backgroundColor || '#1f2937'}dd` }}
          >

            <div className="space-y-3">
              {/* Model Selection */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Model</label>
                <select
                  value={data.model || Object.keys(getImageModels())[0]}
                  onChange={(e) => data.onModelChange?.(id, e.target.value)}
                  className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <optgroup label="Image Models">
                    {Object.entries(getImageModels()).map(([modelId, config]) => (
                      <option key={modelId} value={modelId}>{config.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Video Models">
                    {Object.entries(getVideoModels()).map(([modelId, config]) => (
                      <option key={modelId} value={modelId}>{config.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Language Models">
                    {Object.entries(getLanguageModels()).map(([modelId, config]) => (
                      <option key={modelId} value={modelId}>{config.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Voice Models">
                    {Object.entries(getVoiceModels()).map(([modelId, config]) => (
                      <option key={modelId} value={modelId}>{config.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* System Prompt */}
              {currentModel.params && currentModel.params.includes('system_prompt') && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">System Prompt</label>
                  <textarea
                    value={data.systemPrompt || ''}
                    onChange={(e) => data.onSystemPromptChange?.(id, e.target.value)}
                    placeholder="You are a helpful assistant..."
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
                    rows="3"
                  />
                </div>
              )}

              {/* Aspect Ratio */}
              {currentModel.params && currentModel.params.includes('aspectRatio') && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Aspect Ratio</label>
                  <select
                    value={data.aspectRatio || (currentModel.aspectRatios || ['1:1'])[0]}
                    onChange={(e) => data.onAspectRatioChange?.(id, e.target.value)}
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    {(currentModel.aspectRatios || ['1:1']).map(ratio => (
                      <option key={ratio} value={ratio}>
                        {ratio === '1:1' ? '1:1 (Square)' :
                         ratio === '16:9' ? '16:9 (Landscape)' :
                         ratio === '9:16' ? '9:16 (Portrait)' : ratio}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Voice ID */}
              {currentModel.params && currentModel.params.includes('voice_id') && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Voice</label>
                  <select
                    value={data.voice_id || (currentModel.voiceOptions || [])[0]}
                    onChange={(e) => {
                      console.log(`🎤 Voice dropdown changed: ${e.target.value}`);
                      data.onVoiceIdChange?.(id, e.target.value);
                    }}
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    {(currentModel.voiceOptions || []).map(voice => (
                      <option key={voice} value={voice}>
                        {voice.replace(/English_|_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {data.voice_id || 'default'} | Options: {(currentModel.voiceOptions || []).length}
                  </div>
                </div>
              )}

              {/* Sync Mode */}
              {currentModel.params && currentModel.params.includes('sync_mode') && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sync Mode</label>
                  <select
                    value={data.sync_mode || (currentModel.syncModeOptions || [])[0]}
                    onChange={(e) => {
                      console.log(`🔄 Sync mode dropdown changed: ${e.target.value}`);
                      data.onSyncModeChange?.(id, e.target.value);
                    }}
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    {(currentModel.syncModeOptions || []).map(mode => (
                      <option key={mode} value={mode}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {data.sync_mode || 'bounce'} | Options: {(currentModel.syncModeOptions || []).length}
                  </div>
                </div>
              )}

              {/* Output Count */}
              {currentModel.params && currentModel.params.includes('outputs') && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Outputs to Generate</label>
                  <select
                    value={data.outputCount || 1}
                    onChange={(e) => data.onOutputCountChange?.(id, parseInt(e.target.value))}
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value={1}>1 Output</option>
                    <option value={2}>2 Outputs</option>
                    <option value={3}>3 Outputs</option>
                    <option value={4}>4 Outputs</option>
                    <option value={5}>5 Outputs</option>
                    <option value={6}>6 Outputs</option>
                    <option value={7}>7 Outputs</option>
                    <option value={8}>8 Outputs</option>
                  </select>
                </div>
              )}

              {/* For models without configurable outputs, show default output count */}
              {!(currentModel.params && currentModel.params.includes('outputs')) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Outputs to Generate</label>
                  <select
                    value={data.outputCount || 1}
                    onChange={(e) => data.onOutputCountChange?.(id, parseInt(e.target.value))}
                    className="nodrag w-full bg-gray-900 text-gray-100 text-sm p-2 rounded-2xl border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value={1}>1 Output</option>
                    <option value={2}>2 Outputs</option>
                    <option value={3}>3 Outputs</option>
                    <option value={4}>4 Outputs</option>
                    <option value={5}>5 Outputs</option>
                    <option value={6}>6 Outputs</option>
                    <option value={7}>7 Outputs</option>
                    <option value={8}>8 Outputs</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Output Section - Always Present */}
        <div
          className="p-4 rounded-b-3xl"
          style={{ backgroundColor: data.backgroundColor || '#1f2937' }}
        >

          {data.output ? (
            <>
              {data.outputType === 'image' && (
                <div className="space-y-2">
                  {(data.outputCount || 1) > 1 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: data.outputCount || 1 }).map((_, index) => {
                        const imageUrl = data.outputs?.[index];
                        const outputStatus = data.outputStatuses?.[index] || 'pending';
                        return (
                          <div key={index} className="relative">
                            {imageUrl ? (
                              <>
                                <img
                                  src={imageUrl}
                                  alt={`Generated ${index + 1}`}
                                  className={`w-full object-cover rounded-2xl border border-gray-600 bg-gray-800 cursor-pointer hover:border-blue-500 transition-colors ${
                                    data.aspectRatio === '16:9' ? 'aspect-video' :
                                    data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                                    'aspect-square'
                                  }`}
                                  onClick={() => window.open(imageUrl, '_blank')}
                                />
                                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                <div className="absolute top-1 right-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showUrlInModal(imageUrl, 'Copy Image URL');
                                    }}
                                    className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                                    title="Copy URL"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className={`w-full flex items-center justify-center text-gray-500 text-xs border-2 border-dashed border-gray-700 rounded-2xl relative ${
                                data.aspectRatio === '16:9' ? 'aspect-video' :
                                data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                                'aspect-square'
                              } ${outputStatus === 'generating' ? 'generating-flash' : ''}`}>
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                {outputStatus === 'generating' ? (
                                  <div className="flex items-center gap-1">
                                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                                    <span className="text-gray-400">Generating...</span>
                                  </div>
                                ) : outputStatus === 'complete' ? (
                                  <span className="text-green-400"><Check size={12} /> Ready</span>
                                ) : outputStatus === 'error' ? (
                                  <span className="text-red-400"><X size={12} /> Error</span>
                                ) : (
                                  `Output ${index + 1}`
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={data.output}
                        alt="Generated"
                        className={`w-full object-cover rounded-2xl border border-gray-600 bg-gray-800 cursor-pointer hover:border-blue-500 transition-colors ${
                          data.aspectRatio === '16:9' ? 'aspect-video' :
                          data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                          'aspect-square'
                        }`}
                        onClick={() => window.open(data.output, '_blank')}
                      />
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showUrlInModal(data.output, 'Copy Image URL');
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                          title="Copy URL"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {data.outputType === 'video' && (
                <div className="space-y-2">
                  {(data.outputCount || 1) > 1 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: data.outputCount || 1 }).map((_, index) => {
                        const videoUrl = data.outputs?.[index];
                        const outputStatus = data.outputStatuses?.[index] || 'pending';
                        return (
                          <div key={index} className={`relative ${
                            data.aspectRatio === '16:9' ? 'aspect-video' :
                            data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                            'aspect-square'
                          }`}>
                            {videoUrl ? (
                              <>
                                <SmartVideo
                                  src={videoUrl}
                                  className="w-full h-full object-cover rounded-2xl border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                                  onClick={() => window.open(videoUrl, '_blank')}
                                />
                                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                                  Video {index + 1}
                                </div>
                                <div className="absolute top-1 right-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showUrlInModal(videoUrl, 'Copy Video URL');
                                    }}
                                    className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                                    title="Copy URL"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center text-gray-500 text-xs border-2 border-dashed border-gray-700 rounded-2xl relative ${outputStatus === 'generating' ? 'generating-flash' : ''}`}>
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                {outputStatus === 'generating' ? (
                                  <div className="flex items-center gap-1">
                                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                                    <span className="text-gray-400">Generating...</span>
                                  </div>
                                ) : outputStatus === 'complete' ? (
                                  <span className="text-green-400"><Check size={12} /> Ready</span>
                                ) : outputStatus === 'error' ? (
                                  <span className="text-red-400"><X size={12} /> Error</span>
                                ) : (
                                  `Video ${index + 1}`
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`relative ${
                      data.aspectRatio === '16:9' ? 'aspect-video' :
                      data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                      'aspect-square'
                    }`}>
                      <SmartVideo
                        src={data.output}
                        className="w-full h-full object-cover rounded-2xl border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => window.open(data.output, '_blank')}
                      />
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showUrlInModal(data.output, 'Copy Video URL');
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                          title="Copy URL"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {data.outputType === 'text' && (
                <div className="space-y-2">
                  {(data.outputCount || 1) > 1 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: data.outputCount || 1 }).map((_, index) => {
                        const textOutput = data.outputs?.[index];
                        const outputStatus = data.outputStatuses?.[index] || 'pending';
                        return (
                          <div key={index} className="relative">
                            {textOutput ? (
                              <div className="bg-gray-700 border border-gray-600 rounded p-3 text-sm text-white relative max-h-40 overflow-y-auto">
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                <div className="absolute top-1 right-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(textOutput);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                                    title="Copy text"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                                <div className="mt-4 whitespace-pre-wrap break-words text-xs">
                                  {textOutput}
                                </div>
                              </div>
                            ) : (
                              <div className="h-20 bg-gray-800 border border-dashed border-gray-600 rounded flex items-center justify-center text-gray-500 text-xs relative">
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                {outputStatus === 'generating' ? (
                                  <div className="flex items-center gap-1">
                                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                                    <span className="text-gray-400">Generating...</span>
                                  </div>
                                ) : outputStatus === 'complete' ? (
                                  <span className="text-green-400"><Check size={12} /> Ready</span>
                                ) : outputStatus === 'error' ? (
                                  <span className="text-red-400"><X size={12} /> Error</span>
                                ) : (
                                  `Text ${index + 1}`
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-700 border border-gray-600 rounded p-3 text-sm text-white relative max-h-40 overflow-y-auto">
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(data.output);
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                          title="Copy text"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      <div className="whitespace-pre-wrap break-words text-xs">
                        {data.output}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {data.outputType === 'audio' && (
                <div className="space-y-2">
                  {(data.outputCount || 1) > 1 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: data.outputCount || 1 }).map((_, index) => {
                        const audioUrl = data.outputs?.[index];
                        const outputStatus = data.outputStatuses?.[index] || 'pending';
                        return (
                          <div key={index} className="relative">
                            {audioUrl ? (
                              <div className="bg-gray-700 border border-gray-600 rounded p-3 text-sm text-white relative">
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                <div className="absolute top-1 right-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const a = document.createElement('a');
                                      a.href = audioUrl;
                                      a.download = `audio_${index + 1}.mp3`;
                                      a.click();
                                    }}
                                    className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                                    title="Download audio"
                                  >
                                    <Download size={12} />
                                  </button>
                                </div>
                                <div className="mt-4">
                                  <SmartAudio src={audioUrl} className="w-full" />
                                </div>
                              </div>
                            ) : (
                              <div className="h-20 bg-gray-800 border border-dashed border-gray-600 rounded flex items-center justify-center text-gray-500 text-xs relative">
                                <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                                {outputStatus === 'generating' ? (
                                  <div className="flex items-center gap-1">
                                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                                    <span className="text-gray-400">Generating...</span>
                                  </div>
                                ) : outputStatus === 'complete' ? (
                                  <span className="text-green-400"><Check size={12} /> Ready</span>
                                ) : outputStatus === 'error' ? (
                                  <span className="text-red-400"><X size={12} /> Error</span>
                                ) : (
                                  `Audio ${index + 1}`
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-700 border border-gray-600 rounded p-3 text-sm text-white relative">
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const a = document.createElement('a');
                            a.href = data.output;
                            a.download = 'audio.mp3';
                            a.click();
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                          title="Download audio"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                      <SmartAudio src={data.output} className="w-full" />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {(data.outputCount || 1) > 1 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: data.outputCount || 1 }).map((_, index) => {
                    const outputStatus = data.outputStatuses?.[index] || 'pending';
                    return (
                      <div key={index} className={`w-full flex items-center justify-center text-gray-500 text-xs border-2 border-dashed border-gray-700 rounded-2xl relative ${
                        data.aspectRatio === '16:9' ? 'aspect-video' :
                        data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                        'aspect-square'
                      } ${outputStatus === 'generating' ? 'generating-flash' : ''}`}>
                        <div className="absolute top-1 left-1 bg-gray-600 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                        {outputStatus === 'generating' ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                            <span className="text-gray-400">Generating...</span>
                          </div>
                        ) : outputStatus === 'complete' ? (
                          <span className="text-green-400"><Check size={12} /> Ready</span>
                        ) : outputStatus === 'error' ? (
                          <span className="text-red-400"><X size={12} /> Error</span>
                        ) : (
                          `Output ${index + 1}`
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`w-full flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-2xl ${
                    data.aspectRatio === '16:9' ? 'aspect-video' :
                    data.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                    'aspect-square'
                  } ${data.status === 'generating' ? 'generating-flash' : ''}`}
                >
                  {data.status === 'generating' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                      Generating...
                    </div>
                  ) : (
                    'Output will appear here'
                  )}
                </div>
              )}
            </div>
          )}

          {/* Output Handles - Dynamic based on output count */}
          {Array.from({ length: data.outputCount || 1 }).map((_, index) =>
            currentModel.outputs.map((output) => {
              const totalOutputs = data.outputCount || 1;
              let topPosition;

              if (totalOutputs === 1) {
                topPosition = data.output ? '50%' : '35%';
              } else if (totalOutputs < 5) {
                topPosition = data.output ?
                  `${40 + (index * 15)}%` :
                  `${25 + (index * 15)}%`;
              } else {
                const startPos = data.output ? 30 : 20;
                const endPos = data.output ? 90 : 80;
                const spacing = (endPos - startPos) / Math.max(1, totalOutputs - 1);
                topPosition = `${startPos + (index * spacing)}%`;
              }

              return (
                <LabeledHandle
                  key={`output-${output.id}-${index}`}
                  type="source"
                  position={Position.Right}
                  id={data.outputCount > 1 ? `${output.id}_${index + 1}` : output.id}
                  label={data.outputCount > 1 ? `${output.name} ${index + 1}` : output.name}
                  dataType={output.type}
                  nodeId={id}
                  edges={data.edges}
                  onDeleteEdge={data.onDeleteEdge}
                  style={{
                    top: topPosition
                  }}
                />
              );
            })
          ).flat()}
        </div>

        {/* Dynamic Input Handles */}
        {currentModel.inputs.map((input, index) => {
          return (
            <LabeledHandle
              key={`input-${input.id}-${index}`}
              type="target"
              position={Position.Left}
              id={input.id}
              label={input.name}
              dataType={input.type}
              nodeId={id}
              edges={data.edges}
              onDeleteEdge={data.onDeleteEdge}
              required={input.required}
              style={{ top: getInputPosition(input, index, currentModel.inputs.length) }}
              connectionErrors={data.connectionErrors}
              isDraggingConnection={data.isDraggingConnection}
              dragSource={data.dragSource}
            />
          );
        })}
      </div>

      {/* URL Modal */}
      <URLModal 
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        url={urlToShow}
        title={urlTitle}
      />
    </NodeHoverControls>
  );
};

// Organization Box Node for grouping and labeling
export const OrganizationBoxNode = ({ data, id, selected, style }) => {
  const { NodeResizer, NodeResizeControl } = window.ReactFlow;
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState('');
  const textareaRef = useRef(null);

  // Debug: log when style changes
  React.useEffect(() => {
    console.log('📏 OrganizationBox render with props:', {
      nodeId: id,
      style: style,
      data: data,
      selected
    });
  }, [style, data, selected, id]);

  // Auto-resize textarea when data.description changes (e.g., when importing templates)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(60, textareaRef.current.scrollHeight) + 'px';
    }
  }, [data.description]);

  const handleLabelClick = () => {
    setTempLabel(data.label || 'Untitled');
    setIsEditing(true);
  };

  const handleLabelSave = () => {
    if (tempLabel.trim()) {
      data.onLabelChange?.(id, tempLabel.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="organization-box-wrapper">
      <NodeResizer
        color={data.backgroundColor || '#374151'}
        handleStyle={{ width: '10px', height: '10px' }}
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        onResize={(event, params) => {
          console.log('🔧 NodeResizer onResize called:', {
            nodeId: id,
            width: params.width,
            height: params.height,
            event: event.type
          });
          // Update the node's style in ReactFlow state
          if (data.onSizeChange) {
            data.onSizeChange(id, 'width', params.width);
            data.onSizeChange(id, 'height', params.height);
          }
        }}
      />
      <NodeHoverControls
        nodeId={id}
        onDelete={data.onDelete}
        onColorChange={data.onColorChange}
        currentColor={data.backgroundColor || '#374151'}
      >
        <div
          className="relative border-2 border-dashed border-gray-500 rounded-3xl bg-opacity-20"
          style={{
            backgroundColor: `${data.backgroundColor || '#374151'}40`,
            width: data.nodeStyle?.width || style?.width || 200,
            height: data.nodeStyle?.height || style?.height || 150,
          }}
        >

        {/* Label */}
        <div className="absolute top-2 left-2 right-2">
          {isEditing ? (
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onBlur={handleLabelSave}
              onKeyDown={handleKeyPress}
              className={`nodrag w-full bg-transparent ${getTextColorForBackground(data.backgroundColor)} font-semibold text-lg border-b border-current border-opacity-50 focus:outline-none focus:border-opacity-100`}
              autoFocus
            />
          ) : (
            <div
              className={`${getTextColorForBackground(data.backgroundColor)} font-semibold text-lg cursor-pointer hover:opacity-75 transition-opacity`}
              onClick={handleLabelClick}
              title="Click to edit label"
            >
              {data.label || 'Untitled'}
            </div>
          )}
        </div>

        {/* Optional description area */}
        <div className="absolute top-10 left-2 right-2">
          <textarea
            ref={textareaRef}
            value={data.description || ''}
            onChange={(e) => {
              data.onDescriptionChange?.(id, e.target.value);
              // Auto-resize textarea
              const textarea = e.target;
              textarea.style.height = 'auto';
              textarea.style.height = Math.max(32, textarea.scrollHeight) + 'px';
            }}
            placeholder={selected ? "Add description..." : ""}
            className="nodrag w-full bg-transparent text-gray-300 text-xs resize-none border border-gray-600 border-opacity-30 rounded-lg p-2 focus:outline-none focus:border-opacity-60 placeholder-gray-500 overflow-hidden"
            style={{ 
              minHeight: '32px',
              height: data.description ? Math.max(32, (data.description.split('\n').length + 1) * 16) + 'px' : '32px'
            }}
            onInput={(e) => {
              // Auto-resize on input as well
              e.target.style.height = 'auto';
              e.target.style.height = Math.max(32, e.target.scrollHeight) + 'px';
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />
        </div>
        </div>
      </NodeHoverControls>
    </div>
  );
};

// Node types
export const nodeTypes = {
  textInput: TextInputNode,
  imageInput: ImageInputNode,
  model: ModelNode,
  organizationBox: OrganizationBoxNode,
};

export const edgeTypes = {
  custom: CustomEdge,
};

// History Panel Component
export const HistoryPanel = ({ history, showHistory, setShowHistory }) => {
  if (!showHistory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHistory(false)}>
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-[90%] max-w-4xl h-[80%] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Generation History</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{history.length} generations</span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <ClockClockwise size={48} className="mb-4 opacity-50" />
                <p>No generations yet</p>
                <p className="text-sm">Execute a flow to see history here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 font-medium">{item.model}</span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {item.type}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm bg-gray-800 rounded p-2 font-mono">
                        "{item.prompt}"
                      </p>
                    </div>
                  </div>

                  {/* Outputs */}
                  {item.outputs && item.outputs.length > 0 && item.outputs.some(output => output && output.startsWith('http')) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {item.outputs.filter(output => output && output.startsWith('http')).map((output, index) => (
                      <div key={index} className="relative group">
                        {item.type === 'image' ? (
                          <img
                            src={output}
                            alt={`Output ${index + 1}`}
                            className="w-full h-24 object-contain rounded border border-gray-600 bg-gray-800 cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => window.open(output, '_blank')}
                          />
                        ) : (
                          <SmartVideo
                            src={output}
                            className="w-full h-24 object-cover rounded border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => window.open(output, '_blank')}
                          />
                        )}
                        <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigator.clipboard.writeText(output)}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-5 h-5 rounded flex items-center justify-center text-xs"
                            title="Copy URL"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sign In Modal Component
export const SignInModal = ({ showSignInModal, setShowSignInModal, signIn, replicateApiKey, setReplicateApiKey, tempReplicateKey, setTempReplicateKey, preloadReplicatePermissions }) => {
  if (!showSignInModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSignInModal(false)}>
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-2xl w-[90%] max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-200">What AI provider do you want to use?</h2>
          </div>
          {/* Replicate API Key Option - Top Half */}
          <div>
            <div className="text-gray-200 mb-3">
              <div className="font-medium text-base text-left">Use your own Replicate API Key</div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm text-left">
                Get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" className="text-gray-300 hover:text-gray-200 underline underline-offset-2">replicate.com/account/api-tokens</a>
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={tempReplicateKey}
                  onChange={(e) => setTempReplicateKey(e.target.value)}
                  placeholder="Enter your Replicate API key..."
                  className="nodrag flex-1 bg-gray-800/90 text-gray-200 text-sm p-3 rounded border border-gray-600/50 focus:border-gray-500 focus:outline-none placeholder-gray-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempReplicateKey.trim()) {
                      setReplicateApiKey(tempReplicateKey.trim());
                      setTempReplicateKey('');
                      setShowSignInModal(false);
                      // Preload Replicate permissions after API key is set
                      preloadReplicatePermissions().catch(console.warn);
                      // Trigger click on execute button after API key is set
                      setTimeout(() => {
                        const executeButton = Array.from(document.querySelectorAll('button')).find(btn =>
                          btn.textContent.includes('Execute Flow')
                        );
                        if (executeButton) executeButton.click();
                      }, 100);
                    }
                  }}
                  disabled={!tempReplicateKey.trim()}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-200 rounded font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          {/* Subscribe.dev Option - Bottom Half */}
          <div>
            <div className="text-gray-200 mb-3">
              <div className="font-medium text-base text-left">Use subscribe.dev tokens</div>
              <div className="text-gray-400 text-sm mt-1">There's 100 free credits</div>
            </div>
            <button
              onClick={() => {
                setShowSignInModal(false);
                signIn();
              }}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded font-medium transition-colors"
            >
              Log In
            </button>
          </div>

          <button
            onClick={() => setShowSignInModal(false)}
            className="w-full mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// User Info Component
export const UserInfo = ({ isSignedIn, user, usage, signOut, subscribe, replicateApiKey, setReplicateApiKey, setTempReplicateKey, signIn, setShowSignInModal }) => {
  return (
    <div>
      {isSignedIn ? (
        <div className="relative group">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50 shadow-2xl flex items-center gap-3 cursor-pointer">
            <div className="flex-shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="User" className="w-6 h-6 rounded-full border border-gray-600" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs">
                  {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="text-gray-400">
              <CaretDown size={14} />
            </div>
          </div>

          {/* User Info Tooltip */}
          <div className="absolute top-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Account Menu
          </div>

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-3">
              {/* User Info Section */}
              <div className="pb-3 mb-3 border-b border-gray-600">
                <div className="text-sm text-gray-300 mb-1">
                  {user?.email || 'User'}
                </div>
                {usage && (
                  <div className="text-slate-400 font-medium text-sm">
                    {usage.remainingCredits} credits
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <button
                onClick={subscribe}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
              >
                Manage Plan
              </button>
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : replicateApiKey ? (
        <div className="relative group">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50 shadow-2xl flex items-center gap-2">
            <div className="text-white font-medium text-sm">
              {replicateApiKey.slice(0, 6)}******
            </div>
            <button
              onClick={() => {
                setReplicateApiKey('');
                setTempReplicateKey('');
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Clear API Key"
            >
              <X size={14} />
            </button>
          </div>

          {/* API Key Tooltip */}
          <div className="absolute top-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Using Custom API Key
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50 shadow-2xl">
            <button
              onClick={() => setShowSignInModal(true)}
              className="text-white hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Sign In Tooltip */}
          <div className="absolute top-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Sign in for free credits
          </div>
        </div>
      )}
    </div>
  );
};

// Toolbar Component
export const Toolbar = ({ executeFlow, isExecuting, exportFlow, importFlow, showHistory, setShowHistory, history, isSignedIn, replicateApiKey }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
      {executeFlow && (
        <button
          onClick={executeFlow}
          disabled={isExecuting}
          className={`px-6 py-3 rounded-full font-medium transition-all shadow-lg ${
            isExecuting
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-xl'
          }`}
        >
          {isExecuting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
              Executing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play size={14} />
              Execute Flow
            </div>
          )}
        </button>
      )}

      {/* Export Button */}
      {exportFlow && (
        <div className="relative group">
          <button
            onClick={exportFlow}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
            title="Export Flow to JSON"
          >
            <Download size={14} />
          </button>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
            Export Flow
          </div>
        </div>
      )}
      
      {/* Import Button */}
      {onImportFlow && (
        <div className="relative group">
          <button
            onClick={onImportFlow}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
            title="Import Flow from JSON"
          >
            <Upload size={14} />
          </button>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
            Import Flow
          </div>
        </div>
      )}

      {/* History Button */}
      <div className="relative group">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
          title={`History (${history.length} generations)`}
        >
          <ClockClockwise size={14} />
          {history.length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {history.length}
            </span>
          )}
        </button>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
          History
        </div>
      </div>


      {!isSignedIn && !replicateApiKey && (
        <div className="text-center text-xs text-gray-400 mt-1 absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          Sign in or API key required to execute
        </div>
      )}
    </div>
  );
};

// Node Palette Component
export const NodePalette = ({ addNodeFromMenu, addModelNode, showImageModelsDropdown, setShowImageModelsDropdown, showVideoModelsDropdown, setShowVideoModelsDropdown, showLanguageModelsDropdown, setShowLanguageModelsDropdown, showVoiceModelsDropdown, setShowVoiceModelsDropdown }) => {
  return (
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800 rounded-full border border-gray-700 shadow-lg py-1 px-2 flex items-center gap-2">
        {/* Organization Nodes */}
        <div className="relative group">
          <button
            onClick={() => addNodeFromMenu('organizationBox')}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
          >
            <Box size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Rectangle
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-600 mx-2"></div>

        {/* Input Nodes */}
        <div className="relative group">
          <button
            onClick={() => addNodeFromMenu('textInput')}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
          >
            <Pencil size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Prompt Text
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => addNodeFromMenu('imageInput')}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
          >
            <Image size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Upload Image
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-600 mx-2"></div>

        {/* Image Models */}
        <div className="relative group">
          <button
            onClick={() => {
              setShowImageModelsDropdown(!showImageModelsDropdown);
              setShowVideoModelsDropdown(false);
              setShowLanguageModelsDropdown(false);
              setShowVoiceModelsDropdown(false);
            }}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
            title="Image Models"
          >
            <Camera size={16} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Image Models
          </div>

          {/* Image Models Dropdown */}
          {showImageModelsDropdown && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl p-2 min-w-[320px] z-50">
              <div className="space-y-1">
                {Object.entries(getImageModels()).map(([modelId, config]) => (
                  <button
                    key={modelId}
                    onClick={() => addModelNode(modelId, config.name)}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <div className="font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Models */}
        <div className="relative group">
          <button
            onClick={() => {
              setShowVideoModelsDropdown(!showVideoModelsDropdown);
              setShowImageModelsDropdown(false);
              setShowLanguageModelsDropdown(false);
              setShowVoiceModelsDropdown(false);
            }}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
            title="Video Models"
          >
            <FilmReel size={16} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Video Models
          </div>

          {/* Video Models Dropdown */}
          {showVideoModelsDropdown && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl p-2 min-w-[320px] z-50">
              <div className="space-y-1">
                {Object.entries(getVideoModels()).map(([modelId, config]) => (
                  <button
                    key={modelId}
                    onClick={() => addModelNode(modelId, config.name)}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <div className="font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Models */}
        <div className="relative group">
          <button
            onClick={() => {
              setShowLanguageModelsDropdown(!showLanguageModelsDropdown);
              setShowImageModelsDropdown(false);
              setShowVideoModelsDropdown(false);
              setShowVoiceModelsDropdown(false);
            }}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
            title="Language Models"
          >
            <FileText size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Language Models
          </div>

          {/* Language Models Dropdown */}
          {showLanguageModelsDropdown && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl p-2 min-w-[320px] z-50">
              <div className="space-y-1">
                {Object.entries(getLanguageModels()).map(([modelId, config]) => (
                  <button
                    key={modelId}
                    onClick={() => addModelNode(modelId, config.name)}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <div className="font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voice Models */}
        <div className="relative group">
          <button
            onClick={() => {
              setShowVoiceModelsDropdown(!showVoiceModelsDropdown);
              setShowImageModelsDropdown(false);
              setShowVideoModelsDropdown(false);
              setShowLanguageModelsDropdown(false);
            }}
            className="w-12 h-12 bg-transparent hover:bg-white text-white hover:text-black rounded-full transition-all hover:scale-105 flex items-center justify-center"
            title="Voice Models"
          >
            <Microphone size={20} />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Voice Models
          </div>

          {/* Voice Models Dropdown */}
          {showVoiceModelsDropdown && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl p-2 min-w-[320px] z-50">
              <div className="space-y-1">
                {Object.entries(getVoiceModels()).map(([modelId, config]) => (
                  <button
                    key={modelId}
                    onClick={() => addModelNode(modelId, config.name)}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <div className="font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate Execute Button Component
export const ExecuteButton = ({ executeFlow, isExecuting }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform translate-x-60 z-50">
      <div className="relative group">
        <button
          onClick={executeFlow}
          disabled={isExecuting}
          className={`h-12 w-12 rounded-lg transition-all hover:scale-105 flex items-center justify-center shadow-lg ${
            isExecuting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          {isExecuting ? (
            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          ) : (
            <Play size={20} />
          )}
        </button>
        {!isExecuting && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Run Flow
          </div>
        )}
      </div>
    </div>
  );
};

// Board Name Component with Export/Import and History
export const BoardName = ({ boardName, onBoardNameChange, exportFlow, onImportFlow, showHistory, setShowHistory, history, getSavedWorkflows, loadSavedWorkflow, createNewBoard, deleteSavedWorkflow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(boardName || 'Untitled Flow');
  const [showWorkflowsDropdown, setShowWorkflowsDropdown] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update editValue when boardName prop changes
  useEffect(() => {
    setEditValue(boardName || 'Untitled Flow');
  }, [boardName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Load saved workflows when dropdown is opened
  useEffect(() => {
    if (showWorkflowsDropdown && getSavedWorkflows) {
      const workflows = getSavedWorkflows();
      setSavedWorkflows(workflows);
    }
  }, [showWorkflowsDropdown, getSavedWorkflows]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWorkflowsDropdown(false);
      }
    };

    if (showWorkflowsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showWorkflowsDropdown]);

  const handleSave = () => {
    const newName = editValue.trim() || 'Untitled Flow';
    onBoardNameChange?.(newName);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(boardName || 'Untitled Flow');
      setIsEditing(false);
    }
  };

  const handleWorkflowSelect = (workflow) => {
    if (loadSavedWorkflow) {
      loadSavedWorkflow(workflow.data);
    }
    setShowWorkflowsDropdown(false);
  };

  const handleDeleteWorkflow = (workflow, event) => {
    // Prevent the workflow from being loaded when delete is clicked
    event.stopPropagation();
    
    // Set workflow to delete and show confirmation modal
    setWorkflowToDelete(workflow);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteWorkflow = () => {
    if (workflowToDelete && deleteSavedWorkflow) {
      deleteSavedWorkflow(workflowToDelete.key);
      // Refresh the workflows list
      if (getSavedWorkflows) {
        const workflows = getSavedWorkflows();
        setSavedWorkflows(workflows);
      }
    }
    setWorkflowToDelete(null);
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg flex items-center" ref={dropdownRef}>
        {/* Logo Section - Clickable for Saved Workflows */}
        <div className="relative">
          <button
            onClick={() => setShowWorkflowsDropdown(!showWorkflowsDropdown)}
            className="px-3 py-2 hover:bg-gray-700 rounded-l-lg transition-colors"
            title="View saved workflows"
          >
            <DrawPolygon size={24} className="text-white transform -rotate-90" />
          </button>

          {/* Saved Workflows Dropdown */}
          {showWorkflowsDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[60] max-h-80 overflow-y-auto">
              <div className="py-1">
                {/* Create New Board Option */}
                <button
                  onClick={() => {
                    createNewBoard();
                    setShowWorkflowsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors text-green-400 border-b border-gray-600"
                >
                  <div className="text-sm font-medium">+ Create New Board</div>
                </button>
                
                {/* Saved Workflows */}
                {savedWorkflows.length === 0 ? (
                  <div className="p-3 text-gray-400 text-sm text-center">
                    No saved workflows
                  </div>
                ) : (
                  <>
                    {savedWorkflows.map((workflow) => {
                      const isCurrentWorkflow = workflow.name === boardName;
                      
                      return (
                        <div
                          key={workflow.key}
                          className={`flex items-center justify-between group hover:bg-gray-700 transition-colors ${
                            isCurrentWorkflow ? 'bg-blue-900/30 text-blue-300' : 'text-white'
                          }`}
                        >
                          <button
                            onClick={() => handleWorkflowSelect(workflow)}
                            className="flex-1 text-left px-3 py-2 truncate"
                            disabled={isCurrentWorkflow}
                          >
                            <div className="text-sm truncate">
                              {workflow.name}
                              {isCurrentWorkflow && <span className="ml-2 text-xs opacity-75">✓</span>}
                            </div>
                          </button>
                          
                          {/* Delete Button */}
                          {!isCurrentWorkflow && (
                            <button
                              onClick={(e) => handleDeleteWorkflow(workflow, e)}
                              className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mr-1"
                              title={`Delete "${workflow.name}"`}
                            >
                              <Trash size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600"></div>

        {/* Board Name Section */}
        <div className="px-4 py-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="bg-transparent text-white font-semibold text-sm outline-none border-none min-w-[200px]"
            />
          ) : (
            <h1 
              className="text-white font-semibold text-sm cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => setIsEditing(true)}
              title="Click to edit board name"
            >
              {boardName || 'Untitled Flow'}
            </h1>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600"></div>

        {/* Export/Import Buttons */}
        <div className="flex items-center px-3 py-2 gap-2">
          {/* Export Button */}
          <div className="relative group">
            <button
              onClick={exportFlow}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all"
              title="Export Flow"
            >
              <Download size={16} />
            </button>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
              Export Flow
            </div>
          </div>

          {/* Import Button */}
          <div className="relative group">
            <button
              onClick={onImportFlow}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all"
              title="Import Flow"
            >
              <Upload size={16} />
            </button>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
              Import Flow
            </div>
          </div>

        </div>


        {/* Another Separator */}
        <div className="w-px h-6 bg-gray-600"></div>

        {/* History Button */}
        <div className="flex items-center px-3 py-2">
          <div className="relative group">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all flex items-center gap-2"
              title={`History (${history?.length || 0} generations)`}
            >
              <ClockClockwise size={16} />
              {history && history.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
              History
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Workflow Deletion */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setWorkflowToDelete(null);
        }}
        onConfirm={confirmDeleteWorkflow}
        title="Delete Workflow"
        message={workflowToDelete ? `Are you sure you want to delete "${workflowToDelete.name}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

// Context Menu Component
export const ContextMenu = ({ x, y, flowPosition, onClose, addNodeFromMenu, addModelNode }) => {
  const [showImageModels, setShowImageModels] = useState(false);
  const [showVideoModels, setShowVideoModels] = useState(false);
  const [showLanguageModels, setShowLanguageModels] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.context-menu')) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAddNode = (type, modelId = null, modelName = null) => {
    if (modelId) {
      addModelNode(modelId, modelName, flowPosition);
    } else {
      addNodeFromMenu(type, flowPosition);
    }
    onClose();
  };

  return (
    <div 
      className="context-menu fixed bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-[9999] min-w-48"
      style={{ left: x, top: y }}
    >
      {/* Organization Nodes */}
      <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">Organization</div>
      <button
        onClick={() => handleAddNode('organizationBox')}
        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
      >
        <Box size={16} />
        Rectangle
      </button>
      
      <div className="border-t border-gray-700 my-1"></div>

      {/* Input Nodes */}
      <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">Inputs</div>
      <button
        onClick={() => handleAddNode('textInput')}
        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
      >
        <Pencil size={16} />
        Prompt Text
      </button>
      <button
        onClick={() => handleAddNode('imageInput')}
        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
      >
        <Image size={16} />
        Upload Image
      </button>

      <div className="border-t border-gray-700 my-1"></div>

      {/* Model Categories */}
      <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">Models</div>
      
      {/* Image Models */}
      <div 
        className="relative"
        onMouseEnter={() => setShowImageModels(true)}
        onMouseLeave={() => setShowImageModels(false)}
      >
        <button
          className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
        >
          <Camera size={16} />
          Image Models
          <div className="ml-auto text-gray-500">›</div>
        </button>
        {showImageModels && (
          <div className="absolute left-full top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-64 z-[10000]">
            <button
              onClick={() => handleAddNode('model', 'black-forest-labs/flux-schnell', 'Flux Schnell')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['black-forest-labs/flux-schnell'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['black-forest-labs/flux-schnell'].description}</div>
            </button>
            <button
              onClick={() => handleAddNode('model', 'black-forest-labs/flux-kontext-max', 'Flux Kontext')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['black-forest-labs/flux-kontext-max'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['black-forest-labs/flux-kontext-max'].description}</div>
            </button>
            <button
              onClick={() => handleAddNode('model', 'google/nano-banana', 'Nano Banana')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['google/nano-banana'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['google/nano-banana'].description}</div>
            </button>
          </div>
        )}
      </div>

      {/* Video Models */}
      <div 
        className="relative"
        onMouseEnter={() => setShowVideoModels(true)}
        onMouseLeave={() => setShowVideoModels(false)}
      >
        <button
          className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
        >
          <FilmReel size={16} />
          Video Models
          <div className="ml-auto text-gray-500">›</div>
        </button>
        {showVideoModels && (
          <div className="absolute left-full top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-64 z-[10000]">
            <button
              onClick={() => handleAddNode('model', 'wan-video/wan-2.2-5b-fast', 'WAN Video')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['wan-video/wan-2.2-5b-fast'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['wan-video/wan-2.2-5b-fast'].description}</div>
            </button>
            <button
              onClick={() => handleAddNode('model', 'bytedance/seedance-1-lite', 'Seedance Lite')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['bytedance/seedance-1-lite'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['bytedance/seedance-1-lite'].description}</div>
            </button>
            <button
              onClick={() => handleAddNode('model', 'bytedance/seedance-1-pro', 'Seedance Pro')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['bytedance/seedance-1-pro'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['bytedance/seedance-1-pro'].description}</div>
            </button>
          </div>
        )}
      </div>

      {/* Language Models */}
      <div 
        className="relative"
        onMouseEnter={() => setShowLanguageModels(true)}
        onMouseLeave={() => setShowLanguageModels(false)}
      >
        <button
          className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
        >
          <Brain size={16} />
          Language Models
          <div className="ml-auto text-gray-500">›</div>
        </button>
        {showLanguageModels && (
          <div className="absolute left-full top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-64 z-[10000]">
            <button
              onClick={() => handleAddNode('model', 'openai/gpt-4o', 'GPT-4o')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['openai/gpt-4o'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['openai/gpt-4o'].description}</div>
            </button>
            <button
              onClick={() => handleAddNode('model', 'openai/gpt-5', 'GPT-5')}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
            >
              <div className="font-medium">{MODELS_CONFIG['openai/gpt-5'].name}</div>
              <div className="text-xs text-gray-400">{MODELS_CONFIG['openai/gpt-5'].description}</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Import Modal Component
export const ImportModal = ({ showImportModal, setShowImportModal, onImportFlow }) => {
  const [importData, setImportData] = useState('');
  const [importMethod, setImportMethod] = useState('paste'); // 'paste' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImport = () => {
    if (importMethod === 'paste' && importData.trim()) {
      try {
        const flowData = JSON.parse(importData.trim());
        onImportFlow(flowData);
        setShowImportModal(false);
        setImportData('');
      } catch (error) {
        alert('Invalid JSON data. Please check your input and try again.');
      }
    } else if (importMethod === 'file' && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target.result);
          onImportFlow(flowData);
          setShowImportModal(false);
          setSelectedFile(null);
        } catch (error) {
          alert('Invalid JSON file. Please check the file format and try again.');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  if (!showImportModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96 max-w-[90vw]">
        <h2 className="text-white text-lg font-semibold mb-4">Import Flow</h2>
        
        {/* Method Selection */}
        <div className="mb-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                value="paste"
                checked={importMethod === 'paste'}
                onChange={(e) => setImportMethod(e.target.value)}
                className="text-blue-500"
              />
              Paste JSON Data
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                value="file"
                checked={importMethod === 'file'}
                onChange={(e) => setImportMethod(e.target.value)}
                className="text-blue-500"
              />
              Upload File
            </label>
          </div>
        </div>

        {/* Paste Method */}
        {importMethod === 'paste' && (
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">JSON Data:</label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your flow JSON data here..."
              className="w-full h-32 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm resize-none"
            />
          </div>
        )}

        {/* File Method */}
        {importMethod === 'file' && (
          <div className="mb-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelection}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
            {selectedFile && (
              <p className="text-gray-400 text-xs mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowImportModal(false);
              setImportData('');
              setSelectedFile(null);
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
          {importMethod === 'paste' && (
            <button
              onClick={handleImport}
              disabled={!importData.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Import
            </button>
          )}
          {importMethod === 'file' && (
            <button
              onClick={handleImport}
              disabled={!selectedFile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Import
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Templates Panel Component - Draggable window with simple list
export const TemplatesPanel = ({ showTemplatesPanel, setShowTemplatesPanel, onLoadTemplate }) => {
  const [position, setPosition] = useState(() => {
    // Calculate center-right position safely
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return { x: windowWidth - 370, y: 200 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Flatten all templates into a single list
  const allTemplates = Object.keys(FLOW_TEMPLATES).reduce((acc, categoryName) => {
    const templates = FLOW_TEMPLATES[categoryName];
    Object.keys(templates).forEach(templateName => {
      acc.push({
        name: templateName,
        categoryName: categoryName,
        template: templates[templateName]
      });
    });
    return acc;
  }, []);

  const handleLoadTemplate = (categoryName, templateName) => {
    const template = FLOW_TEMPLATES[categoryName][templateName];
    if (template && onLoadTemplate) {
      onLoadTemplate(template.flow);
    }
  };

  const togglePanel = () => {
    setShowTemplatesPanel(!showTemplatesPanel);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div 
      className="fixed z-40 bg-gray-900 border-2 border-gray-600 rounded-lg shadow-2xl select-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: '320px',
        minHeight: 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Title Bar - Draggable */}
      <div className="drag-handle flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600 rounded-t-lg cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-white">
            Templates
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={togglePanel}
            className="w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs flex items-center justify-center transition-colors"
          >
            {showTemplatesPanel ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Window Content - Simple List */}
      {showTemplatesPanel && (
        <div className="bg-gray-900">
          {allTemplates.map((item) => (
            <button
              key={`${item.categoryName}-${item.name}`}
              onClick={() => handleLoadTemplate(item.categoryName, item.name)}
              className="w-full text-left px-3 py-1.5 text-white hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors"
            >
              <span className="text-sm font-mono tracking-wide">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Restoration Modal Component - Ask user if they want to restore saved workflow
export const RestorationModal = ({ showRestorationModal, setShowRestorationModal, savedWorkflowData, onRestore, onStartFresh }) => {
  if (!showRestorationModal || !savedWorkflowData) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <>
      {/* Blur overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[10000]" />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[10001] pointer-events-none">
        <div className="bg-gray-800 border border-gray-700 rounded-lg w-[500px] max-w-[90vw] pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-white text-xl font-semibold mb-2">Restore Previous Work?</h2>
            <p className="text-gray-400 text-sm">
              We found a saved version of "<span className="text-white font-medium">{savedWorkflowData.name || savedWorkflowData.boardName}</span>".
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6">
              <div className="text-white text-sm font-medium mb-2">Saved Workflow Details:</div>
              <div className="space-y-2 text-xs text-gray-400">
                <div>
                  <span className="text-gray-300">Last saved:</span> {formatDate(savedWorkflowData.lastSaved)}
                </div>
                <div>
                  <span className="text-gray-300">Nodes:</span> {savedWorkflowData.nodes?.length || 0}
                </div>
                <div>
                  <span className="text-gray-300">Connections:</span> {savedWorkflowData.edges?.length || 0}
                </div>
                {savedWorkflowData.version && (
                  <div>
                    <span className="text-gray-300">Version:</span> {savedWorkflowData.version}
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-400 text-sm mb-6">
              Would you like to restore this saved version, or start with a fresh workflow?
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  onStartFresh();
                  setShowRestorationModal(false);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Don't Restore
              </button>
              <button
                onClick={() => {
                  onRestore(savedWorkflowData);
                  setShowRestorationModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
              >
                Restore Saved Work
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Auto-save indicator component
export const AutoSaveIndicator = ({ isAutoSaving }) => {
  if (!isAutoSaving) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="text-gray-400 px-2 py-1 flex items-center gap-2">
        <div className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></div>
        <span className="text-xs">Auto saving...</span>
      </div>
    </div>
  );
};

// Restore Indicator Component - Shows when a workflow has been automatically restored
export const RestoreIndicator = ({ restoreIndicator, onUndo, onDismiss }) => {
  if (!restoreIndicator?.restored) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-2xl max-w-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-green-400 text-sm font-medium mb-1 flex items-center gap-2">
              <ClockClockwise size={14} />
              Restored from {formatDate(restoreIndicator.restoreTime)}
            </div>
            <div className="text-gray-300 text-xs mb-3">
              "{restoreIndicator.workflowName}"
            </div>
            <div className="flex gap-2">
              <button
                onClick={onUndo}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                Undo
              </button>
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export { ErrorModal };
