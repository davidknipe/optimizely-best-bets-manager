import CryptoJS from 'crypto-js';

export interface GraphCredentials {
  accessKey: string;
  secretKey: string;
  endpoint: string;
}

export class HMACAuth {
  private accessKey: string;
  private secretKey: string;
  private endpoint: string;

  constructor(credentials: GraphCredentials) {
    this.accessKey = credentials.accessKey;
    this.secretKey = credentials.secretKey;
    this.endpoint = credentials.endpoint;
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateBodyHash(body: string): string {
    return CryptoJS.MD5(body).toString(CryptoJS.enc.Base64);
  }

  private generateSignature(method: string, path: string, timestamp: string, nonce: string, bodyHash: string): string {
    // String to sign format: accessKey + method + path + timestamp + nonce + bodyHash
    const stringToSign = `${this.accessKey}${method.toUpperCase()}${path}${timestamp}${nonce}${bodyHash}`;
    
    // Try to decode the secret key from base64, fallback to using it directly
    let secretKey: any;
    try {
      secretKey = CryptoJS.enc.Base64.parse(this.secretKey);
    } catch (e) {
      // If base64 parsing fails, use the secret key directly
      secretKey = this.secretKey;
    }
    
    // Generate HMAC-SHA256 signature
    const signature = CryptoJS.HmacSHA256(stringToSign, secretKey);
    return signature.toString(CryptoJS.enc.Base64);
  }

  public getAuthHeaders(method: string, path: string, body: string = '', useBasic: boolean = false): Record<string, string> {
    if (useBasic) {
      // Basic authentication fallback
      const credentials = btoa(`${this.accessKey}:${this.secretKey}`);
      return {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      };
    }
    
    const timestamp = Date.now().toString();
    const nonce = this.generateNonce();
    const bodyHash = this.generateBodyHash(body);
    const signature = this.generateSignature(method, path, timestamp, nonce, bodyHash);
    
    return {
      'Authorization': `epi-hmac ${this.accessKey}:${timestamp}:${nonce}:${signature}`,
      'Content-Type': 'application/json'
    };
  }

  public async makeRequest(method: string, path: string, body?: any): Promise<any> {
    const url = `${this.endpoint}${path}`;
    
    // Use Basic authentication since it's working reliably
    const bodyString = body && (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : '';
    const headers = this.getAuthHeaders(method, path, bodyString, true); // Always use Basic auth
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('Making request:', {
        url,
        method,
        authType: 'Basic',
        bodyLength: bodyString.length
      });
    }
    
    const config: RequestInit = {
      method,
      headers,
    };

    if (bodyString) {
      config.body = bodyString;
    }

    const response = await fetch(url, config);
    
    if (import.meta.env.DEV) {
      console.log('Response status:', response.status, response.statusText);
    }
    
    if (!response.ok) {
      const responseText = await response.text();
      if (import.meta.env.DEV) {
        console.log('Error response body:', responseText);
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // If no content-type or content-length is 0, return empty object
    if (!contentType || contentLength === '0') {
      return {};
    }
    
    // If content-type doesn't include JSON, return empty object
    if (!contentType.includes('application/json')) {
      return {};
    }
    
    // Try to get the response text first
    const responseText = await response.text();
    
    // If response is empty or just whitespace, return empty object
    if (!responseText || responseText.trim() === '') {
      return {};
    }
    
    // Try to parse JSON, with fallback to empty object
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.warn('Failed to parse JSON response:', responseText);
      return {};
    }
  }
}

export const saveCredentials = (credentials: GraphCredentials): void => {
  localStorage.setItem('optimizely-graph-credentials', JSON.stringify(credentials));
};

export const loadCredentials = (): GraphCredentials | null => {
  const stored = localStorage.getItem('optimizely-graph-credentials');
  return stored ? JSON.parse(stored) : null;
};

export const clearCredentials = (): void => {
  localStorage.removeItem('optimizely-graph-credentials');
};