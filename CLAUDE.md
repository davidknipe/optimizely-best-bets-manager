# Optimizely Best Bets Manager

## Project Overview
This is a React-based web application for managing "pinned results" (best bets) in Optimizely Graph. The application allows users to create collections of pinned search results and manage the individual items within those collections.

## Key Features
- **Collection Management**: Create, edit, and delete collections of pinned results
- **Item Management**: Add, edit, and delete individual pinned items within collections
- **HMAC Authentication**: Secure API communication with Optimizely Graph using HMAC signatures
- **Demo Mode**: Test the interface with mock data without real API calls
- **Real-time Status**: Visual indicators for active/inactive states
- **Priority Management**: Set priorities for pinned items (lower numbers = higher priority)

## Technical Architecture

### Frontend
- **Framework**: React 18 with hooks
- **Styling**: CSS with Tailwind-like utility classes
- **Icons**: Lucide React icon library
- **State Management**: React hooks (useState, useEffect)
- **Storage**: localStorage for credential persistence

### API Integration
- **Authentication**: HMAC-SHA256 signatures for Optimizely Graph API
- **Base URL**: https://latest.cg.optimizely.com
- **Mock Data**: Built-in demo mode for development/testing

## File Structure
```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React entry point
└── [other React files]
```

## Available Scripts
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## API Endpoints Used
- `GET /api/pinned/collections` - Get all collections
- `PUT /api/pinned/collections` - Create new collection
- `PUT /api/pinned/collections/{id}` - Update collection
- `DELETE /api/pinned/collections/{id}` - Delete collection
- `GET /api/pinned/collections/{id}/items` - Get items in collection
- `PUT /api/pinned/collections/{id}/items` - Create new item
- `PUT /api/pinned/collections/{id}/items/{itemId}` - Update item
- `DELETE /api/pinned/collections/{id}/items/{itemId}` - Delete item

## Key Components

### Main App Component (`PinnedResultsManager`)
- Handles authentication and credential management
- Manages collection and item state
- Provides UI for switching between demo and real API modes

### Settings Modal
- Configure Optimizely Graph credentials (App Key, Secret, Gateway URL)
- Credentials are stored in localStorage for persistence

### Collection Modal
- Create/edit collections with title and active status
- Simple form validation for required fields

### Item Modal
- Create/edit pinned items with:
  - Search phrases (array of strings)
  - Target Key (GUID from ContentLink.GuidValue)
  - Language code (e.g., 'en', 'sv')
  - Priority (1-100, lower = higher priority)
  - Active status

### OptimizelyGraphClient
- Handles HMAC authentication
- Provides methods for all CRUD operations
- Supports mock data mode for development

## Authentication Details
The application uses HMAC authentication with the following signature format:
```
epi-hmac {appKey}:{timestamp}:{nonce}:{signature}
```

The signature is generated from: `appKey + method + path + timestamp + nonce + bodyHash`

## Data Models

### Collection
```javascript
{
  id: string,
  title: string,
  isActive: boolean
}
```

### Pinned Item
```javascript
{
  id: string,
  phrases: string[],
  targetKey: string,  // GUID from ContentLink.GuidValue
  language: string,   // e.g., 'en', 'sv'
  priority: number,   // 1-100, lower = higher priority
  isActive: boolean
}
```

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Either:
   - Click "Try Demo Mode" to explore with mock data
   - Click "Configure Credentials" to enter real Optimizely Graph credentials

## Current Status
The application is fully functional with:
- ✅ Complete CRUD operations for collections and items
- ✅ HMAC authentication implementation
- ✅ Demo mode with mock data
- ✅ Responsive UI with proper error handling
- ✅ Credential persistence via localStorage
- ✅ Real-time status indicators and priority management

## Development Notes
- The app starts in setup mode if no credentials are stored
- Demo mode uses hardcoded mock data for testing the interface
- Real API calls require valid Optimizely Graph HMAC credentials
- All forms include validation for required fields
- Priority system: only top 5 items per collection are shown in search results