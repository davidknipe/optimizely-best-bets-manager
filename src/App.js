import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit3, Trash2, Search, X, AlertCircle } from 'lucide-react';

// Embedded styles
const styles = `
  .min-h-screen { min-height: 100vh; }
  .max-w-7xl { max-width: 80rem; }
  .max-w-md { max-width: 28rem; }
  .max-w-full { max-width: 100%; }
  .max-h-96 { max-height: 24rem; }
  .w-full { width: 100%; }
  .w-96 { width: 24rem; }
  .w-4 { width: 1rem; }
  .w-2 { width: 0.5rem; }
  .h-4 { height: 1rem; }
  .h-2 { height: 0.5rem; }

  .flex { display: flex; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .justify-end { justify-content: flex-end; }
  .flex-1 { flex: 1 1 0%; }

  .grid { display: grid; }
  .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  .col-span-4 { grid-column: span 4 / span 4; }
  .col-span-8 { grid-column: span 8 / span 8; }

  .mx-auto { margin-left: auto; margin-right: auto; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-4 { margin-top: 1rem; }
  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  .ml-2 { margin-left: 0.5rem; }

  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .pt-4 { padding-top: 1rem; }

  .space-x-1 > * + * { margin-left: 0.25rem; }
  .space-x-2 > * + * { margin-left: 0.5rem; }
  .space-x-3 > * + * { margin-left: 0.75rem; }
  .space-y-1 > * + * { margin-top: 0.25rem; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .gap-6 { gap: 1.5rem; }

  .bg-gray-50 { background-color: #f9fafb; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .bg-white { background-color: #ffffff; }
  .bg-black { background-color: #000000; }
  .bg-blue-50 { background-color: #eff6ff; }
  .bg-blue-100 { background-color: #dbeafe; }
  .bg-blue-600 { background-color: #2563eb; }
  .bg-blue-700 { background-color: #1d4ed8; }
  .bg-amber-50 { background-color: #fffbeb; }
  .bg-amber-100 { background-color: #fef3c7; }
  .bg-amber-600 { background-color: #d97706; }
  .bg-amber-700 { background-color: #b45309; }
  .bg-green-100 { background-color: #dcfce7; }
  .bg-green-500 { background-color: #22c55e; }
  .bg-red-50 { background-color: #fef2f2; }
  .bg-gray-400 { background-color: #9ca3af; }
  .bg-gray-300 { background-color: #d1d5db; }
  .bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }

  .text-gray-300 { color: #d1d5db; }
  .text-gray-400 { color: #9ca3af; }
  .text-gray-500 { color: #6b7280; }
  .text-gray-600 { color: #4b5563; }
  .text-gray-700 { color: #374151; }
  .text-gray-900 { color: #111827; }
  .text-white { color: #ffffff; }
  .text-blue-600 { color: #2563eb; }
  .text-blue-800 { color: #1e40af; }
  .text-amber-800 { color: #92400e; }
  .text-green-800 { color: #166534; }
  .text-red-500 { color: #ef4444; }
  .text-red-700 { color: #b91c1c; }

  .text-center { text-align: center; }
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }

  .border { border-width: 1px; border-style: solid; }
  .border-b { border-bottom-width: 1px; }
  .border-l-4 { border-left-width: 4px; }
  .border-gray-100 { border-color: #f3f4f6; }
  .border-gray-200 { border-color: #e5e7eb; }
  .border-gray-300 { border-color: #d1d5db; }
  .border-blue-600 { border-color: #2563eb; }
  .border-amber-200 { border-color: #fde68a; }
  .border-amber-300 { border-color: #fcd34d; }
  .border-green-300 { border-color: #86efac; }
  .border-red-200 { border-color: #fecaca; }

  .rounded { border-radius: 0.25rem; }
  .rounded-md { border-radius: 0.375rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-full { border-radius: 9999px; }

  .shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
  .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }

  .fixed { position: fixed; }
  .relative { position: relative; }
  .inset-0 { top: 0px; right: 0px; bottom: 0px; left: 0px; }
  .z-50 { z-index: 50; }

  .overflow-y-auto { overflow-y: auto; }
  .inline-block { display: inline-block; }
  .block { display: block; }
  .cursor-pointer { cursor: pointer; }
  .opacity-50 { opacity: 0.5; }

  button {
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease-in-out;
  }
  
  button:not([class*="border"]) {
    border: none;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
  .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
  .hover\\:bg-amber-700:hover { background-color: #b45309; }
  .hover\\:text-gray-600:hover { color: #4b5563; }
  .hover\\:text-red-600:hover { color: #dc2626; }
  .hover\\:text-red-700:hover { color: #b91c1c; }

  .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
  .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
  .focus\\:ring-blue-500:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }

  input[type="text"], input[type="url"], input[type="password"], input[type="number"] {
    appearance: none;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  input[type="text"]:focus, input[type="url"]:focus, input[type="password"]:focus, input[type="number"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    background-color: #ffffff;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin { animation: spin 1s linear infinite; }

  code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
  }

  @media (min-width: 640px) {
    .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  }

  @media (min-width: 1024px) {
    .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  }
`;

// Basic Authentication Helper (used by working application)
// The working application uses Basic auth, not HMAC

// API Client
class OptimizelyGraphClient {
  constructor(credentials, useMockData = false) {
    this.credentials = credentials;
    this.baseUrl = credentials?.gatewayUrl || 'https://latest.cg.optimizely.com';
    this.useMockData = useMockData;
  }

  async makeRequest(path, method = 'GET', body = null) {
    if (!this.credentials || !this.credentials.appKey || !this.credentials.secret) {
      throw new Error('Authentication credentials are required');
    }

    // Use mock data if explicitly requested
    if (this.useMockData) {
      return this.getMockData(path, method);
    }

    // Use Basic authentication (like the working application)
    const basicAuth = btoa(`${this.credentials.appKey}:${this.credentials.secret}`);
    
    const headers = {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    };

    const requestOptions = {
      method,
      headers,
    };

    // Only add body for non-GET requests and when body exists
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    console.log('Making request to:', `${this.baseUrl}${path}`);
    console.log('Auth header:', `Basic ${basicAuth}`);
    console.log('Request options:', requestOptions);

    const response = await fetch(`${this.baseUrl}${path}`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText, errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return { success: true };
    }
  }

  // Mock data for demonstration
  getMockData(path, method) {
    if (path === '/api/pinned/collections' && method === 'GET') {
      return Promise.resolve({
        collections: [
          { id: 'col-1', title: 'Product Promotions', isActive: true },
          { id: 'col-2', title: 'Featured Content', isActive: true },
          { id: 'col-3', title: 'Seasonal Campaigns', isActive: false }
        ]
      });
    }
    
    if (path.includes('/items') && method === 'GET') {
      return Promise.resolve({
        items: [
          {
            id: 'item-1',
            phrases: ['water', 'bottled water'],
            targetKey: 'e4c0b166-ce40-4620-b872-35af8d4fab22',
            language: 'en',
            priority: 1,
            isActive: true
          },
          {
            id: 'item-2',
            phrases: ['bread', 'sourdough'],
            targetKey: 'f5d1c277-df51-5731-c983-46bf9e5gac33',
            language: 'en',
            priority: 2,
            isActive: true
          }
        ]
      });
    }
    
    return Promise.resolve({ success: true });
  }

  // Collections API
  async getCollections() {
    return this.makeRequest('/api/pinned/collections');
  }

  async createCollection(collection) {
    return this.makeRequest('/api/pinned/collections', 'POST', collection);
  }

  async updateCollection(collectionId, collection) {
    return this.makeRequest(`/api/pinned/collections/${collectionId}`, 'PUT', collection);
  }

  async deleteCollection(collectionId) {
    return this.makeRequest(`/api/pinned/collections/${collectionId}`, 'DELETE');
  }

  // Items API
  async getCollectionItems(collectionId) {
    return this.makeRequest(`/api/pinned/collections/${collectionId}/items`);
  }

  async createItem(collectionId, item) {
    // Convert phrases array to comma-separated string as per API docs
    const apiItem = {
      phrases: Array.isArray(item.phrases) ? item.phrases.join(',') : item.phrases,
      targetKey: item.targetKey,
      language: item.language || null,
      priority: item.priority || 1000,
      isActive: item.isActive
    };
    return this.makeRequest(`/api/pinned/collections/${collectionId}/items`, 'POST', apiItem);
  }

  async updateItem(collectionId, itemId, item) {
    // Clean the item data and convert phrases array to comma-separated string
    const apiItem = {
      phrases: Array.isArray(item.phrases) ? item.phrases.join(',') : item.phrases,
      targetKey: item.targetKey,
      language: item.language || null,
      priority: item.priority || 1000,
      isActive: item.isActive
    };
    return this.makeRequest(`/api/pinned/collections/${collectionId}/items/${itemId}`, 'PUT', apiItem);
  }

  async deleteItem(collectionId, itemId) {
    return this.makeRequest(`/api/pinned/collections/${collectionId}/items/${itemId}`, 'DELETE');
  }
}

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, credentials, onSave }) => {
  const [formData, setFormData] = useState({
    gatewayUrl: 'https://latest.cg.optimizely.com',
    appKey: '',
    secret: '',
    ...credentials
  });

  const handleSave = () => {
    if (formData.appKey && formData.secret) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Graph Credentials</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gateway URL
            </label>
            <input
              type="url"
              value={formData.gatewayUrl}
              onChange={(e) => setFormData({...formData, gatewayUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://latest.cg.optimizely.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Key *
            </label>
            <input
              type="text"
              value={formData.appKey}
              onChange={(e) => setFormData({...formData, appKey: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your App Key"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret *
            </label>
            <input
              type="password"
              value={formData.secret}
              onChange={(e) => setFormData({...formData, secret: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Secret"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Collection Form Modal
const CollectionModal = ({ isOpen, onClose, collection, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    isActive: true,
    ...collection
  });

  // Update form data when collection prop changes
  useEffect(() => {
    if (collection) {
      // Editing mode - populate with collection data
      setFormData({
        title: collection.title || '',
        isActive: collection.isActive !== undefined ? collection.isActive : true
      });
    } else {
      // New collection mode - reset to defaults
      setFormData({
        title: '',
        isActive: true
      });
    }
  }, [collection]);

  const handleSave = () => {
    if (formData.title) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {collection ? 'Edit Collection' : 'New Collection'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Collection name"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {collection ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Search Modal
const ContentSearchModal = ({ isOpen, onClose, onSelectContent, credentials }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchContent = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    
    const query = `
        query MyContent($searchTerm: String!) {
          _Experience(where: { 
            _metadata: { 
              displayName: { 
                contains: $searchTerm 
              } 
            } 
          }) {
            items {
              _id
              ... on _Experience {
                _metadata {
                  displayName
                }
              }
            }
          }
          _Page(where: { 
            _metadata: { 
              displayName: { 
                contains: $searchTerm 
              } 
            } 
          }) {
            items {
              _id
              ... on _Page {
                _metadata {
                  displayName
                }
              }
            }
          }
        }
        `;

    try {
      const basicAuth = btoa(`${credentials.appKey}:${credentials.secret}`);
      const response = await fetch(`${credentials.gatewayUrl}/content/v2`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { searchTerm }
        })
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Combine results from both Experience and Page content types
      const allResults = [
        ...(result.data._Experience?.items || []).map(item => ({ ...item, type: 'Experience' })),
        ...(result.data._Page?.items || []).map(item => ({ ...item, type: 'Page' }))
      ];

      // Filter client-side for published content only (items ending with "_Published")
      const publishedResults = allResults.filter(item => item._id.endsWith('_Published'));

      setSearchResults(publishedResults);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchContent();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6" style={{ width: '80vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search Content</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter search term..."
            />
            <button
              onClick={searchContent}
              disabled={loading || !searchTerm.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {searchResults.length === 0 && !loading && hasSearched && (
            <div className="text-center text-gray-500 py-8">
              No content found for "{searchTerm}"
            </div>
          )}
          
          {searchResults.map((item) => {
            // Extract language from _id format: {guid}_{language}_{published state}
            const idParts = item._id.split('_');
            const language = idParts.length >= 2 ? idParts[idParts.length - 2] : 'unknown';
            
            return (
              <div
                key={item._id}
                className="p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  onSelectContent(item._id, item._metadata?.displayName || item._id);
                  onClose();
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item._metadata?.displayName || 'Untitled'}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <p className="text-sm text-gray-600">
                        Type: {item.type}
                      </p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {language}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      ID: {item._id}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex items-center mb-4">
          <AlertCircle size={20} className="text-red-500 mr-4" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            style={{ 
              padding: '8px 16px', 
              color: '#4b5563', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              backgroundColor: '#ffffff'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc2626', 
              color: '#ffffff', 
              borderRadius: '6px',
              border: 'none'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Item Form Modal
const ItemModal = ({ isOpen, onClose, item, onSave, credentials }) => {
  const [formData, setFormData] = useState({
    phrases: [],
    targetKey: '',
    language: 'en',
    priority: 1,
    isActive: true,
    ...item
  });

  const [currentPhrase, setCurrentPhrase] = useState('');
  const [showContentSearch, setShowContentSearch] = useState(false);

  // Update form data when item prop changes (for editing)
  useEffect(() => {
    if (item) {
      // Editing mode - populate with item data
      setFormData({
        phrases: item.phrases || [],
        targetKey: item.targetKey || '',
        language: item.language || 'en',
        priority: item.priority || 1,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    } else {
      // New item mode - reset to defaults
      setFormData({
        phrases: [],
        targetKey: '',
        language: 'en',
        priority: 1,
        isActive: true
      });
    }
  }, [item]);

  const handleSave = () => {
    if (formData.targetKey && formData.phrases.length > 0) {
      onSave(formData);
      onClose();
    }
  };

  const addPhrase = () => {
    if (currentPhrase.trim()) {
      setFormData({
        ...formData,
        phrases: [...formData.phrases, currentPhrase.trim()]
      });
      setCurrentPhrase('');
    }
  };

  const removePhrase = (index) => {
    setFormData({
      ...formData,
      phrases: formData.phrases.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPhrase();
    }
  };

  const handleSelectContent = (contentId, displayName) => {
    setFormData({
      ...formData,
      targetKey: contentId
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 mx-4" style={{ width: '75vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {item ? 'Edit Pinned Item' : 'New Pinned Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Phrases *
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentPhrase}
                onChange={(e) => setCurrentPhrase(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter search phrase"
              />
              <button
                onClick={addPhrase}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.phrases.map((phrase, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm">{phrase}</span>
                  <button
                    onClick={() => removePhrase(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Key (GUID) *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.targetKey}
                onChange={(e) => setFormData({...formData, targetKey: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Content GUID from ContentLink.GuidValue"
              />
              <button
                type="button"
                onClick={() => setShowContentSearch(true)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <Search size={16} style={{ marginRight: '4px' }} />
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter GUID manually or use Search to find content from your Optimizely site
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Language code (e.g., en, sv)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers have higher priority. Only top 5 items are shown.
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="itemIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="itemIsActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
      
      <ContentSearchModal
        isOpen={showContentSearch}
        onClose={() => setShowContentSearch(false)}
        onSelectContent={handleSelectContent}
        credentials={credentials}
      />
    </div>
  );
};

// Main Component
export default function PinnedResultsManager() {
  const [credentials, setCredentials] = useState(null);
  const [client, setClient] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteItemDialog, setShowDeleteItemDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load credentials from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem('optigraph-credentials');
    if (stored) {
      try {
        setCredentials(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load stored credentials:', error);
      }
    }
  }, []);

  // Initialize client when credentials change
  useEffect(() => {
    if (credentials) {
      setClient(new OptimizelyGraphClient(credentials, false));
    }
  }, [credentials]);

  // Load collections when client is ready
  useEffect(() => {
    if (client) {
      loadCollections();
    }
  }, [client, loadCollections]);

  // Load items when collection is selected
  useEffect(() => {
    if (client && selectedCollection) {
      loadItems();
    }
  }, [client, selectedCollection, loadItems]);

  const loadCollections = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const data = await client.getCollections();
      setCollections(data || []);
      setError(null);
    } catch (err) {
      setError(`Failed to load collections: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    if (!client || !selectedCollection) return;
    setLoading(true);
    try {
      const data = await client.getCollectionItems(selectedCollection.id);
      // API returns items array directly, convert phrases back to array format for UI
      const items = (data || []).map(item => ({
        ...item,
        phrases: typeof item.phrases === 'string' ? item.phrases.split(',') : item.phrases
      }));
      setItems(items);
      setError(null);
    } catch (err) {
      setError(`Failed to load items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = (creds) => {
    setCredentials(creds);
    // Save to localStorage in production
    localStorage.setItem('optigraph-credentials', JSON.stringify(creds));
    setError(null);
  };

  const handleRefresh = async () => {
    if (selectedCollection) {
      await loadItems();
    }
    await loadCollections();
  };


  const handleCreateCollection = async (collectionData) => {
    if (!client) return;
    try {
      await client.createCollection(collectionData);
      await loadCollections();
      setError(null);
    } catch (err) {
      setError(`Failed to create collection: ${err.message}`);
    }
  };

  const handleUpdateCollection = async (collectionData) => {
    if (!client || !editingCollection) return;
    try {
      await client.updateCollection(editingCollection.id, collectionData);
      await loadCollections();
      setError(null);
    } catch (err) {
      setError(`Failed to update collection: ${err.message}`);
    }
  };

  const handleDeleteCollection = async (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCollection = async () => {
    if (!client || !collectionToDelete) return;
    try {
      await client.deleteCollection(collectionToDelete.id);
      await loadCollections();
      if (selectedCollection?.id === collectionToDelete.id) {
        setSelectedCollection(null);
        setItems([]);
      }
      setError(null);
      setCollectionToDelete(null);
    } catch (err) {
      setError(`Failed to delete collection: ${err.message}`);
    }
  };

  const handleCreateItem = async (itemData) => {
    if (!client || !selectedCollection) return;
    try {
      await client.createItem(selectedCollection.id, itemData);
      await loadItems();
      setError(null);
    } catch (err) {
      setError(`Failed to create item: ${err.message}`);
    }
  };

  const handleUpdateItem = async (itemData) => {
    if (!client || !selectedCollection || !editingItem) return;
    try {
      await client.updateItem(selectedCollection.id, editingItem.id, itemData);
      await loadItems();
      setError(null);
    } catch (err) {
      setError(`Failed to update item: ${err.message}`);
    }
  };

  const handleDeleteItem = async (item) => {
    setItemToDelete(item);
    setShowDeleteItemDialog(true);
  };

  const confirmDeleteItem = async () => {
    if (!client || !selectedCollection || !itemToDelete) return;
    try {
      await client.deleteItem(selectedCollection.id, itemToDelete.id);
      await loadItems();
      setError(null);
      setItemToDelete(null);
    } catch (err) {
      setError(`Failed to delete item: ${err.message}`);
    }
  };

  // Check if we need to show initial setup
  if (!credentials) {
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <Settings size={48} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pinned Results Manager
            </h1>
            <p className="text-gray-600 mb-4">
              Configure your Optimizely Graph credentials to get started
            </p>
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded mb-4">
              <strong>Getting Started:</strong> Enter your Optimizely Graph credentials to get started.
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Settings size={16} className="mr-2" />
              Configure Credentials
            </button>
          </div>
        </div>
        
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          credentials={credentials}
          onSave={handleSaveCredentials}
        />
      </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pinned Results</h1>
              <p className="text-sm text-gray-600">Manage pinned search results for Optimizely Graph</p>
            </div>
            <div className="flex space-x-3 items-center">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center disabled:opacity-50"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle size={16} className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Collections Panel */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Collections</h2>
                <button
                  onClick={() => {
                    setEditingCollection(null);
                    setShowCollectionModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  New
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : collections.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No collections found</div>
                ) : (
                  collections.map((collection) => (
                    <div
                      key={collection.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedCollection?.id === collection.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                      onClick={() => setSelectedCollection(collection)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{collection.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              collection.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            <span className="text-xs text-gray-500">
                              {collection.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCollection(collection);
                              setShowCollectionModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollection(collection);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Items Panel */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">Pinned Items</h2>
                  {selectedCollection && (
                    <p className="text-sm text-gray-600 mt-1">
                      Collection: {selectedCollection.title}
                    </p>
                  )}
                </div>
                {selectedCollection && (
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemModal(true);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
                  >
                    <Plus size={14} className="mr-1" />
                    New Item
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!selectedCollection ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search size={32} className="mx-auto mb-4 text-gray-300" />
                    <p>Select a collection to view its pinned items</p>
                  </div>
                ) : loading ? (
                  <div className="p-4 text-center text-gray-500">Loading items...</div>
                ) : items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No pinned items in this collection</p>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowItemModal(true);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create First Item
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              item.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            <span className="font-medium">Priority: {item.priority}</span>
                            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                              {item.language}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Phrases: </span>
                            {item.phrases.map((phrase, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                              >
                                {phrase}
                              </span>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Target: </span>
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                              {item.targetKey}
                            </code>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowItemModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        credentials={credentials}
        onSave={handleSaveCredentials}
      />
      
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        collection={editingCollection}
        onSave={editingCollection ? handleUpdateCollection : handleCreateCollection}
      />
      
      <ItemModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        item={editingItem}
        onSave={editingItem ? handleUpdateItem : handleCreateItem}
        credentials={credentials}
      />
      
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCollectionToDelete(null);
        }}
        onConfirm={confirmDeleteCollection}
        title=" Delete Collection"
        message={`Are you sure you want to delete "${collectionToDelete?.title}"? This action cannot be undone.`}
      />
      
      <ConfirmationDialog
        isOpen={showDeleteItemDialog}
        onClose={() => {
          setShowDeleteItemDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Delete Pinned Item"
        message={`Are you sure you want to delete this pinned item? This action cannot be undone.`}
      />
    </div>
    </>
  );
}