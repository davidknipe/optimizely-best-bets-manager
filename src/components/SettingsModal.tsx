import React, { useState, useEffect } from 'react';
import { saveCredentials, loadCredentials } from '../utils/auth';
import { BestBetsApiService } from '../services/bestBetsApi';
import type { GraphCredentials } from '../utils/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credentials: GraphCredentials) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [credentials, setCredentials] = useState<GraphCredentials>({
    accessKey: '',
    secretKey: '',
    endpoint: 'https://cg.optimizely.com'
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedCredentials = loadCredentials();
      if (savedCredentials) {
        setCredentials(savedCredentials);
      }
      // Reset test result when modal opens
      setConnectionTestResult(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (credentials.accessKey && credentials.secretKey) {
      saveCredentials(credentials);
      onSave(credentials);
      onClose();
    }
  };

  const handleInputChange = (field: keyof GraphCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset test result when credentials change
    setConnectionTestResult(null);
  };

  const testConnection = async () => {
    if (!credentials.accessKey || !credentials.secretKey) {
      setConnectionTestResult({
        success: false,
        message: 'Please enter both access key and secret key before testing the connection.',
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      const apiService = new BestBetsApiService(credentials);
      
      // Test the connection by trying to fetch collections
      const startTime = Date.now();
      const response = await apiService.getAllCollections();
      const endTime = Date.now();
      
      setConnectionTestResult({
        success: true,
        message: `Connection successful! (${endTime - startTime}ms)`,
        details: {
          timestamp: new Date().toISOString(),
          responseTime: `${endTime - startTime}ms`,
          endpoint: credentials.endpoint,
          collectionsFound: response.collections?.length || 0,
        }
      });
    } catch (error) {
      console.error('Connection test failed:', error);
      
      let errorMessage = 'Connection failed';
      let errorDetails: any = {
        timestamp: new Date().toISOString(),
        endpoint: credentials.endpoint,
      };

      if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails.errorName = error.name;
        errorDetails.errorMessage = error.message;
        errorDetails.stack = error.stack;
      }

      // Check for specific error types
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to reach the endpoint';
        errorDetails.possibleCauses = [
          'Invalid endpoint URL',
          'Network connectivity issues',
          'CORS policy blocking the request',
          'Endpoint is not accessible'
        ];
      } else if (errorMessage.includes('HTTP 401')) {
        errorMessage = 'Authentication failed: Invalid credentials';
        errorDetails.possibleCauses = [
          'Invalid access key',
          'Invalid secret key',
          'Credentials may be expired',
          'Account may not have API access enabled'
        ];
      } else if (errorMessage.includes('HTTP 403')) {
        errorMessage = 'Access denied: Insufficient permissions';
        errorDetails.possibleCauses = [
          'Access key does not have required permissions',
          'Account may be suspended',
          'API access may be restricted'
        ];
      } else if (errorMessage.includes('HTTP 404')) {
        errorMessage = 'API endpoint not found';
        errorDetails.possibleCauses = [
          'Incorrect endpoint URL',
          'API version mismatch',
          'Service may be unavailable'
        ];
      }

      setConnectionTestResult({
        success: false,
        message: errorMessage,
        details: errorDetails
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '4px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: '3px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #3b82f6'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1d4ed8'
              }}>S</span>
            </div>
            <div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>Optimizely Graph Settings</h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0
              }}>Configure your API credentials (using Basic authentication)</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Access Key
            </label>
            <input
              type="text"
              value={credentials.accessKey}
              onChange={(e) => handleInputChange('accessKey', e.target.value)}
              placeholder="Enter your access key"
              style={{
                width: '100%',
                padding: '16px',
                border: '3px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Secret Key
            </label>
            <input
              type="password"
              value={credentials.secretKey}
              onChange={(e) => handleInputChange('secretKey', e.target.value)}
              placeholder="Enter your secret key"
              style={{
                width: '100%',
                padding: '16px',
                border: '3px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Endpoint
            </label>
            <input
              type="text"
              value={credentials.endpoint}
              onChange={(e) => handleInputChange('endpoint', e.target.value)}
              placeholder="https://prod.cg.optimizely.com"
              style={{
                width: '100%',
                padding: '16px',
                border: '3px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Test Connection Section */}
          <div style={{
            paddingTop: '24px',
            borderTop: '3px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Connection Test
            </div>
            
            <button 
              onClick={testConnection}
              disabled={isTestingConnection || !credentials.accessKey || !credentials.secretKey}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: isTestingConnection || !credentials.accessKey || !credentials.secretKey ? '#9ca3af' : '#3b82f6',
                color: '#ffffff',
                border: '3px solid #1d4ed8',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isTestingConnection || !credentials.accessKey || !credentials.secretKey ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                transform: 'scale(1)',
                opacity: isTestingConnection || !credentials.accessKey || !credentials.secretKey ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isTestingConnection && credentials.accessKey && credentials.secretKey) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isTestingConnection && credentials.accessKey && credentials.secretKey) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              {isTestingConnection ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid #ffffff',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Testing Connection...
                </span>
              ) : (
                'Test Connection'
              )}
            </button>
            
            {connectionTestResult && (
              <div style={{
                border: `4px solid ${connectionTestResult.success ? '#22c55e' : '#ef4444'}`,
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: connectionTestResult.success ? '#f0fdf4' : '#fef2f2'
              }}>
                <div style={{
                  color: connectionTestResult.success ? '#166534' : '#991b1b',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  marginBottom: '16px'
                }}>
                  {connectionTestResult.message}
                </div>
                {connectionTestResult.details && (
                  <details style={{ fontSize: '0.875rem' }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontWeight: '600',
                      padding: '8px 0',
                      color: '#374151'
                    }}>
                      {connectionTestResult.success ? 'Connection Details' : 'Error Details'}
                    </summary>
                    <div style={{
                      marginTop: '12px',
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '8px',
                      border: '2px solid #d1d5db'
                    }}>
                      <pre style={{
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: '128px',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        margin: 0
                      }}>
                        {JSON.stringify(connectionTestResult.details, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          padding: '32px',
          borderTop: '3px solid #e5e7eb'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '16px 32px',
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: '3px solid #4b5563',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#6b7280';
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!credentials.accessKey || !credentials.secretKey}
            style={{
              padding: '16px 32px',
              backgroundColor: !credentials.accessKey || !credentials.secretKey ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: '3px solid #1d4ed8',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: !credentials.accessKey || !credentials.secretKey ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              transform: 'scale(1)',
              opacity: !credentials.accessKey || !credentials.secretKey ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (credentials.accessKey && credentials.secretKey) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (credentials.accessKey && credentials.secretKey) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};