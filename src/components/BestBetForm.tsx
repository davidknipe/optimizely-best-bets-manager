import React, { useState, useEffect } from 'react';
import type { BestBetCollection } from '../services/bestBetsApi';

interface BestBetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: BestBetCollection;
  title: string;
}

export const BestBetForm: React.FC<BestBetFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  title 
}) => {
  const [formData, setFormData] = useState<Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    keywords: [],
    urls: [],
    isActive: true
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        keywords: initialData.keywords,
        urls: initialData.urls,
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        keywords: [],
        urls: [],
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addUrl = () => {
    if (urlInput.trim() && !formData.urls.includes(urlInput.trim())) {
      setFormData(prev => ({
        ...prev,
        urls: [...prev.urls, urlInput.trim()]
      }));
      setUrlInput('');
    }
  };

  const removeUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter(u => u !== url)
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.keywords.length > 0 && formData.urls.length > 0) {
      onSave(formData);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
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
        maxWidth: '800px',
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
              backgroundColor: '#f3e8ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #8b5cf6'
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#7c3aed'
              }}>F</span>
            </div>
            <div>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>{title}</h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0
              }}>Configure your best bet collection</p>
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
          {/* Name and Active Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'start'
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
                Collection Name *
              </label>
              <input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter collection name"
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
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Status
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => handleInputChange('isActive', !formData.isActive)}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '32px',
                    borderRadius: '16px',
                    border: '3px solid',
                    borderColor: formData.isActive ? '#22c55e' : '#d1d5db',
                    backgroundColor: formData.isActive ? '#22c55e' : '#e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: formData.isActive ? '30px' : '2px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    border: '2px solid #d1d5db'
                  }} />
                </button>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: formData.isActive ? '#166534' : '#6b7280'
                }}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                textAlign: 'center',
                margin: 0,
                maxWidth: '150px'
              }}>
                {formData.isActive 
                  ? 'Collection will be used in search results' 
                  : 'Collection will not affect search results'
                }
              </p>
            </div>
          </div>

          {/* Description */}
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter collection description"
              rows={3}
              style={{
                width: '100%',
                padding: '16px',
                border: '3px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Keywords */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Keywords *
            </label>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              border: '3px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addKeyword)}
                  placeholder="Add keyword and press Enter"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '3px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button 
                  type="button" 
                  onClick={addKeyword}
                  disabled={!keywordInput.trim()}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: !keywordInput.trim() ? '#9ca3af' : '#8b5cf6',
                    color: '#ffffff',
                    border: '3px solid #7c3aed',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: !keywordInput.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                    transform: 'scale(1)',
                    outline: 'none',
                    opacity: !keywordInput.trim() ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (keywordInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.backgroundColor = '#7c3aed';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (keywordInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#8b5cf6';
                    }
                  }}
                >
                  + Add
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                minHeight: '60px',
                padding: '16px',
                backgroundColor: '#ffffff',
                border: '3px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                {formData.keywords.length === 0 ? (
                  <span style={{
                    color: '#9ca3af',
                    fontSize: '1rem',
                    fontStyle: 'italic'
                  }}>No keywords added yet...</span>
                ) : (
                  formData.keywords.map((keyword, index) => (
                    <span key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      border: '2px solid #c4b5fd'
                    }}>
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          padding: '0',
                          margin: '0',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* URLs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              URLs *
            </label>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              border: '3px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addUrl)}
                  placeholder="Add URL and press Enter"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '3px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <button 
                  type="button" 
                  onClick={addUrl}
                  disabled={!urlInput.trim()}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: !urlInput.trim() ? '#9ca3af' : '#8b5cf6',
                    color: '#ffffff',
                    border: '3px solid #7c3aed',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: !urlInput.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                    transform: 'scale(1)',
                    outline: 'none',
                    opacity: !urlInput.trim() ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (urlInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.backgroundColor = '#7c3aed';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (urlInput.trim()) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#8b5cf6';
                    }
                  }}
                >
                  + Add
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '60px',
                padding: '16px',
                backgroundColor: '#ffffff',
                border: '3px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                {formData.urls.length === 0 ? (
                  <span style={{
                    color: '#9ca3af',
                    fontSize: '1rem',
                    fontStyle: 'italic'
                  }}>No URLs added yet...</span>
                ) : (
                  formData.urls.map((url, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#eff6ff',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #93c5fd'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#1d4ed8',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        marginRight: '12px'
                      }}>{url}</span>
                      <button
                        type="button"
                        onClick={() => removeUrl(url)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          padding: '4px 8px',
                          margin: '0',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
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
              transform: 'scale(1)',
              outline: 'none'
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
            disabled={!formData.name || formData.keywords.length === 0 || formData.urls.length === 0}
            style={{
              padding: '16px 32px',
              backgroundColor: (!formData.name || formData.keywords.length === 0 || formData.urls.length === 0) ? '#9ca3af' : '#8b5cf6',
              color: '#ffffff',
              border: '3px solid #7c3aed',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: (!formData.name || formData.keywords.length === 0 || formData.urls.length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              transform: 'scale(1)',
              outline: 'none',
              opacity: (!formData.name || formData.keywords.length === 0 || formData.urls.length === 0) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (formData.name && formData.keywords.length > 0 && formData.urls.length > 0) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#7c3aed';
              }
            }}
            onMouseLeave={(e) => {
              if (formData.name && formData.keywords.length > 0 && formData.urls.length > 0) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};