import React from 'react';
import type { BestBetCollection } from '../services/bestBetsApi';

interface BestBetsTableProps {
  collections: BestBetCollection[];
  onEdit: (collection: BestBetCollection) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const BestBetsTable: React.FC<BestBetsTableProps> = ({ 
  collections, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  console.log('BestBetsTable received collections:', collections);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '256px',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '6px solid #e5e7eb',
          borderTop: '6px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{
          color: '#6b7280',
          fontWeight: '600',
          fontSize: '1.125rem',
          margin: 0
        }}>Loading collections...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '64px 32px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#f3f4f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          border: '3px solid #d1d5db'
        }}>
          <span style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#9ca3af'
          }}>C</span>
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 8px 0'
        }}>No collections found</h3>
        <p style={{
          color: '#6b7280',
          margin: '0 auto',
          maxWidth: '384px',
          fontSize: '1rem'
        }}>
          No best bet collections found. Create your first collection to get started managing your search results.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead style={{ backgroundColor: '#f9fafb' }}>
          <tr>
            <th style={{
              fontWeight: '700',
              color: '#111827',
              padding: '16px 24px',
              textAlign: 'left',
              fontSize: '1rem',
              borderBottom: '3px solid #e5e7eb'
            }}>Name</th>
            <th style={{
              fontWeight: '700',
              color: '#111827',
              padding: '16px 24px',
              textAlign: 'left',
              fontSize: '1rem',
              borderBottom: '3px solid #e5e7eb'
            }}>Description</th>
            <th style={{
              fontWeight: '700',
              color: '#111827',
              padding: '16px 24px',
              textAlign: 'left',
              fontSize: '1rem',
              borderBottom: '3px solid #e5e7eb'
            }}>Keywords</th>
            <th style={{
              fontWeight: '700',
              color: '#111827',
              padding: '16px 24px',
              textAlign: 'left',
              fontSize: '1rem',
              borderBottom: '3px solid #e5e7eb'
            }}>Status</th>
            <th style={{
              fontWeight: '700',
              color: '#111827',
              padding: '16px 24px',
              textAlign: 'left',
              fontSize: '1rem',
              borderBottom: '3px solid #e5e7eb'
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection, index) => (
            <tr key={collection.id} style={{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <td style={{
                fontWeight: '600',
                color: '#111827',
                padding: '16px 24px',
                fontSize: '1rem'
              }}>
                {collection.name}
              </td>
              <td style={{
                color: '#374151',
                padding: '16px 24px',
                maxWidth: '300px',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={collection.description}>
                  {collection.description || '-'}
                </div>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  maxWidth: '384px'
                }}>
                  {(collection.keywords || []).slice(0, 3).map((keyword, index) => (
                    <span key={index} style={{
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '16px',
                      fontWeight: '600',
                      border: '2px solid #93c5fd'
                    }}>
                      {keyword}
                    </span>
                  ))}
                  {(collection.keywords || []).length > 3 && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      borderRadius: '16px',
                      fontWeight: '700',
                      border: '2px solid #d1d5db'
                    }}>
                      +{(collection.keywords || []).length - 3} more
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  border: '3px solid',
                  backgroundColor: collection.isActive ? '#f0fdf4' : '#f3f4f6',
                  color: collection.isActive ? '#166534' : '#6b7280',
                  borderColor: collection.isActive ? '#22c55e' : '#d1d5db'
                }}>
                  {collection.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => onEdit(collection)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: '3px solid #1d4ed8',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                      transform: 'scale(1)',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => collection.id && onDelete(collection.id)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: '3px solid #dc2626',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                      transform: 'scale(1)',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};