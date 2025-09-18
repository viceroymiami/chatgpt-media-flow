import React from 'react';
import { CreditCard, Lock, Wifi, ExclamationTriangle, X, CheckCircle, Lightbulb } from './Icons';

// Error Modal Component
const ErrorModal = ({ showErrorModal, setShowErrorModal, errors, clearErrors }) => {
  if (!showErrorModal) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'balance': return <CreditCard size={20} />;
      case 'auth': return <Lock size={20} />;
      case 'network': return <Wifi size={20} />;
      case 'api': return <ExclamationTriangle size={20} />;
      default: return <X size={20} />;
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'balance': return 'border-yellow-500 bg-yellow-900/20';
      case 'auth': return 'border-blue-500 bg-blue-900/20';
      case 'network': return 'border-orange-500 bg-orange-900/20';
      case 'api': return 'border-red-500 bg-red-900/20';
      default: return 'border-red-500 bg-red-900/20';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-600 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ExclamationTriangle size={20} /> Error Notifications
          </h2>
          <div className="flex gap-2">
            {errors.length > 0 && (
              <button
                onClick={clearErrors}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded text-sm transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowErrorModal(false)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {errors.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2"><CheckCircle size={48} /></div>
              <p>No errors to display</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className={`p-3 rounded-lg border ${getErrorColor(error.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-xl">
                      {getErrorIcon(error.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {error.type} Error
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(error.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200 break-words">
                        {error.message}
                      </p>
                      {error.nodeId && (
                        <div className="mt-2 text-xs text-gray-400">
                          Node: {error.nodeId}
                        </div>
                      )}
                      
                      {/* Action suggestions based on error type */}
                      {error.type === 'balance' && (
                        <div className="mt-3 p-2 bg-yellow-900/30 rounded border border-yellow-600">
                          <div className="text-xs font-medium text-yellow-300 mb-1 flex items-center gap-1"><Lightbulb size={12} /> Suggested Actions:</div>
                          <div className="text-xs text-yellow-200">
                            • Check your credits balance<br/>
                            • Purchase additional credits<br/>
                            • Try a different model that uses fewer credits
                          </div>
                        </div>
                      )}
                      
                      {error.type === 'auth' && (
                        <div className="mt-3 p-2 bg-blue-900/30 rounded border border-blue-600">
                          <div className="text-xs font-medium text-blue-300 mb-1 flex items-center gap-1"><Lightbulb size={12} /> Suggested Actions:</div>
                          <div className="text-xs text-blue-200">
                            • Check your API key is correct<br/>
                            • Sign out and sign in again<br/>
                            • Verify your account permissions
                          </div>
                        </div>
                      )}
                      
                      {error.type === 'network' && (
                        <div className="mt-3 p-2 bg-orange-900/30 rounded border border-orange-600">
                          <div className="text-xs font-medium text-orange-300 mb-1 flex items-center gap-1"><Lightbulb size={12} /> Suggested Actions:</div>
                          <div className="text-xs text-orange-200">
                            • Check your internet connection<br/>
                            • Try again in a few moments<br/>
                            • Check if the service is experiencing issues
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-600 bg-gray-750">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              {errors.length > 0 && `${errors.length} error${errors.length !== 1 ? 's' : ''} logged`}
            </span>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;