import { HMACAuth } from '../utils/auth';
import type { GraphCredentials } from '../utils/auth';

export interface BestBetCollection {
  id?: string;
  name: string;
  description?: string;
  keywords: string[];
  urls: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BestBetsResponse {
  collections: BestBetCollection[];
  total?: number;
}

export class BestBetsApiService {
  private auth: HMACAuth;
  private baseUrl = 'https://cg.optimizely.com/api/bestbets';

  constructor(credentials: GraphCredentials) {
    this.auth = new HMACAuth({
      ...credentials,
      endpoint: this.baseUrl
    });
  }

  async getAllCollections(): Promise<BestBetsResponse> {
    try {
      const response = await this.auth.makeRequest('GET', '/collection');
      
      console.log('Raw API response:', response);
      
      // Handle different possible response structures
      let collections: any[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array
        collections = response;
      } else if (response.collections && Array.isArray(response.collections)) {
        // Response has a collections property
        collections = response.collections;
      } else if (response.data && Array.isArray(response.data)) {
        // Response has a data property
        collections = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        // Response has an items property
        collections = response.items;
      } else {
        // Fallback: empty array
        console.warn('Unexpected response structure:', response);
        collections = [];
      }
      
      console.log('Extracted collections:', collections);
      
      // Transform response to match our interface
      const transformedCollections = collections.map((collection: any) => ({
        ...collection,
        name: collection.title || collection.name || 'Untitled', // Convert title to name for our interface
        id: collection.id || collection._id || collection.uuid, // Handle different ID fields
        keywords: Array.isArray(collection.keywords) ? collection.keywords : [], // Ensure keywords is an array
        urls: Array.isArray(collection.urls) ? collection.urls : [], // Ensure urls is an array
        description: collection.description || '', // Ensure description is a string
        isActive: collection.isActive !== undefined ? collection.isActive : true // Default to active
      }));
      
      console.log('Transformed collections:', transformedCollections);
      
      return {
        collections: transformedCollections,
        total: response.total || collections.length
      };
    } catch (error) {
      console.error('Error fetching best bet collections:', error);
      throw error;
    }
  }

  async getCollectionById(id: string): Promise<BestBetCollection> {
    try {
      const response = await this.auth.makeRequest('GET', `/collection/${id}`);
      
      // Transform response to match our interface
      return {
        ...response,
        name: response.title || response.name // Convert title to name for our interface
      };
    } catch (error) {
      console.error(`Error fetching best bet collection ${id}:`, error);
      throw error;
    }
  }

  async createCollection(collection: Omit<BestBetCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<BestBetCollection> {
    try {
      // Transform the collection data to match the API expected format
      const apiPayload = {
        title: collection.name, // API expects 'title' not 'name'
        description: collection.description,
        keywords: collection.keywords,
        urls: collection.urls,
        isActive: collection.isActive
      };
      
      console.log('Creating collection with payload:', apiPayload);
      
      const response = await this.auth.makeRequest('POST', '/collection', apiPayload);
      
      // Transform response back to our interface format
      return {
        ...response,
        name: response.title // Convert title back to name for our interface
      };
    } catch (error) {
      console.error('Error creating best bet collection:', error);
      throw error;
    }
  }

  async updateCollection(id: string, collection: Partial<BestBetCollection>): Promise<BestBetCollection> {
    try {
      // Transform the collection data to match the API expected format
      const apiPayload: any = {};
      
      if (collection.name !== undefined) {
        apiPayload.title = collection.name; // API expects 'title' not 'name'
      }
      if (collection.description !== undefined) {
        apiPayload.description = collection.description;
      }
      if (collection.keywords !== undefined) {
        apiPayload.keywords = collection.keywords;
      }
      if (collection.urls !== undefined) {
        apiPayload.urls = collection.urls;
      }
      if (collection.isActive !== undefined) {
        apiPayload.isActive = collection.isActive;
      }
      
      console.log('Updating collection with payload:', apiPayload);
      
      const response = await this.auth.makeRequest('PUT', `/collection/${id}`, apiPayload);
      
      // Transform response back to our interface format
      return {
        ...response,
        name: response.title // Convert title back to name for our interface
      };
    } catch (error) {
      console.error(`Error updating best bet collection ${id}:`, error);
      throw error;
    }
  }

  async deleteCollection(id: string): Promise<void> {
    try {
      await this.auth.makeRequest('DELETE', `/collection/${id}`);
    } catch (error) {
      console.error(`Error deleting best bet collection ${id}:`, error);
      throw error;
    }
  }
}