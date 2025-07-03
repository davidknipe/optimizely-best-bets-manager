import { useState, useEffect } from 'react';
import { BestBetsTable } from './components/BestBetsTable';
import { BestBetForm } from './components/BestBetForm';
import { SettingsModal } from './components/SettingsModal';
import { BestBetsApiService } from './services/bestBetsApi';
import type { BestBetCollection } from './services/bestBetsApi';
import type { GraphCredentials } from './utils/auth';
import { loadCredentials } from './utils/auth';

function App() {
  const [collections, setCollections] = useState<BestBetCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<BestBetCollection | undefined>();
  
  const [apiService, setApiService] = useState<BestBetsApiService | null>(null);
  const [credentials, setCredentials] = useState<GraphCredentials | null>(null);

  useEffect(() => {
    const savedCredentials = loadCredentials();
    if (savedCredentials) {
      setCredentials(savedCredentials);
      setApiService(new BestBetsApiService(savedCredentials));
    }
  }, []);

  useEffect(() => {
    if (apiService) {
      fetchCollections();
    }
  }, [apiService]);

  const fetchCollections = async () => {
    if (!apiService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAllCollections();
      console.log('App received collections response:', response);
      console.log('Setting collections to:', response.collections || []);
      setCollections(response.collections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = (newCredentials: GraphCredentials) => {
    setCredentials(newCredentials);
    setApiService(new BestBetsApiService(newCredentials));
    setSuccess('Credentials saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCreateCollection = async (collection: Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!apiService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await apiService.createCollection(collection);
      setSuccess('Collection created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCollection = async (collection: Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!apiService || !editingCollection?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await apiService.updateCollection(editingCollection.id, collection);
      setSuccess('Collection updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update collection');
    } finally {
      setLoading(false);
      setEditingCollection(undefined);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!apiService || !confirm('Are you sure you want to delete this collection?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deleteCollection(id);
      setSuccess('Collection deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete collection');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCollection = (collection: BestBetCollection) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCollection(undefined);
  };

  const handleFormSave = async (collection: Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCollection) {
      await handleUpdateCollection(collection);
    } else {
      await handleCreateCollection(collection);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        borderBottom: '4px solid #3b82f6',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 48px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Optimizely Best Bets Manager
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#374151',
                margin: 0
              }}>
                Manage your search best bets collections
              </p>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  padding: '16px 40px',
                  backgroundColor: '#1f2937',
                  color: '#ffffff',
                  border: '3px solid #111827',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#111827';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#1f2937';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
              >
                Settings
              </button>
              {apiService && (
                <button 
                  onClick={() => setIsFormOpen(true)}
                  style={{
                    padding: '16px 40px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: '3px solid #1d4ed8',
                    borderRadius: '12px',
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  + New Collection
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '48px 64px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        {/* Alerts */}
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {error && (
            <div style={{
              padding: '24px',
              backgroundColor: '#fef2f2',
              borderLeft: '8px solid #ef4444',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                color: '#991b1b',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Error: {error}
              </div>
            </div>
          )}
          
          {success && (
            <div style={{
              padding: '24px',
              backgroundColor: '#f0fdf4',
              borderLeft: '8px solid #22c55e',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                color: '#166534',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                {success}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          width: '100%'
        }}>
          {!credentials ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '64px',
              textAlign: 'center',
              maxWidth: '512px',
              margin: '0 auto',
              border: '4px solid #dbeafe'
            }}>
              <div style={{ marginBottom: '48px' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#1d4ed8'
                  }}>S</span>
                </div>
                <h2 style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 24px 0'
                }}>Welcome to Best Bets Manager</h2>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#374151',
                  lineHeight: '1.75',
                  margin: 0
                }}>
                  Please configure your Optimizely Graph credentials to get started managing your best bet collections.
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  padding: '20px 48px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: '4px solid #1d4ed8',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.boxShadow = '0 35px 60px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
              >
                Configure Settings
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '4px solid #e5e7eb'
            }}>
              <div style={{ padding: '48px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '48px'
                }}>
                  <div>
                    <h2 style={{
                      fontSize: '3rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0 0 12px 0'
                    }}>Best Bet Collections</h2>
                    <p style={{
                      fontSize: '1.125rem',
                      color: '#374151',
                      margin: 0
                    }}>Manage and organize your search best bets</p>
                  </div>
                  <button 
                    onClick={fetchCollections} 
                    disabled={loading}
                    style={{
                      padding: '16px 40px',
                      backgroundColor: loading ? '#9ca3af' : '#1f2937',
                      color: '#ffffff',
                      border: '4px solid #111827',
                      borderRadius: '12px',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                      transform: 'scale(1)',
                      opacity: loading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = '#111827';
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#1f2937';
                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
                
                <div style={{
                  border: '4px solid #d1d5db',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <BestBetsTable
                    collections={collections}
                    onEdit={handleEditCollection}
                    onDelete={handleDeleteCollection}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveCredentials}
      />

      <BestBetForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={editingCollection}
        title={editingCollection ? 'Edit Collection' : 'Create New Collection'}
      />
    </div>
  );
}

export default App