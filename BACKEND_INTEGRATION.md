# TaskUp - Flask Backend Integration Guide

This React frontend is ready to connect to your Flask backend. Here's how to integrate them:

## API Endpoints Expected

Your Flask backend should provide these REST API endpoints:

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `GET /api/goals/{id}` - Get specific goal
- `PUT /api/goals/{id}` - Update specific goal
- `DELETE /api/goals/{id}` - Delete specific goal

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

### Users (for future implementation)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

## Data Models Expected

### Goal Model
```json
{
  "id": 1,
  "title": "Goal Title",
  "description": "Goal description",
  "status": "pending", // or "done"
  "deadline": "2024-12-31",
  "priority": "medium", // "low", "medium", "high"
  "user_id": 1,
  "categories": [
    {
      "id": 1,
      "name": "Development"
    }
  ]
}
```

### Category Model
```json
{
  "id": 1,
  "name": "Development",
  "description": "Programming and development tasks"
}
```

## Frontend Configuration

Update these files to connect to your Flask backend:

### 1. Create API Service (`src/services/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:5000/api'; // Your Flask server URL

class ApiService {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const apiService = new ApiService();
```

### 2. Replace Mock Data

In these files, replace the mock data with API calls:

- `src/pages/Dashboard.tsx` - Replace `mockGoals` and `mockCategories` with API calls
- `src/pages/GoalDetail.tsx` - Replace mock data fetching with real API calls
- `src/pages/NewGoal.tsx` - Replace mock categories with API call
- `src/components/GoalForm.tsx` - Connect form submission to API

### 3. Example API Integration

Replace mock data in Dashboard.tsx:

```typescript
// Instead of mockGoals, use:
useEffect(() => {
  const fetchGoals = async () => {
    try {
      const goals = await apiService.get('/goals');
      setGoals(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };
  
  fetchGoals();
}, []);
```

## CORS Configuration

Make sure your Flask backend has CORS enabled:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

## Environment Variables

For production, use environment variables:

```bash
# .env
VITE_API_URL=https://your-flask-backend.onrender.com/api
```

Then update your API service:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Error Handling

The frontend includes toast notifications for success and error states. Make sure your Flask backend returns appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Next Steps

1. Set up your Flask backend with the expected endpoints
2. Replace the mock data in the frontend components with API calls
3. Test the integration between frontend and backend
4. Deploy both frontend (Vercel) and backend (Render) with proper environment configuration

The current frontend is fully functional with mock data and ready for your Flask backend integration!